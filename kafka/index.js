import { Kafka } from "kafkajs"

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'] //multiple brokers
})

const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: 'test-group' }) //consumers group

const run = async () => {
  // Producing
  await producer.connect()
  await producer.send({
    topic: 'msg_events',
    messages: [
      { value: 'Hello KafkaJS user!' },
    ],
  })

  // Consuming
  await consumer.connect()
  await consumer.subscribe({ topic: 'msg_events', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      })
    },
  })
}

run().catch(console.error)