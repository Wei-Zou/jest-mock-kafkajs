'use strict';

jest.unmock('kafkajs');

const { Kafka } = require('kafkajs');

const { getTest } = require('./common');

describe('test kafkajs with jest function mock (stub)', () => {
  let producerMock;
  let producerConnectMock;
  let producerSendMock;
  let producerDisconnectMock;

  let consumerMock;
  let consumerConnectMock;
  let consumerSubscribeMock;
  let consumerRunMock;
  let consumerDisconnectMock;

  beforeEach(() => {
    producerConnectMock = jest.fn();
    producerSendMock = jest.fn();
    producerDisconnectMock = jest.fn();
    producerMock = jest.fn(() => {
      return {
        connect: producerConnectMock,
        send: producerSendMock,
        disconnect: producerDisconnectMock,
      };
    });
    Kafka.prototype.producer = producerMock;

    consumerConnectMock = jest.fn();
    consumerSubscribeMock = jest.fn();
    consumerRunMock = jest.fn(({ eachMessage }) => {
      const getEachMessage = () => eachMessage({ message: { key: 'key1', value: 'value1' } });
      setTimeout(getEachMessage, 1000);
    });
    consumerDisconnectMock = jest.fn();
    consumerMock = jest.fn(() => {
      return {
        connect: consumerConnectMock,
        subscribe: consumerSubscribeMock,
        run: consumerRunMock,
        disconnect: consumerDisconnectMock,
      };
    });
    Kafka.prototype.consumer = consumerMock;
  });

  const checkCb = () => {
    expect(producerMock).toHaveBeenCalledTimes(1);
    expect(producerConnectMock).toHaveBeenCalledTimes(1);
    expect(producerSendMock).toHaveBeenCalledTimes(1);
    expect(producerDisconnectMock).toHaveBeenCalledTimes(1);

    expect(consumerMock).toHaveBeenCalledTimes(1);
    expect(consumerConnectMock).toHaveBeenCalledTimes(1);
    expect(consumerSubscribeMock).toHaveBeenCalledTimes(1);
    expect(consumerRunMock).toHaveBeenCalledTimes(1);
    expect(consumerDisconnectMock).toHaveBeenCalledTimes(1);
  };

  it('should successfully produce and consume messages', getTest(checkCb), 10000);
});
