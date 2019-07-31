/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

import * as msRest from "@azure/ms-rest-js";
import * as Models from "../models";
import * as Mappers from "../models/iotSecuritySolutionMappers";
import * as Parameters from "../models/parameters";
import { SecurityCenterContext } from "../securityCenterContext";

/** Class representing a IotSecuritySolution. */
export class IotSecuritySolution {
  private readonly client: SecurityCenterContext;

  /**
   * Create a IotSecuritySolution.
   * @param {SecurityCenterContext} client Reference to the service client.
   */
  constructor(client: SecurityCenterContext) {
    this.client = client;
  }

  /**
   * Details of a specific iot security solution
   * @param resourceGroupName The name of the resource group within the user's subscription. The name
   * is case insensitive.
   * @param solutionName The solution manager name
   * @param [options] The optional parameters
   * @returns Promise<Models.IotSecuritySolutionGetResponse>
   */
  get(resourceGroupName: string, solutionName: string, options?: msRest.RequestOptionsBase): Promise<Models.IotSecuritySolutionGetResponse>;
  /**
   * @param resourceGroupName The name of the resource group within the user's subscription. The name
   * is case insensitive.
   * @param solutionName The solution manager name
   * @param callback The callback
   */
  get(resourceGroupName: string, solutionName: string, callback: msRest.ServiceCallback<Models.IoTSecuritySolutionModel>): void;
  /**
   * @param resourceGroupName The name of the resource group within the user's subscription. The name
   * is case insensitive.
   * @param solutionName The solution manager name
   * @param options The optional parameters
   * @param callback The callback
   */
  get(resourceGroupName: string, solutionName: string, options: msRest.RequestOptionsBase, callback: msRest.ServiceCallback<Models.IoTSecuritySolutionModel>): void;
  get(resourceGroupName: string, solutionName: string, options?: msRest.RequestOptionsBase | msRest.ServiceCallback<Models.IoTSecuritySolutionModel>, callback?: msRest.ServiceCallback<Models.IoTSecuritySolutionModel>): Promise<Models.IotSecuritySolutionGetResponse> {
    return this.client.sendOperationRequest(
      {
        resourceGroupName,
        solutionName,
        options
      },
      getOperationSpec,
      callback) as Promise<Models.IotSecuritySolutionGetResponse>;
  }

  /**
   * Create new solution manager
   * @param resourceGroupName The name of the resource group within the user's subscription. The name
   * is case insensitive.
   * @param solutionName The solution manager name
   * @param iotSecuritySolutionData The security solution data
   * @param [options] The optional parameters
   * @returns Promise<Models.IotSecuritySolutionCreateResponse>
   */
  create(resourceGroupName: string, solutionName: string, iotSecuritySolutionData: Models.IoTSecuritySolutionModel, options?: msRest.RequestOptionsBase): Promise<Models.IotSecuritySolutionCreateResponse>;
  /**
   * @param resourceGroupName The name of the resource group within the user's subscription. The name
   * is case insensitive.
   * @param solutionName The solution manager name
   * @param iotSecuritySolutionData The security solution data
   * @param callback The callback
   */
  create(resourceGroupName: string, solutionName: string, iotSecuritySolutionData: Models.IoTSecuritySolutionModel, callback: msRest.ServiceCallback<Models.IoTSecuritySolutionModel>): void;
  /**
   * @param resourceGroupName The name of the resource group within the user's subscription. The name
   * is case insensitive.
   * @param solutionName The solution manager name
   * @param iotSecuritySolutionData The security solution data
   * @param options The optional parameters
   * @param callback The callback
   */
  create(resourceGroupName: string, solutionName: string, iotSecuritySolutionData: Models.IoTSecuritySolutionModel, options: msRest.RequestOptionsBase, callback: msRest.ServiceCallback<Models.IoTSecuritySolutionModel>): void;
  create(resourceGroupName: string, solutionName: string, iotSecuritySolutionData: Models.IoTSecuritySolutionModel, options?: msRest.RequestOptionsBase | msRest.ServiceCallback<Models.IoTSecuritySolutionModel>, callback?: msRest.ServiceCallback<Models.IoTSecuritySolutionModel>): Promise<Models.IotSecuritySolutionCreateResponse> {
    return this.client.sendOperationRequest(
      {
        resourceGroupName,
        solutionName,
        iotSecuritySolutionData,
        options
      },
      createOperationSpec,
      callback) as Promise<Models.IotSecuritySolutionCreateResponse>;
  }

