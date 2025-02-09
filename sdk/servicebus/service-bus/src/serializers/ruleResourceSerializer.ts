// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { HttpOperationResponse } from "@azure/core-http";
import * as Constants from "../util/constants";
import {
  serializeToAtomXmlRequest,
  deserializeAtomXmlResponse,
  AtomXmlSerializer
} from "../util/atomXmlHelper";
import {
  getIntegerOrUndefined,
  getJSObjectOrUndefined,
  getStringOrUndefined,
  getBooleanOrUndefined
} from "../util/utils";
import { CorrelationFilter } from "../core/managementClient";

/**
 * @ignore
 * Builds the rule options object from the user provided options.
 * Handles the differences in casing for the property names, converts values to string and ensures the
 * right order as expected by the service
 * @param name
 * @param ruleOptions
 */
export function buildRuleOptions(name: string, ruleOptions: RuleOptions = {}): InternalRuleOptions {
  const internalRuleOptions: InternalRuleOptions = Object.assign({}, ruleOptions, { name: name });
  return internalRuleOptions;
}

/**
 * @ignore
 * Builds the rule object from the raw json object gotten after deserializing the response
 * from the service
 * @param rawRule
 */
export function buildRule(rawRule: any): Rule | undefined {
  if (rawRule == undefined) {
    return undefined;
  }
  return {
    ruleName: rawRule["RuleName"],
    topicName: rawRule["TopicName"],
    subscriptionName: rawRule["SubscriptionName"],
    filter: getTopicFilterOrUndefined(rawRule["Filter"]),
    action: getRuleActionOrUndefined(rawRule["Action"]),
    createdAt: rawRule["CreatedAt"]
  };
}

/**
 *  @ignore
 * Helper utility to retrieve `filter` value from given input,
 * or undefined if not passed in.
 * @param value
 */
function getTopicFilterOrUndefined(value: any): SqlFilter | CorrelationFilter | undefined {
  if (value == undefined) {
    return undefined;
  }
  let result: SqlFilter | CorrelationFilter | undefined;

  if (value["SqlExpression"] != undefined) {
    result = {
      sqlExpression: value["SqlExpression"],
      sqlParameters: getSqlParametersOrUndefined(value["Parameters"]),
      compatibilityLevel: getIntegerOrUndefined(value["CompatibilityLevel"]),
      requiresPreprocessing: getBooleanOrUndefined(value["RequiresPreprocessing"])
    };
  } else if (value["CorrelationId"] != undefined) {
    result = {
      correlationId: getStringOrUndefined(value["CorrelationId"]),
      label: getStringOrUndefined(value["Label"]),
      to: getStringOrUndefined(value["To"]),
      replyTo: getStringOrUndefined(value["ReplyTo"]),
      replyToSessionId: getStringOrUndefined(value["ReplyToSessionId"]),
      sessionId: getStringOrUndefined(value["SessionId"]),
      messageId: getStringOrUndefined(value["MessageId"]),
      contentType: getStringOrUndefined(value["ContentType"]),
      userProperties: value["UserProperties"]
    };
  }
  return result;
}

/**
 *  @ignore
 * Helper utility to retrieve rule `action` value from given input,
 * or undefined if not passed in.
 * @param value
 */
function getRuleActionOrUndefined(value: any): SqlAction | undefined {
  if (value == undefined) {
    return undefined;
  } else {
    return {
      sqlExpression: value["SqlExpression"],
      sqlParameters: getSqlParametersOrUndefined(value["Parameters"]),
      compatibilityLevel: getIntegerOrUndefined(value["CompatibilityLevel"]),
      requiresPreprocessing: getBooleanOrUndefined(value["RequiresPreprocessing"])
    };
  }
}

/**
 * Represents settable options on a rule
 */
export interface RuleOptions {
  /**
   * Defines the expression that the rule evaluates. The expression string is interpreted as a SQL92 expression which must evaluate to True or False. Only one between a correlation and a sql expression can be defined.
   */
  filter?: SqlFilter | CorrelationFilter;

  /**
   * The SQL like expression that can be executed on the message should the associated filter apply.
   */
  action?: SqlAction;
}

/**
 * @ignore
 * Internal representation of settable options on a rule
 */
