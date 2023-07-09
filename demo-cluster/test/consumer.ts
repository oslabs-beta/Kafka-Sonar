import { Kafka, logLevel, Consumer } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'test-consumer',
  brokers: ['localhost:9091', 'localhost:8098', 'localhost:8099'],
  logLevel: logLevel.WARN,
});

const consumer: Consumer = kafka.consumer({ groupId: 'test-group' });

const run = async (): Promise<void> => {
  // connect the consumer
  await consumer.connect();
  console.log('consumer connected');
  // subscribe consumer to the topic created in producer.ts
  await consumer.subscribe(
    { topics: ['test-topic'], fromBeginning: true }
  );
  // log each message for testing purposes
  // consumer.run connection remains open indefinitely as configured here, if you produce more messages, they will appear in the consumer console
  await consumer.run({
    autoCommitInterval: 5000,
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic: topic.toString(),
        partition: partition,
        message: message.value?.toString(),
        offset: message.offset,
      });
    },
  });
  // await consumer.disconnect();
};

run();