'use strict';

const { getTest } = require('./kafka-connection-common');

describe('test KafkaConnection with the manual mock kafkajs module', () => {
  it('should successfully produce and consume messages', getTest(), 10000);
});
