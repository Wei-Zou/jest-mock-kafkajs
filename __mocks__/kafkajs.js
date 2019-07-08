'use strict';

const kafkajs = jest.genMockFromModule('kafkajs');

class Producer {
  constructor({ sendCb }) {
    this.sendCb = sendCb;
  }

  async connect() {
    return Promise.resolve();
  }

  async send({ topic, messages }) {
    this.sendCb({ topic, messages });
  }

  async disconnect() {
    return Promise.resolve();
  }
}

class Consumer {
  constructor({ groupId, subscribeCb }) {
    this.groupId = groupId;
    this.subscribeCb = subscribeCb;
  }

  getGroupId() {
    return this.groupId;
  }

  async connect() {
    return Promise.resolve();
  }

  async subscribe({ topic }) {
    this.subscribeCb(topic, this);
  }

  async run({ eachMessage }) {
    this.eachMessage = eachMessage;
  }

  async disconnect() {
    return Promise.resolve();
  }
}

kafkajs.Kafka = class Kafka {
  constructor(config) {
    this.brokers = config.brokers;
    this.clientId = config.clientId;
    this.topics = {};
  }

  _subscribeCb(topic, consumer) {
    this.topics[topic] = this.topics[topic] || {};
    const topicObj = this.topics[topic];
    topicObj[consumer.getGroupId()] = topicObj[consumer.getGroupId()] || [];
    topicObj[consumer.getGroupId()].push(consumer);
  }

  _sendCb({ topic, messages }) {
    messages.forEach((message) => {
      Object.values(this.topics[topic]).forEach((consumers) => {
        const consumerToGetMessage = Math.floor(Math.random() * consumers.length);
        consumers[consumerToGetMessage].eachMessage({
          message,
        });
      });
    });
  }

  producer() {
    return new Producer({
      sendCb: this._sendCb.bind(this),
    });
  }

  consumer({ groupId }) {
    return new Consumer({
      groupId,
      subscribeCb: this._subscribeCb.bind(this),
    });
  }
};

module.exports = kafkajs;
