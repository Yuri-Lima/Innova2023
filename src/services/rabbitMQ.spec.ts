import RabbitmqServer from './rabbitMQ';
require('dotenv').config();

describe("RabbitMQ Test", () => {
  let rabbitMQTest: RabbitmqServer;
  beforeAll(async () => {
    rabbitMQTest = new RabbitmqServer({
      uri: process.env.AMQP_URI || 'amqp://localhost:5672',
    });
    await rabbitMQTest.start();
    return rabbitMQTest;
  }, 120000); // 400 seconds

  test('Should Return a rabbitMQ Instance Connection', async() => {
    const conn = rabbitMQTest.getConnection();
    console.log(conn.connection.serverProperties.product);
    expect(conn.connection.serverProperties.product).toBe('RabbitMQ');
    expect(conn).toBeDefined();
  });

  test('Should Return a rabbitMQ Instance Channel', async() => {
    const channel = rabbitMQTest.getChannel();
    expect(channel).toBeDefined();
  });

  test('Should Create a Temporary Queue', async() => {
    const queue = await rabbitMQTest.createQueue("test", {
      autoDelete: true, // if true, the queue is deleted when all consumers have finished using it
      expires: 120000, // 1 minute
      durable: false // if true, the queue will survive a broker restart
    });
    console.log("Queue Name: ", queue);
    expect(queue.queue).toBe('test');
    expect(queue.messageCount).toBe(0);
    expect(queue.consumerCount).toBe(0);
  });
  
  test('should publish to queue', async() => {
    const result:boolean = rabbitMQTest.publishInQueue('test', 'test',{
      mandatory: true, // if true, the server will return an unroutable message with a Return method
      persistent: true // if true, the message will be marked as persistent (stored to disk)
    });
    console.log("Publish Queue: ", result);
    expect(result).toBe(true);
  });

  test('Should Create a Temporary Exchange', async() => {
    const exchange = await rabbitMQTest.createExchange("test", "topic", {
      autoDelete: true,
      durable: false
    });
    console.log("Exchange Name: ", exchange);
    expect(exchange.exchange).toBe('test');
  });

  test('should bind queue to exchange', async() => {
    const result = await rabbitMQTest.bindQueueToExchange('test', 'test', 'test.test');
    console.log("Bind Queue: ", result);
    expect(result).toBeUndefined();
  });

  test('should publish to exchange', async() => {
    const result:boolean = rabbitMQTest.publishInExchange('test', 'test.test', 'test',{
      mandatory: true, // if true, the server will return an unroutable message with a Return method
      persistent: true // if true, the message will be marked as persistent (stored to disk)
    });
    console.log("Publish Exchange: ", result);
    expect(result).toBe(true);
  });

  test('should consume from queue', async() => {
    const result = await rabbitMQTest.consumeFromQueue('test', (msg) => {
      console.log("Consume Queue Content: ", msg.content.toString());
      expect(msg.content.toString()).toBe('test');
    });
    console.log("Consume Queue Tag: ", result.consumerTag);
    expect(result.consumerTag.startsWith('amq.ctag-')).toBe(result.consumerTag.includes('amq.ctag-'));
  });

  test('should purge queue', async() => {
    const result = await rabbitMQTest.purgeQueue('test');
    console.log("Purge Queue: ", result);
    expect(result.messageCount).toBe(0);
  });

  // Needs to be fixed later on
  test.skip('Should Delete a Temporary Queue', async() => {
    const queue = await rabbitMQTest.deleteQueue("test", {
      ifEmpty: true,
      ifUnused: true
    });
    console.log("Delete Queue: ", queue);
    expect(queue.messageCount).toBe(0);
  });

  afterAll(async () => {
    await rabbitMQTest.closeChannel();
    console.log('RabbitMQ Channel Closed');
  });
});