# jest-mock-kafkajs
Mock `kafkajs` using Jest `manual mock`.
The purpose of this project is to run unit tests against a `kafkajs` module mocked by Jest's `manual mock`. It also compares with running unit tests against the actual `kafkajs` module which requires a Kafka instance running (locally or remotely).

### env setup

#### node.js
This project is tested in node.js v10.15.0 version.
In the root directory, run
```
npm i
```
to install required node modules.

#### Docker
This project also requires Docker installed locally. To install Docker, [follow the document](https://docs.docker.com/).

### run test
#### Test actual kafkajs module (with a real running Kafka instance)
```
npm run test-actual
```

#### Test mocked kafkajs module
```
npm run test-mocked
```

### Compare testing against actual Kafka instance and testing with mocked kafksjs

#### Testing against actual Kafka instance
1. When consumer attempts to subscribe to a topic by calling 
```
await consumer.subscribe({ topic });
```
it's possible to get error message `There is no leader for this topic-partition as we are in the middle of a leadership election`. So subscription won't establish until Zookeeper finishes election.

2. In different test cases, if consumers subscribe to the same topic and share the same groupId, test cases might interfere one another. (especially Jest runs them in parallel).
