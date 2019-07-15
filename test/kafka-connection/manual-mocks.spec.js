'use strict';

const { getTest } = require('./common');

describe('test KafkaConnection with the manual mock kafkajs module', () => {
  it('should successfully produce and consume messages', getTest(), 10000);
});
