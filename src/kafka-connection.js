'use strict';

const { Kafka } =  require('kafkajs');

module.exports = class KafkaConnection {
  constructor (config) {
    this.connection = new Kafka(config);
    this.producer = null;
    this.consumer = null;
  }

  async sendMessage (msgObj) {
    this.producer = this.producer || this.connection.producer();
    await this.producer.connect();
    await this.producer.send(msgObj);
  }

  async setupSubscription ({ groupId, topic, onEachMessage }) {
    if (this.consumer) {
      await this.consumer.disconnect();
    }
    this.consumer = this.connection.consumer({ groupId });
    await this.consumer.connect();
    await this.consumer.subscribe({ topic });
    await this.consumer.run({
      eachMessage: onEachMessage,
    });
  }

  async disconnect () {
    this.producer && await this.producer.disconnect();
    this.consumer && await this.consumer.disconnect();
  }
};
