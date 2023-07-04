import { Kafka, logLevel } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'test',
  // brokers: ['localhost:9091', 'localhost:9092', 'localhost:9093'],
  brokers: ['localhost:9091', 'localhost:8098', 'localhost:8099'],
  // logLevel: logLevel.WARN,
  // ssl: {
  //   rejectUnauthorized: false
  // }
  // sasl: {
  //   mechanism: 'PLAIN',
  //   username: 'user',
  //   password: 'pass',
  // },
});

const admin = kafka.admin();
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'test-group' });

const run = async () => {
  await admin.connect();
  const clusterInfo = await admin.describeCluster();
  console.log('CLUSTER INFO ->', clusterInfo); // easiest way to see how many brokers you have in your cluster
  await admin.createTopics({
    topics: [
      {
        topic: 'test-topic',
      },
    ],
  });
  const topicsList = await admin.listTopics();
  console.log('CREATED TOPICS ->', topicsList);
  await admin.disconnect();

  // connect producer to client
  await producer.connect();
  // write / publish msgs to cluster topics
  await producer.send({
    topic: 'test-topic', // specifying an existing topic
    messages: [
      {
        value: 'This is the producer, do you read me test-topic?',
      },
    ],
  });
  await producer.disconnect();

  // connect consumer to client
  await consumer.connect();
  // subscribe consumer to topic to read messages from
  await consumer.subscribe(
    { topics: ['test-topic'], fromBeginning: true }
    // { topics: ['test1-topic', 'test2-topic'], fromBeginning: true },
  );
  // run some functionality on each msg
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(
        'topic',
        topic.toString(),
        'partition',
        partition,
        'message',
        message.value.toString(),
        'offset',
        message.offset
      );
    },
  });
  // await consumer.disconnect(); // Removed disconnect b/c consumer stops before console logs occur
};

run().catch(console.error('error'));