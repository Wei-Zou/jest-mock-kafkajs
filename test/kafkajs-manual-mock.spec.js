'use strict';

const { getTests } = require('./kafkajs-common');

describe('test kafkajs with actual Kafka instance', getTests());
