# jest-mock-kafkajs
Mock [kafkajs](https://kafka.js.org) using Jest `manual mock`.
The purpose of this project is to run unit tests against a `kafkajs` module mocked by Jest's [manual mock](https://jestjs.io/docs/en/manual-mocks). It compares with running unit tests against the actual `kafkajs` module which requires a Kafka instance running (locally or remotely). It also compares with running unit tests against Jest [function mock](https://jestjs.io/docs/en/mock-functions) (A.K.A. `stub`).

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

#### Run Docker to start a local Kafka instance
```
npm run setup-local-env
```

#### Test actual kafkajs module (with a real running Kafka instance in Docker)
```
npm run test-actual
```

#### Test Jest function mock (stub)
```
npm run test-function-mock
```

#### Test mocked kafkajs module
```
npm run test-manual-mocks
```

### Compare 3 different testing mechanisms


#### Testing against actual Kafka instance

##### Pros
1. Testing with the real environment
2. Don't need to mock return values for each test.

##### Cons
1. This usually takes long to complete the tests.

2. When consumer attempts to subscribe to a topic by calling 
```
await consumer.subscribe({ topic });
```
it's possible to get error message `There is no leader for this topic-partition as we are in the middle of a leadership election`. So subscription won't establish until Zookeeper finishes election.

3. In different test cases, if consumers subscribe to the same topic and share the same groupId, test cases might interfere one another. (especially when Jest runs them in parallel).

4. PR triggered tests/builds require Docker in the env, and takes longer to setup env (needs to download Kafka/Zookeeper images).


#### Testing with Jest Function (stub)

##### Pros
1. Fast
2. Flexible to mock return values for each tests.

##### Cons
1. Tedious to setup tests


#### Testing with Manual Mock

##### Pros
1. Fast
2. Don't need to mock return values for each test.
3. One general mocked implementation can handle multiple situations.

##### Cons
1. Need to implement a mock and test against it.

### Notes about `kafkajs` module mocking
* The implementation of `kafkajs` module mocking is [here](https://github.com/Wei-Zou/jest-mock-kafkajs/blob/master/__mocks__/kafkajs.js). It's a simple `kafkajs` module mock that runs in memory. It supports producers' `connect`, `send`, and `disconnect` methods. It also supports consumers' `connect`, `subscribe`, `run`, and `disconnect` methods. It supports multiple consumers in the same group, or in different groups.
* Batched message consuming has not been implemented.
* Since it's a local kafkajs implementation, it doesn't implement the concept of `partition` or `broker`.
