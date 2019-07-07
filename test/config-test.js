'use strict';

module.exports = {
  initConfig: {
    brokers: ['localhost:9092'],
    clientId: 'test-client',
  },
  topic: 'test-topic',
  groupId: 'test-group',
};
