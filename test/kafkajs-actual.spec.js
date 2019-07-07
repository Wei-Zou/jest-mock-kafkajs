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
    const topic = 'test-actual-kafka-instance1';
    const groupId = 'test-actual-kafka-instance-group';
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
  }, 5000);
});
