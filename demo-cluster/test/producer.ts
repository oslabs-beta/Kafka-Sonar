import { Kafka, logLevel, Producer, Admin, CompressionTypes } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'test-producer',
  brokers: ['localhost:9091', 'localhost:8098', 'localhost:8099'],
  logLevel: logLevel.WARN,
});

interface TestMessage {
  key: string,
  value: string,
}

const admin: Admin = kafka.admin();
const producer: Producer = kafka.producer();
const topic = 'test-topic';

const getRandomNumber = (): number => Math.round(Math.random() * 1000)
export const createMessage = (num: number): TestMessage => ({
  key: `key-${num}`,
  value: `value-${num}-${new Date().toISOString()}`,
})

const sendMessage = (): Promise<void> => {
  return producer
    .send({
      topic,
      compression: CompressionTypes.GZIP,
      messages: Array(getRandomNumber())
        .fill(null)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(_ => createMessage(getRandomNumber())),
    })
    .then(console.log)
    .catch(e => console.error(`[example/producer] ${e.message}`, e))
}

const run = async (): Promise<void> => {
  // connect the admin and create a topic if it hasn't already been created
  await admin.connect();
  const clusterInfo = await admin.describeCluster();
  console.log('CLUSTER INFO ->', clusterInfo);
  const topicsList = await admin.listTopics();
  console.log('TOPICS ->', topicsList);
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



  await producer.connect();
  setInterval(sendMessage, 3000);
};

run().catch(e => console.error(`[test/producer] ${e.message}, e`));

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