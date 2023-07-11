import { Kafka, logLevel, Producer, Admin, CompressionTypes } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'test-producer-mass',
  brokers: ['localhost:9091', 'localhost:8098', 'localhost:8099'],
  logLevel: logLevel.WARN,
});

const admin: Admin = kafka.admin();
const producer: Producer = kafka.producer();
const topic = 'test-topic';

const run = async (): Promise<void> => {
  // connect the admin and create a topic if it hasn't already been created
  await admin.connect();
  const topicsList = await admin.listTopics();
  if (!topicsList.length) {
    await admin.createTopics({
      topics: [{ 
        topic,
        replicationFactor: 3,
        numPartitions: 3
      }],
    });
  }
  await admin.disconnect();

  // Produce an arbitrary but large number of messages to the topic 'test-topic'
  const randomNumberBetween = (min: number, max: number): number => Math.floor(Math.random() * (max - min) + min);
  let number: number = randomNumberBetween(5000, 10000);

  await producer.connect();
  while (number > 0) {
    await producer.send({
      topic,
      compression: CompressionTypes.GZIP,
      messages: [{
        key: `key-${number}`,
        value: `value-${number}-${new Date().toISOString()}`,
      }
      ]
    })
    number -= 1;
  }
  await producer.disconnect();
};

run().catch(e => console.error(`[test/mass-producer] ${e.message}, e`));

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.forEach(type => {
  process.on(type, async () => {
    try {
      console.log(`process.on ${type}`)
      await producer.disconnect()
      process.exit(0)
    } catch (_) {
      process.exit(1)
    }
  })
});

signalTraps.forEach(type => {
  process.once(type, async () => {
    try {
      await producer.disconnect()
    } finally {
      process.kill(process.pid, type)
    }
  });
});