  /**
   * update existing Security Solution tags or user defined resources. To update other fields use the
   * CreateOrUpdate method
   * @param resourceGroupName The name of the resource group within the user's subscription. The name
   * is case insensitive.
   * @param solutionName The solution manager name
   * @param updateIotSecuritySolutionData The security solution data
   * @param [options] The optional parameters
   * @returns Promise<Models.IotSecuritySolutionUpdateResponse>
   */
  update(resourceGroupName: string, solutionName: string, updateIotSecuritySolutionData: Models.UpdateIotSecuritySolutionData, options?: msRest.RequestOptionsBase): Promise<Models.IotSecuritySolutionUpdateResponse>;
  /**
   * @param resourceGroupName The name of the resource group within the user's subscription. The name
   * is case insensitive.
   * @param solutionName The solution manager name
   * @param updateIotSecuritySolutionData The security solution data
   * @param callback The callback
   */
  update(resourceGroupName: string, solutionName: string, updateIotSecuritySolutionData: Models.UpdateIotSecuritySolutionData, callback: msRest.ServiceCallback<Models.IoTSecuritySolutionModel>): void;
  /**
   * @param resourceGroupName The name of the resource group within the user's subscription. The name
   * is case insensitive.
   * @param solutionName The solution manager name
   * @param updateIotSecuritySolutionData The security solution data
   * @param options The optional parameters
   * @param callback The callback
   */
  update(resourceGroupName: string, solutionName: string, updateIotSecuritySolutionData: Models.UpdateIotSecuritySolutionData, options: msRest.RequestOptionsBase, callback: msRest.ServiceCallback<Models.IoTSecuritySolutionModel>): void;
  update(resourceGroupName: string, solutionName: string, updateIotSecuritySolutionData: Models.UpdateIotSecuritySolutionData, options?: msRest.RequestOptionsBase | msRest.ServiceCallback<Models.IoTSecuritySolutionModel>, callback?: msRest.ServiceCallback<Models.IoTSecuritySolutionModel>): Promise<Models.IotSecuritySolutionUpdateResponse> {
    return this.client.sendOperationRequest(
      {
        resourceGroupName,
        solutionName,
        updateIotSecuritySolutionData,
        options
      },
      updateOperationSpec,
      callback) as Promise<Models.IotSecuritySolutionUpdateResponse>;
  }

  /**
   * Create new solution manager
   * @param resourceGroupName The name of the resource group within the user's subscription. The name
   * is case insensitive.
   * @param solutionName The solution manager name
   * @param [options] The optional parameters
   * @returns Promise<msRest.RestResponse>
   */
  deleteMethod(resourceGroupName: string, solutionName: string, options?: msRest.RequestOptionsBase): Promise<msRest.RestResponse>;
  /**
   * @param resourceGroupName The name of the resource group within the user's subscription. The name
   * is case insensitive.
   * @param solutionName The solution manager name
   * @param callback The callback
   */
  deleteMethod(resourceGroupName: string, solutionName: string, callback: msRest.ServiceCallback<void>): void;
  /**
   * @param resourceGroupName The name of the resource group within the user's subscription. The name
   * is case insensitive.
   * @param solutionName The solution manager name
   * @param options The optional parameters
   * @param callback The callback
   */
  deleteMethod(resourceGroupName: string, solutionName: string, options: msRest.RequestOptionsBase, callback: msRest.ServiceCallback<void>): void;
  deleteMethod(resourceGroupName: string, solutionName: string, options?: msRest.RequestOptionsBase | msRest.ServiceCallback<void>, callback?: msRest.ServiceCallback<void>): Promise<msRest.RestResponse> {
    return this.client.sendOperationRequest(
      {
        resourceGroupName,
        solutionName,
        options
      },
      deleteMethodOperationSpec,
      callback);
  }
}

// Operation Specifications
const serializer = new msRest.Serializer(Mappers);
const getOperationSpec: msRest.OperationSpec = {
  httpMethod: "GET",
  path: "subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Security/iotSecuritySolutions/{solutionName}",
  urlParameters: [
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.solutionName
  ],
  queryParameters: [
    Parameters.apiVersion3
  ],
  headerParameters: [
    Parameters.acceptLanguage
  ],
  responses: {
    200: {
      bodyMapper: Mappers.IoTSecuritySolutionModel
    },
    default: {
      bodyMapper: Mappers.CloudError
    }
  },
  serializer
};

const createOperationSpec: msRest.OperationSpec = {
  httpMethod: "PUT",
  path: "subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Security/iotSecuritySolutions/{solutionName}",
  urlParameters: [
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.solutionName
  ],
  queryParameters: [
    Parameters.apiVersion3
  ],
  headerParameters: [
    Parameters.acceptLanguage
  ],
  requestBody: {
    parameterPath: "iotSecuritySolutionData",
    mapper: {
      ...Mappers.IoTSecuritySolutionModel,
      required: true
    }
  },
  responses: {
    200: {
      bodyMapper: Mappers.IoTSecuritySolutionModel
    },
    201: {
      bodyMapper: Mappers.IoTSecuritySolutionModel
    },
    default: {
      bodyMapper: Mappers.CloudError
    }
  },
  serializer
};

const updateOperationSpec: msRest.OperationSpec = {
  httpMethod: "PATCH",
  path: "subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Security/iotSecuritySolutions/{solutionName}",
  urlParameters: [
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.solutionName
  ],
  queryParameters: [
    Parameters.apiVersion3
  ],
  headerParameters: [
    Parameters.acceptLanguage
  ],
  requestBody: {
    parameterPath: "updateIotSecuritySolutionData",
    mapper: {
      ...Mappers.UpdateIotSecuritySolutionData,
      required: true
    }
  },
  responses: {
    200: {
      bodyMapper: Mappers.IoTSecuritySolutionModel
    },
    default: {
      bodyMapper: Mappers.CloudError
    }
  },
  serializer
};

const deleteMethodOperationSpec: msRest.OperationSpec = {
  httpMethod: "DELETE",
  path: "subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Security/iotSecuritySolutions/{solutionName}",
  urlParameters: [
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.solutionName
  ],
  queryParameters: [
    Parameters.apiVersion3
  ],
  headerParameters: [
    Parameters.acceptLanguage
  ],
  responses: {
    200: {},
    204: {},
    default: {
      bodyMapper: Mappers.CloudError
    }
  },
  serializer
};
