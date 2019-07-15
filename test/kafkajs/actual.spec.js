'use strict';

jest.unmock('kafkajs');

const { getTests } = require('./common');

describe('test kafkajs with actual Kafka instance', getTests());
