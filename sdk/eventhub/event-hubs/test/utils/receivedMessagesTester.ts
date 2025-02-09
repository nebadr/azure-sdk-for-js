import { CloseReason, ReceivedEventData, EventPosition, EventHubProducerClient } from "../../src/";
import { OptionalEventHandlers, SubscriptionOptions } from "../../src/eventHubConsumerClientModels";
import { PartitionContext } from "../../src/eventProcessor";
import chai from "chai";
import { delay } from '@azure/core-amqp';

const should = chai.should();

interface ReceivedMessages {
  closeReason?: CloseReason;
  lastError?: Error;
}

/**
 * A simple tester that lets you easily poll for messages and check that they've
 * all been received at least once.
 */
export class ReceivedMessagesTester implements Required<OptionalEventHandlers>, SubscriptionOptions {
  private data: Map<string, ReceivedMessages>;
  private expectedMessageBodies: Set<string>;
  public done: boolean;

  public defaultEventPosition: EventPosition = EventPosition.latest();

  /**
   * Creates a ReceivedMessagesTester
   *
   * @param expectedPartitions The only partitions we expect to see messages from.
   * @param expectedMessageBodies The message bodies we expect to get at least once.
   * @param multipleConsumers If you're running a test that involves multiple consumers there
   *                      will be errors as they balance. Set this to true to be less picky
   *                      about errors that occur and concentrate on making sure all expected
   *                      messages are received at least once.
   */
  constructor(
    private expectedPartitions: string[],
    private multipleConsumers: boolean, 
    public maxBatchSize: number = 1,
    public maxWaitTimeInSeconds: number = 10
  ) {
    this.data = new Map<string, ReceivedMessages>();
    this.expectedMessageBodies = new Set();
    this.done = false;
  }

  async onReceivedEvents(
    receivedEvents: ReceivedEventData[],
    context: PartitionContext
  ): Promise<void> {
    this.contextIsOk(context);

    for (const event of receivedEvents) {
      this.expectedMessageBodies.delete(event.body);
    }

    if (this.expectedMessageBodies.size === 0) {
      this.done = true;
    }
  }

  async onError(error: Error, context: PartitionContext): Promise<void> {
    this.contextIsOk(context);

    // this can happen when multiple consumers are spinning up and load balancing. We'll ignore it for multi-consumers
    // only.
    if (
      this.multipleConsumers &&
      error.message.indexOf("New receiver with higher epoch of") >= 0
    ) {
      return;
    }

    const receivedData = this.get(context.partitionId);
    receivedData.lastError = error;
  }

  async onInitialize(context: PartitionContext): Promise<void> {
    this.contextIsOk(context);

    if (!this.multipleConsumers) {
      // this'll happen because for our multi-consumer tests we share the same
      // tester (to make sure that all messages have been received)
      //
      // So it's okay that initialize is called more than once per partition
      // in that case since the consumers, for a short time, can overlap as 
      // load balancing occurs.
      this.data.has(context.partitionId).should.not.be.ok;
    }

    this.data.set(context.partitionId, {
      closeReason: undefined
    });
  }

  async onClose(reason: CloseReason, context: PartitionContext): Promise<void> {
    this.contextIsOk(context);

    const receivedData = this.get(context.partitionId);
    receivedData.closeReason = reason;
  }

  /**
   * Polls until all messages have been received (or until first error)
   */
  async runTestAndPoll(client: EventHubProducerClient): Promise<void> {

    // wait until all the partitions have been claimed
    while (this.data.size !== this.expectedPartitions.length) {
      await delay(1000); 
    }

    let lastExpectedMessageCount = await this.produceMessages(client);

    while (!this.done) {
      for (const data of this.data) {
        if (data[1].lastError) {
          throw data[1].lastError;
        }
      }

      if (lastExpectedMessageCount !== this.expectedMessageBodies.size) {
        console.log(
          `Still waiting for these messages:`
        );

        for (const body of this.expectedMessageBodies) {
          console.log(`   ${body}`);
        }

        lastExpectedMessageCount = this.expectedMessageBodies.size;
      }

      await delay(1000);
    }

    if (this.expectedMessageBodies.size > 0) {
      throw new Error(`Never got these messages: ${Array.from(this.expectedMessageBodies)}`);
    }

    console.log("All messages received");
  }

  private async produceMessages(client: EventHubProducerClient) {
    const expectedMessagePrefix = `EventHubConsumerClient test - ${Date.now().toString()}`;
    const messagesToSend = [];

    for (const partitionId of this.expectedPartitions) {
      const body = `${expectedMessagePrefix} - ${partitionId}`;
      this.expectedMessageBodies.add(body);
      messagesToSend.push({
        body,
        partitionId
      });
    }

    let lastExpectedMessageCount = this.expectedMessageBodies.size;

    for (const messageToSend of messagesToSend) {
      const batch = await client.createBatch({});
      batch.tryAdd({ body: messageToSend.body });
      await client.sendBatch(batch, messageToSend.partitionId);      
    }
    return lastExpectedMessageCount;
  }

  private get(partitionId: string): ReceivedMessages {
    this.data.has(partitionId).should.be.ok;
    const receivedData = this.data.get(partitionId)!;
    return receivedData;
  }

  private contextIsOk(context: PartitionContext): void {
    context.partitionId.should.be.ok;
    context.consumerGroupName.should.be.ok;
    context.eventHubName.should.be.ok;
    context.fullyQualifiedNamespace.should.be.ok;

    // if we start getting messages for other partitions
    // we should immediately error out)
    should.exist(this.expectedPartitions.includes(context.partitionId));
  }
}