export interface InternalRuleOptions extends RuleOptions {
  /**
   * Name of the rule.
   */
  name?: string;
}

/**
 * Represents all attributes of a rule entity
 */
export interface Rule extends RuleOptions {
  /**
   * Name of the rule
   */
  ruleName?: string;

  /**
   * Name of topic
   */
  topicName?: string;

  /**
   * Name of subscription
   */
  subscriptionName?: string;

  /**
   * Created at timestamp
   */
  createdAt?: string;
}

/**
 * Represents all possible fields on SqlAction
 */
export type SqlAction = SqlFilter;

/**
 * Represents all possible fields on SqlFilter
 */
export interface SqlFilter {
  /**
   * SQL expression to use.
   */
  sqlExpression?: string;

  /**
   * SQL parameters to the expression
   */
  sqlParameters?: SqlParameter[];

  /**
   * This property is reserved for future use. An integer value showing the compatibility level, currently hard-coded to 20.
   */
  compatibilityLevel?: number;

  /**
   * Boolean value indicating whether the SQL filter expression requires preprocessing
   */
  requiresPreprocessing?: boolean;
}

/**
 * @ignore RuleResourceSerializer for serializing / deserializing Rule entities
 */
export class RuleResourceSerializer implements AtomXmlSerializer {
  serialize(rule: InternalRuleOptions): object {
    const resource: { Name: any; Filter: any; Action: any } = {
      Filter: {},
      Action: {},
      Name: rule.name
    };

    if (rule.filter == undefined) {
      // Defaults to creating a true filter if none specified
      resource.Filter = {
        SqlExpression: "1=1",
        CompatibilityLevel: 20
      };
      resource.Filter[Constants.XML_METADATA_MARKER] = {
        "p4:type": "SqlFilter",
        "xmlns:p4": "http://www.w3.org/2001/XMLSchema-instance"
      };
    } else {
      if (rule.filter.hasOwnProperty("sqlExpression")) {
        const sqlFilter: SqlFilter = rule.filter as SqlFilter;
        resource.Filter = {
          SqlExpression: sqlFilter.sqlExpression,
          Parameters: getRawSqlParameters(sqlFilter.sqlParameters),
          CompatibilityLevel: 20,
          RequiresPreprocessing: getStringOrUndefined(sqlFilter.requiresPreprocessing)
        };
        resource.Filter[Constants.XML_METADATA_MARKER] = {
          "p4:type": "SqlFilter",
          "xmlns:p4": "http://www.w3.org/2001/XMLSchema-instance"
        };
      } else {
        const correlationFilter: CorrelationFilter = rule.filter as CorrelationFilter;

        resource.Filter = {
          CorrelationId: correlationFilter.correlationId,
          Label: correlationFilter.label,
          To: correlationFilter.to,
          ReplyTo: correlationFilter.replyTo,
          ReplyToSessionId: correlationFilter.replyToSessionId,
          ContentType: correlationFilter.contentType,
          SessionId: correlationFilter.sessionId,
          MessageId: correlationFilter.messageId,
          Properties: correlationFilter.userProperties
        };
        resource.Filter[Constants.XML_METADATA_MARKER] = {
          "p4:type": "CorrelationFilter",
          "xmlns:p4": "http://www.w3.org/2001/XMLSchema-instance"
        };
      }
    }

    if (rule.action == undefined || rule.action.sqlExpression == undefined) {
      // Defaults to creating an empty rule action instance if none specified
      resource.Action = {};
      resource.Action[Constants.XML_METADATA_MARKER] = {
        "p4:type": "EmptyRuleAction",
        "xmlns:p4": "http://www.w3.org/2001/XMLSchema-instance"
      };
    } else {
      resource.Action = {
        SqlExpression: rule.action.sqlExpression,
        Parameters: getRawSqlParameters(rule.action.sqlParameters),
        CompatibilityLevel: 20,
        RequiresPreprocessing: getStringOrUndefined(rule.action.requiresPreprocessing)
      };
      resource.Action[Constants.XML_METADATA_MARKER] = {
        "p4:type": "SqlRuleAction",
        "xmlns:p4": "http://www.w3.org/2001/XMLSchema-instance"
      };
    }

    return serializeToAtomXmlRequest("RuleDescription", resource);
  }

