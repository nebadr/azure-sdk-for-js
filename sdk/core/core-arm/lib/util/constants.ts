// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

/**
 * Defines constants for long running operation states.
 *
 * @const
 * @type {string}
 */
export type LongRunningOperationStates =
  | "InProgress"
  | "Succeeded"
  | "Failed"
  | "Canceled"
  | "Cancelled";

/**
 * The default language in the request header.
 *
 * @const
 * @type {string}
 */
export const DEFAULT_LANGUAGE = "en-us";

/**
 * The core-arm version.
 * @const
 * @type {string}
 */
export const coreArmVersion = "1.0.0-preview.6";
