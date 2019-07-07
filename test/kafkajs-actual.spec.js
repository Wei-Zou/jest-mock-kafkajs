'use strict';

jest.unmock('kafkajs');

const { Kafka } = require('kafkajs');
const { initConfig } = require('./config-test');

const sendMessages = async ({ producer, topic, messages }) => {
  await producer.connect();
  await producer.send({
    topic,
    messages,
  });
};

const runConsumer = async ({ existingConsumer, kafkaConnection, groupId, topic, eachMessage }) => {
  const consumer = existingConsumer || kafkaConnection.consumer({ groupId });
  await consumer.connect();
  await consumer.subscribe({ topic });
  await consumer.run({ eachMessage });
  return consumer;
};

describe('test kafkajs with actual Kafka instance', () => {
  it('should produce and consume messages successfully', async (done) => {
    const topic = 'test-kafkajs-actual-1';
    const groupId = 'test-kafkajs-actual-group1';
    const kafkaConnection = new Kafka(initConfig);

    const producer = kafkaConnection.producer();

    const messagesConsumed = {};
    const eachMessage = async ({ message }) => {
      messagesConsumed[message.key.toString()] = message.value.toString();

      if (Object.keys(messagesConsumed).length >= 3) {
        expect(messagesConsumed).toEqual({
          key1: 'value1',
          key2: 'value2',
          key3: 'value3',
        });
        await consumer.disconnect();
        await producer.disconnect();
        done();
      }
    };

    const consumer = await runConsumer({ kafkaConnection, groupId, topic, eachMessage });

    const messages = [
      {
        key: 'key1',
        value: 'value1',
      },
      {
        key: 'key2',
        value: 'value2',
      },
      {
        key: 'key3',
        value: 'value3',
      },
    ];

    await sendMessages({ producer, topic, messages });
  }, 20000);

  test('consumers who subscribe to the same topic and in the same group share one set of messages', async (done) => {
    const topic = 'test-kafkajs-actual-2';
    const groupId = 'test-kafkajs-actual-group';
    const kafkaConnection = new Kafka(initConfig);

    const producer = kafkaConnection.producer();

    const messagesConsumed1 = {};
    const messagesConsumed2 = {};
    let consumer1;
    let consumer2;

    const getEachMessageCb = ({ collectedMessages, otherMessages }) => {
      return async ({ message }) => {
        console.log(
          `consuming message key=${message.key.toString()}, value=${message.value.toString()}`
        );
        collectedMessages[message.key.toString()] = message.value.toString();
        console.log(
          `collectedMessages=${JSON.stringify(collectedMessages)}, otherMessages=${JSON.stringify(
            otherMessages
          )}`
        );

        if (Object.keys(collectedMessages).length + Object.keys(otherMessages).length >= 3) {
          expect({ ...collectedMessages, ...otherMessages }).toEqual({
            key0: 'value0',
            key1: 'value1',
            key2: 'value2',
          });
          await consumer1.disconnect();
          await consumer2.disconnect();
          await producer.disconnect();
          done();
        }
      };
    };

    consumer1 = await runConsumer({
      kafkaConnection,
      groupId,
      topic,
      eachMessage: getEachMessageCb({
        collectedMessages: messagesConsumed1,
        otherMessages: messagesConsumed2,
      }),
    });
    consumer2 = await runConsumer({
      kafkaConnection,
      groupId,
      topic,
      eachMessage: getEachMessageCb({
        collectedMessages: messagesConsumed2,
        otherMessages: messagesConsumed1,
      }),
    });

    const getSendMessages = (msgNumber) => {
      return sendMessages({
        producer,
        topic,
        messages: [
          {
            key: `key${msgNumber}`,
            value: `value${msgNumber}`,
          },
        ],
      });
    };

    const promises = [...Array(3).keys()].map(getSendMessages);

    await Promise.all(promises);
  }, 20000);

  test('consumers who subscribe to the same topic but in different group get a complete set of messages', async (done) => {
    const topic = 'test-kafkajs-actual-3';
    const groupId = 'test-kafkajs-actual-group';
    const kafkaConnection = new Kafka(initConfig);

    const producer = kafkaConnection.producer();

    const messagesConsumed1 = {};
    const messagesConsumed2 = {};
    let consumer1;
    let consumer2;

    const getEachMessageCb = ({ collectedMessages, otherMessages }) => {
      return async ({ message }) => {
        collectedMessages[message.key.toString()] = message.value.toString();

        if (Object.keys(collectedMessages).length >= 3 && Object.keys(otherMessages).length >= 3) {
          expect(collectedMessages).toEqual({
            key1: 'value1',
            key2: 'value2',
            key3: 'value3',
          });
          expect(otherMessages).toEqual(collectedMessages);
          await consumer1.disconnect();
          await consumer2.disconnect();
          await producer.disconnect();
          done();
        }
      };
    };

    consumer1 = await runConsumer({
      kafkaConnection,
      groupId: `${groupId}-1`,
      topic,
      eachMessage: getEachMessageCb({
        collectedMessages: messagesConsumed1,
        otherMessages: messagesConsumed2,
      }),
    });
    consumer2 = await runConsumer({
      kafkaConnection,
      groupId: `${groupId}-2`,
      topic,
      eachMessage: getEachMessageCb({
        collectedMessages: messagesConsumed2,
        otherMessages: messagesConsumed1,
      }),
    });

    const messages = [
      {
        key: 'key1',
        value: 'value1',
      },
      {
        key: 'key2',
        value: 'value2',
      },
      {
        key: 'key3',
        value: 'value3',
      },
    ];

    await sendMessages({ producer, topic, messages });
  }, 20000);
});