  async deserialize(response: HttpOperationResponse): Promise<HttpOperationResponse> {
    return deserializeAtomXmlResponse(["TopicName", "SubscriptionName", "RuleName"], response);
  }
}

enum SqlParameterType {
  Integer = "l28:int",
  String = "l28:string",
  Long = "l28:long",
  Date = "l28:date"
}
/**
 * Represents type of SQL `Parameter` in ATOM based management operations
 */
export type SqlParameter = {
  key: string;
  value: string | number;
  type: string;
};

/**
 * Internal representation of SQL parameter info
 */
type RawSqlParameter = {
  Key: string;
  Value: any;
};

/**
 *  @ignore
 * Helper utility to retrieve array of `SqlParameter` from given input,
 * or undefined if not passed in.
 * @param value
 */
function getSqlParametersOrUndefined(value: any): SqlParameter[] | undefined {
  const parameters: SqlParameter[] = [];

  // Ignore special case as Service Bus treats "" as a valid value for SQL parameters
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  const jsObject: any = getJSObjectOrUndefined(value);
  if (jsObject == undefined) {
    return undefined;
  }

  try {
    let rawParameters = jsObject["KeyValueOfstringanyType"];
    if (Array.isArray(rawParameters)) {
      for (let i = 0; i < rawParameters.length; i++) {
        parameters.push(buildSqlParameter(rawParameters[i]));
      }
    } else {
      parameters.push(buildSqlParameter(rawParameters));
    }
    return parameters;
  } catch (err) {
    throw new TypeError(
      `${jsObject} expected to be an array of Parameter instances, or undefined :: ${err.message}`
    );
  }
}

/**
 * Helper utility to build an instance of parsed SQL parameteras `Parameter` from given input,
 * @param value
 */
function buildSqlParameter(value: RawSqlParameter): SqlParameter {
  const rawValue = value["Value"]["_"];
  const type = value["Value"]["$"]["i:type"].toString().substring(5);
  let parsedValue: any;
  switch (type) {
    case "int":
      parsedValue = getIntegerOrUndefined(rawValue);
      break;
    case "string":
    case "long":
    case "date":
      parsedValue = rawValue;
      break;

    default:
      throw new Error(
        `Invalid type "${type}" on the SQL Parameter. Must be either of "interface, "string", "long" or "date".`
      );
  }
  const parameter: SqlParameter = {
    key: value["Key"],
    value: parsedValue,
    type: type
  };
  return parameter;
}

/**
 *  @ignore
 * Helper utility to extract array of `RawSqlParameter` instances from given input,
 * or undefined if not passed in.
 * @param value
 */
export function getRawSqlParameters(parameters: SqlParameter[] | undefined): any {
  if (!Array.isArray(parameters)) {
    return undefined;
  }
  const rawParameters: RawSqlParameter[] = [];
  for (let i = 0; i < parameters.length; i++) {
    rawParameters.push(buildRawSqlParameter(parameters[i]));
  }
  return { KeyValueOfstringanyType: rawParameters };
}

/**
 * Helper utility to build an instance of raw SQL parameter as `RawSqlParameter` from given `SqlParameter` input,
 * @param parameter parsed SQL parameter instance
 */
function buildRawSqlParameter(parameter: SqlParameter): RawSqlParameter {
  let type: SqlParameterType;
  switch (parameter.type) {
    case "int":
      type = SqlParameterType.Integer;
      break;
    case "string":
      type = SqlParameterType.String;
      break;
    case "long":
      type = SqlParameterType.Long;
      break;
    case "date":
      type = SqlParameterType.Date;
      break;

    default:
      throw new Error(
        `Invalid type "${parameter.type}"supplied for the SQL Parameter. Must be either of "interface, "string", "long" or "date".`
      );
  }

  const rawParameterValue: any = {};
  rawParameterValue[Constants.XML_METADATA_MARKER] = {
    "p4:type": type.valueOf(),
    "xmlns:l28": "http://www.w3.org/2001/XMLSchema"
  };
  rawParameterValue[Constants.XML_VALUE_MARKER] = parameter.value;

  const rawParameter: RawSqlParameter = {
    Key: parameter.key,
    Value: rawParameterValue
  };
  return rawParameter;
}
