// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as assert from "assert";
import chai from "chai";
import { SecretClient } from "../src";
import { isNode } from "@azure/core-http";
import { isPlayingBack, testPollerProperties } from "./utils/recorderUtils";
import { env } from "@azure/test-utils-recorder";
import { authenticate } from "./utils/testAuthentication";
import TestClient from "./utils/testClient";
import { assertThrowsAbortError } from "./utils/utils.common";
const { expect } = chai;

describe("Secret client - list secrets in various ways", () => {
  const secretValue = "SECRET_VALUE";
  const secretPrefix = `CRUD${env.SECRET_NAME || "SecretName"}`;
  let secretSuffix: string;
  let client: SecretClient;
  let testClient: TestClient;
  let recorder: any;

  beforeEach(async function() {
    const authentication = await authenticate(this);
    secretSuffix = authentication.secretSuffix;
    client = authentication.client;
    testClient = authentication.testClient;
    recorder = authentication.recorder;
  });

  afterEach(async function() {
    recorder.stop();
  });

  // The tests follow

  it("can purge all secrets", async function() {
    // WARNING: When running integration-tests, or having TEST_MODE="record", all of the secrets in the indicated KEYVAULT_NAME will be deleted as part of this test.
    for await (const secretProperties of client.listPropertiesOfSecrets()) {
      try {
        await testClient.flushSecret(secretProperties.name);
      } catch (e) {}
    }
    for await (const deletedSecret of client.listDeletedSecrets()) {
      try {
        await testClient.purgeSecret(deletedSecret.name);
      } catch (e) {}
    }
  });

  it("can list secret properties", async function() {
    const secretName = testClient.formatName(
      `${secretPrefix}-${this!.test!.title}-${secretSuffix}`
    );
    const secretNames = [`${secretName}0`, `${secretName}1`];
    for (const name of secretNames) {
      await client.setSecret(name, "RSA");
    }

    let found = 0;
    for await (const secretProperties of client.listPropertiesOfSecrets()) {
      // The vault might contain more secrets than the ones we inserted.
      if (!secretNames.includes(secretProperties.name)) continue;
      found += 1;
    }

    assert.equal(found, 2, "Unexpected number of secrets found by getSecrets.");

    for (const name of secretNames) {
      await testClient.flushSecret(name);
    }
  });

  if (isNode && !isPlayingBack) {
    // On playback mode, the tests happen too fast for the timeout to work
    it("can get secret properties with requestOptions timeout", async function() {
      const iter = client.listPropertiesOfSecrets({
        requestOptions: { timeout: 1 }
      });
      await assertThrowsAbortError(async () => {
        await iter.next();
      });
    });
  }

  it("can list deleted secrets", async function() {
    const secretName = testClient.formatName(
      `${secretPrefix}-${this!.test!.title}-${secretSuffix}`
    );
    const secretNames = [`${secretName}0`, `${secretName}1`];
    for (const name of secretNames) {
      await client.setSecret(name, "RSA");
    }
    for (const name of secretNames) {
      const deletePoller = await client.beginDeleteSecret(name, testPollerProperties);
      await deletePoller.pollUntilDone();
    }

    let found = 0;
    for await (const secret of client.listDeletedSecrets()) {
      // The vault might contain more secrets than the ones we inserted.
      if (!secretNames.includes(secret.name)) continue;
      found += 1;
    }

    assert.equal(found, 2, "Unexpected number of secrets found by getDeletedSecrets.");

    for (const name of secretNames) {
      await testClient.purgeSecret(name);
    }
  });

  if (isNode && !isPlayingBack) {
    // On playback mode, the tests happen too fast for the timeout to work
    it("can get the deleted secrets with requestOptions timeout", async function() {
      const iter = client.listDeletedSecrets({
        requestOptions: { timeout: 1 }
      });
      await assertThrowsAbortError(async () => {
        await iter.next();
      });
    });
  }

  it("can retrieve all versions of a secret", async function() {
    const secretName = testClient.formatName(
      `${secretPrefix}-${this!.test!.title}-${secretSuffix}`
    );
    const secretValues = [`${secretValue}0`, `${secretValue}1`, `${secretValue}2`];
    interface VersionValuePair {
      version: string;
      value: string;
    }
    const versions: VersionValuePair[] = [];
    for (const v of secretValues) {
      const response = await client.setSecret(secretName, v);
      versions.push({ version: response.properties.version!, value: response.value! });
    }

    const results: VersionValuePair[] = [];
    for await (const secretProperties of client.listPropertiesOfSecretVersions(secretName)) {
      const version = secretProperties.version!;
      const secret = await client.getSecret(secretName, { version: version });
      results.push({ version: secretProperties.version!, value: secret.value! });
    }

    const comp = (a: VersionValuePair, b: VersionValuePair): number =>
      (a.version + a.value).localeCompare(b.version + b.value);
    results.sort(comp);
    versions.sort(comp);

    expect(results).to.deep.equal(versions);
    await testClient.flushSecret(secretName);
  });

  if (isNode && !isPlayingBack) {
    // On playback mode, the tests happen too fast for the timeout to work
    it("can get versions of a secret with requestOptions timeout", async function() {
      const iter = client.listPropertiesOfSecretVersions("doesntmatter", {
        requestOptions: { timeout: 1 }
      });
      await assertThrowsAbortError(async () => {
        await iter.next();
      });
    });
  }

  it("can list secret versions (non existing)", async function() {
    const secretName = testClient.formatName(
      `${secretPrefix}-${this!.test!.title}-${secretSuffix}`
    );
    let totalVersions = 0;
    for await (const secretProperties of client.listPropertiesOfSecretVersions(secretName)) {
      assert.equal(
        secretProperties.name,
        secretName,
        "Unexpected key name in result from listKeyVersions()."
      );
      totalVersions += 1;
    }
    assert.equal(totalVersions, 0, `Unexpected total versions for secret ${secretName}`);
  });

  it("can list secrets by page", async function() {
    const secretName = testClient.formatName(
      `${secretPrefix}-${this!.test!.title}-${secretSuffix}`
    );
    const secretNames = [`${secretName}0`, `${secretName}1`];
    for (const name of secretNames) {
      await client.setSecret(name, "RSA");
    }
    let found = 0;
    for await (const page of client.listPropertiesOfSecrets().byPage()) {
      for (const secretProperties of page) {
        // The vault might contain more secrets than the ones we inserted.
        if (!secretNames.includes(secretProperties.name)) continue;
        found += 1;
      }
    }
    assert.equal(found, 2, "Unexpected number of secrets found by getSecrets.");
    for (const name of secretNames) {
      await testClient.flushSecret(name);
    }
  });

  it("can list deleted secrets by page", async function() {
    const secretName = testClient.formatName(
      `${secretPrefix}-${this!.test!.title}-${secretSuffix}`
    );
    const secretNames = [`${secretName}0`, `${secretName}1`];
    for (const name of secretNames) {
      await client.setSecret(name, "RSA");
    }
    for (const name of secretNames) {
      const deletePoller = await client.beginDeleteSecret(name, testPollerProperties);
      await deletePoller.pollUntilDone();
    }

    let found = 0;
    for await (const page of client.listDeletedSecrets().byPage()) {
      for (const secret of page) {
        // The vault might contain more secrets than the ones we inserted.
        if (!secretNames.includes(secret.name)) continue;
        found += 1;
      }
    }
    assert.equal(found, 2, "Unexpected number of secrets found by getDeletedSecrets.");
    for (const name of secretNames) {
      await testClient.purgeSecret(name);
    }
  });

  it("can retrieve all versions of a secret by page", async function() {
    const secretName = testClient.formatName(
      `${secretPrefix}-${this!.test!.title}-${secretSuffix}`
    );
    const secretValues = [`${secretValue}0`, `${secretValue}1`, `${secretValue}2`];
    interface VersionValuePair {
      version: string;
      value: string;
    }
    const versions: VersionValuePair[] = [];
    for (const v of secretValues) {
      const response = await client.setSecret(secretName, v);
      versions.push({ version: response.properties.version!, value: response.value! });
    }

    const results: VersionValuePair[] = [];
    for await (const page of client.listPropertiesOfSecretVersions(secretName).byPage()) {
      for (const secretProperties of page) {
        const version = secretProperties.version!;
        const secret = await client.getSecret(secretName, { version });
        results.push({ version, value: secret.value! });
      }
    }

    const comp = (a: VersionValuePair, b: VersionValuePair): number =>
      (a.version + a.value).localeCompare(b.version + b.value);
    results.sort(comp);
    versions.sort(comp);

    expect(results).to.deep.equal(versions);
    await testClient.flushSecret(secretName);
  });

  it("can list secret versions by page (non existing)", async function() {
    const secretName = testClient.formatName(
      `${secretPrefix}-${this!.test!.title}-${secretSuffix}`
    );
    let totalVersions = 0;
    for await (const page of client.listPropertiesOfSecretVersions(secretName).byPage()) {
      for (const secretProperties of page) {
        assert.equal(
          secretProperties.name,
          secretName,
          "Unexpected key name in result from listKeyVersions()."
        );
        totalVersions += 1;
      }
    }
    assert.equal(totalVersions, 0, `Unexpected total versions for secret ${secretName}`);
  });
});
