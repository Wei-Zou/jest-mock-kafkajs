'use strict';

jest.unmock('kafkajs');

const { getTest } = require('./kafka-connection-common');

describe('test KafkaConnection with the actual kafkajs module', () => {
  it('should successfully produce and consume messages', getTest(), 10000);
});
