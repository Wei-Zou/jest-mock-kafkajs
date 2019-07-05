# jest-mock-kafkajs
Mock `kafkajs` using Jest `manual mock`
The purpose of this project is to run unit tests against a `kafkajs` module mocked by Jest's `manual mock`. It also compares with running unit tests against the actual `kafkajs` module which requires a Kafka instance running (locally or remotely).

### env setup

#### node.js
This project is tested in node.js v10.15.0 version.
run
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
