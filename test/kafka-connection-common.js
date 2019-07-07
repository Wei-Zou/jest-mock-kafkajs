'use strict';

const KafkaConnection = require('../src/kafka-connection');
const { initConfig, topic, groupId } = require('../src/config');

const getTest = (checkCb) => async (done) => {
  const kafkaConnection = new KafkaConnection(initConfig);
  const key = 'key1';
  const value = 'value1';

  const onEachMessage = async ({ message }) => {
    expect(message.key.toString()).toBe(key);
    expect(message.value.toString()).toBe(value);
    await kafkaConnection.disconnect();

    checkCb && checkCb();
    done();
  };

  await kafkaConnection.setupSubscription({ groupId, topic, onEachMessage });

  await kafkaConnection.sendMessage({
    topic,
    messages: [
      {
        key,
        value,
      },
    ],
  });
};

module.exports = {
  getTest,
};
