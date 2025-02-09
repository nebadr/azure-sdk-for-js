// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import debugModule from "debug";
/**
 * @ignore
 * log statements for error
 */
export const error = debugModule("azure:event-hubs:error");
/**
 * @ignore
 * log statements for management
 */
export const mgmt = debugModule("azure:event-hubs:management");
/**
 * @ignore
 * log statements for sender
 */
export const sender = debugModule("azure:event-hubs:sender");
/**
 * @ignore
 * log statements for receiver
 */
export const receiver = debugModule("azure:event-hubs:receiver");
/**
 * @ignore
 * log statements for receiverbatching
 */
export const batching = debugModule("azure:event-hubs:receiverbatching");
/**
 * @ignore
 * log statements for receiverstreaming
 */
export const streaming = debugModule("azure:event-hubs:receiverstreaming");
/**
 * @ignore
 * log statements for linkEntity
 */
export const link = debugModule("azure:event-hubs:linkEntity");
/**
 * @ignore
 * log statements for connectionContext
 */
export const context = debugModule("azure:event-hubs:connectionContext");
/**
 * @ignore
 * log statements for client
 */
export const client = debugModule("azure:event-hubs:client");
/**
 * @ignore
 * log statements for event hub consumer client
 */
export const consumerClient = debugModule("azure:event-hubs:consumerclient");
/**
 * @ignore
 * log statements for iothub client
 */
export const iotClient = debugModule("azure:event-hubs:iothubClient");
/**
 * @ignore
 * log statements for partitionManager
 */
export const partitionPump = debugModule("azure:event-hubs:partitionPump");
/**
 * @ignore
 * log statements for pumpManager
 */
export const pumpManager = debugModule("azure:event-hubs:pumpManager");
/**
 * @ignore
 * log statements for eventProcessor
 */
export const eventProcessor = debugModule("azure:event-hubs:eventProcessor");
/**
 * @ignore
 * log statements for partitionLoadBalancer
 */
export const partitionLoadBalancer = debugModule("azure:event-hubs:partitionLoadBalancer");
