'use strict';

const { initConfig, topic, groupId } = require('./config');
const KafkaConnection = require('./kafka-connection');

const kafkaConnection = new KafkaConnection(initConfig);

const onEachMessage = ({ message }) => {
  console.log('getting message from Kafka');
  console.log({
    key: message.key.toString(),
    value: message.value.toString(),
  });
};

await kafkaConnection.setupSubscription({ groupId, topic, onEachMessage });

await kafkaConnection.sendMessage({
  topic,
  messages: [
    {
      key: 'key1',
      value: 'value1',
    },
  ],
});
