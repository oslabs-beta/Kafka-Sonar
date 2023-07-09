import { Kafka, logLevel, Producer, Admin } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'test-producer',
  brokers: ['localhost:9091', 'localhost:8098', 'localhost:8099'],
  logLevel: logLevel.WARN,
});

const admin: Admin = kafka.admin();
const producer: Producer = kafka.producer();
const topic = 'test-topic';

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
        replicationFactor: 3
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
      topic: 'test-topic',
      messages: [
        {
          key: `${number}`,
          value: `Message #${number}`,
        }
      ]
    })
    number -= 1;
  }
  await producer.disconnect();
};

run();