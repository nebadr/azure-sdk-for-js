// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { getTracer, Span, SpanOptions, SpanKind } from "@azure/core-tracing";
import { OperationTracingOptions } from "../StorageClient";

/**
 * Creates a span using the global tracer.
 * @param name The name of the operation being performed.
 * @param tracingOptions The options for the underlying http request.
 */
export function createSpan(
  operationName: string,
  tracingOptions: OperationTracingOptions = {}
): { span: Span; spanOptions: SpanOptions } {
  const tracer = getTracer();
  const spanOptions: SpanOptions = {
    ...tracingOptions.spanOptions,
    kind: SpanKind.CLIENT
  };

  const span = tracer.startSpan(`Azure.Storage.Blob.${operationName}`, spanOptions);
  span.setAttribute("component", "storage");

  let newOptions = tracingOptions.spanOptions || {};
  if (span.isRecordingEvents()) {
    newOptions = {
      ...tracingOptions,
      parent: span
    };
  }

  return {
    span,
    spanOptions: newOptions
  };
}
