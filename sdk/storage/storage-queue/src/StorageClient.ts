// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { StorageClientContext } from "./generated/src/storageClientContext";
import { Pipeline } from "./Pipeline";
import { getAccountNameFromUrl, getStorageClientContext } from "./utils/utils.common";
import { SpanOptions } from "@azure/core-tracing";

/**
 * An interface for options common to every remote operation.
 */
export interface CommonOptions {
  /**
   * Options to configure spans created when tracing is enabled.
   */
  tracingOptions?: OperationTracingOptions;
}

export interface OperationTracingOptions {
  /**
   * OpenTelemetry SpanOptions used to create a span when tracing is enabled.
   */
  spanOptions?: SpanOptions;
}

/**
 * A StorageClient represents a based client class for {@link QueueServiceClient}, {@link QueueClient} and etc.
 *
 * @export
 * @class StorageClient
 */
export abstract class StorageClient {
  /**
   * URL string value.
   *
   * @type {string}
   * @memberof StorageClient
   */
  public readonly url: string;
  public readonly accountName: string;

  /**
   * Request policy pipeline.
   *
   * @internal
   * @ignore
   * @type {Pipeline}
   * @memberof StorageClient
   */
  protected readonly pipeline: Pipeline;

  /**
   * StorageClientContext is a reference to protocol layer operations entry, which is
   * generated by AutoRest generator.
   *
   * @protected
   * @type {StorageClientContext}
   * @memberof StorageClient
   */
  protected readonly storageClientContext: StorageClientContext;

  /**
   * Creates an instance of StorageClient.
   * @param {string} url
   * @param {Pipeline} pipeline
   * @memberof StorageClient
   */
  protected constructor(url: string, pipeline: Pipeline) {
    this.url = url;
    this.accountName = getAccountNameFromUrl(url);
    this.pipeline = pipeline;
    this.storageClientContext = getStorageClientContext(url, pipeline);
  }
}
