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
  // subscribe consumer to the topic created in producer.ts
  await consumer.subscribe(
    { topics: ['test-topic'], fromBeginning: true }
  );
  // log each message for testing purposes
  // consumer.run connection remains open indefinitely as configured here, if you produce more messages, they will appear in the consumer console
  await consumer.run({
    autoCommitInterval: 5000,
    eachMessage: async ({ topic, partition, message }) => {
      const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
      console.log(`- ${prefix} ${message.key}#${message.value}`)
      // console.log({
      //   topic: topic.toString(),
      //   partition: partition,
      //   message: message.value?.toString(),
      //   offset: message.offset,
      // });
    },
  });
  // await consumer.disconnect();
};

run().catch(e => console.error(`[test/consumer] ${e.message}`, e))

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.forEach(type => {
  process.on(type, async e => {
    try {
      console.log(`process.on ${type}`)
      console.error(e)
      await consumer.disconnect()
      process.exit(0)
    } catch (_) {
      process.exit(1)
    }
  })
})

signalTraps.forEach(type => {
  process.once(type, async () => {
    try {
      await consumer.disconnect()
    } finally {
      process.kill(process.pid, type)
    }
  })
})