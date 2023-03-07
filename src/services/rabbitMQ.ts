require("dotenv").config();
/* eslint-disable no-useless-constructor */
import { Connection, Channel, connect, Message, Replies, Options } from "amqplib";
import sleepRandomTime from "../Utils/sleepRandomTime";

interface RabbitMQOptions extends Options.Connect {
    uri: string; // URI
    host: string; // Hostname or IP address
    port: number; // Port
    username: string; // Username
    password: string; // Password
    vhost: string; // Virtual host
    reconnectTimeout: number; // Reconnect timeout in ms
    reconnectAttempts: number; // Reconnect attempts
    heartbeat: number; // Heartbeat interval in seconds
    prefetch: number; // Prefetch count
}
type typeExchange = "direct"|"fanout"|"match"|"headers"|"topic";

type notifyTaskData = {
  queueName: string;
  activated: boolean;
  data: string | object;
  source: string;
};

export default class RabbitmqServer {
  private conn!: Connection;

  private channel!: Channel;

  protected opt: Partial<RabbitMQOptions>;

  // eslint-disable-next-line prettier/prettier
  constructor(opt:Partial<RabbitMQOptions>) { 
    this.opt = opt;
    console.log("RabbitMQ: Connecting...", this.opt);
  }    

  /**
   * description: Start RabbitMQ connection
   * @param {string} uri || { protocol, hostname, port, username, password }
   * @returns {Promise<void>}
   */
  async start(): Promise<void> {
    this.conn = await connect(
        this.opt.uri ||
        {
        protocol: this.opt.protocol,
        hostname: this.opt.hostname,
        port: this.opt.port,
        username: this.opt.username,
        password: this.opt.password
    }, {
        heartbeat: this.opt.heartbeat || 60,
        locale: this.opt.locale || "en_US",
        frameMax: this.opt.frameMax || 0,
        vhost: this.opt.vhost || "/"
        });

    // Create channel
    this.channel = await this.conn.createChannel();

    await this.defaultStart();
  }

  /**
   * description: Start Default RabbitMQ connection
   * @returns {Promise<void>}
   */
  async defaultStart(): Promise<void> {
   
    // Exchanges Names
    // const exchangeDefault = process.env.WC_ORDERS_CREATED_EXCHANGENAME || "wc";
    const exchangeDefault = <string>process.env.WC_EXCHANGENAME;
    
    // Exchange Types
    // const exchangeDefaultType = process.env.WC_ORDERS_EXCHANGETYPE || "topic" as typeExchange;
    const exchangeDefaultType = <string>process.env.TASKS_EXCHANGETYPE || "topic" as typeExchange;
    
    // Routing Keys
    // const routingKeyDefaultCreated = process.env.WC_ORDERS_CREATED_ROUTINGKEY || "wc.orders.created";
    // const routingKeyDefaultUpdated = process.env.WC_ORDERS_UPDATED_ROUTINGKEY || "wc.orders.updated";
    const routingKeyDefaultTaskCreated = <string>process.env.WC_TASKS_CREATED_ROUTINGKEY;
    const routingKeyDefaultTaskUpdated = <string>process.env.WC_TASKS_UPDATED_ROUTINGKEY;
    const routingKeyDefaultTaskCreatedDone = <string>process.env.WC_TASKS_DONE_CREATED_ROUTINGKEY ;
    const routingKeyDefaultTaskUpdatedDone = <string>process.env.WC_TASKS_DONE_UPDATED_ROUTINGKEY;
   
    // Queues Names
    // const queueDefaultCreated = process.env.WC_ORDERS_CREATED_QUEUENAME || "wc-orders-created";
    // const queueDefaultUpdated = process.env.WC_ORDERS_UPDATED_QUEUENAME || "wc-orders-updated";
    const queueDefaultTasksCreated = <string>process.env.WC_TASKS_CREATED_QUEUENAME;
    const queueDefaultTasksUpdated = <string>process.env.WC_TASKS_UPDATED_QUEUENAME;
    const queueDefaultTasksCreatedDone = <string>process.env.WC_TASKS_DONE_CREATED_QUEUENAME;
    const queueDefaultTasksUpdatedDone = <string>process.env.WC_TASKS_DONE_UPDATED_QUEUENAME;

    // Create exchanges
    await this.channel.assertExchange(exchangeDefault, exchangeDefaultType, { durable: true });

    // Create queues
    // await this.channel.assertQueue(queueDefaultCreated, { durable: true });
    // await this.channel.assertQueue(queueDefaultUpdated, { durable: true });
    await this.channel.assertQueue(queueDefaultTasksCreated, { durable: true });
    await this.channel.assertQueue(queueDefaultTasksUpdated, { durable: true });
    await this.channel.assertQueue(queueDefaultTasksCreatedDone, { durable: true });
    await this.channel.assertQueue(queueDefaultTasksUpdatedDone, { durable: true });

    // Bind queues with exchange 
    // await this.channel.bindQueue(queueDefaultCreated, exchangeDefault, routingKeyDefaultCreated); // queueName - exchangeName - routingKey
    // await this.channel.bindQueue(queueDefaultUpdated, exchangeDefault, routingKeyDefaultUpdated); // queueName - exchangeName - routingKey
    await this.channel.bindQueue(queueDefaultTasksCreated, exchangeDefault, routingKeyDefaultTaskCreated); // queueName - exchangeName - routingKey
    await this.channel.bindQueue(queueDefaultTasksUpdated, exchangeDefault, routingKeyDefaultTaskUpdated); // queueName - exchangeName - routingKey
    await this.channel.bindQueue(queueDefaultTasksCreatedDone, exchangeDefault, routingKeyDefaultTaskCreatedDone); // queueName - exchangeName - routingKey
    await this.channel.bindQueue(queueDefaultTasksUpdatedDone, exchangeDefault, routingKeyDefaultTaskUpdatedDone); // queueName - exchangeName - routingKey
  }

  /**
   * description: Close RabbitMQ connection and channel
   * @returns {Promise<void>}
   */
  async closeChannel(): Promise<void> {
    try {
      await this.channel.close();
    } catch (error: any) {
      error.message = `Error closing channel: ${error.message}`;
      console.log(error);
      return;
    }
  }

  async closeConnection(): Promise<void> {
    try {
      await this.conn.close();
    } catch (error: any) {
      error.message = `Error closing connection: ${error.message}`;
      console.log(error);
      return;
    }
  }
 
  /**
   * Description: Create a queue
   * @param name string
   * @param options? Options.AssertQueue
   * @returns promise<Replies.AssertQueue>
   * Replies.AssertQueue = { queue: string, messageCount: number, consumerCount: number }
   */
  async createQueue(name: string, options?: Partial<Options.AssertQueue>): Promise<Replies.AssertQueue> {
    try {
      return await this.channel.assertQueue(name, { ...options }); 
    } catch (error: any) {
      error.message = `Error creating queue ${name}: ${error.message}`;
      console.log(error);
      return { queue: "", messageCount: 0, consumerCount: 0 };     
    }
  }
  
  /**
   * Description: Create a exchange
   * @param name
   * @param type
   * @param options? Options.AssertExchange
   * @returns promise<Replies.AssertExchange>
   * Replies.AssertExchange = { exchange: string }
  */
  async createExchange(name: string, type: typeExchange, options?: Partial<Options.AssertExchange>): Promise<Replies.AssertExchange> {
    try {
      return await this.channel.assertExchange(name, type, { ...options }); 
    } catch (error: any) {
      error.message = `Error creating exchange ${name}: ${error.message}`;
      console.log(error);
      return { exchange: "" };
    }
  }

  /**
   * Description: Bind queue with exchange
   * @param queue string
   * @param exchange string
   * @param routingKey string
   * @returns promise<Replies.Empty>
   * Replies.Empty = {}
   */
  async bindQueueToExchange(queue: string, exchange: string, routingKey: string): Promise<Replies.Empty | void> {
    try {
      await this.channel.bindQueue(queue, exchange, routingKey);
    } catch (error: any) {
      error.message = `Error binding queue ${queue} to exchange ${exchange} with routingKey ${routingKey}: ${error.message}`;
      console.log(error);
      return;
    }
  }

  /**
   * Description: Publish in queue
   * @param queue string
   * @param message string
   * @param options Partial<Options.AssertQueue>
   * @returns boolean
   */
  publishInQueue(queue: string, message: string | object, options?: Partial<Options.Publish>): boolean {
    if (typeof message == "object") message = JSON.stringify(message);
    return this.channel.sendToQueue(queue, Buffer.from(message), { persistent: true, ...options });
  }

  /**
   * Description: Publish in exchange
   * @param exchange string
   * @param routingKey string
   * @param message string
   * @param options Partial<Options.AssertExchange>
   * @returns boolean
   */
  publishInExchange(exchange: string, routingKey: string, message: string | object, options?: Partial<Options.Publish>): boolean {
    if (typeof message == "object") message = JSON.stringify(message);
    return this.channel.publish(exchange, routingKey, Buffer.from(message), { persistent: true, ...options });
  }

  /**
   * Description: Consume messages from queue
   * @param queue string
   * @param callback (message: Message) => void
   * @param prefetch number
   * @returns promise<Replies.Consume>
   * Replies.Consume = { consumerTag: string }
   */
  async consumeFromQueue(queue: string, callback: (message: Message) => void, prefetch: number = 1): Promise<Replies.Consume> {
    // false = no global prefetch (per channel) - true = global prefetch (per connection)
    this.channel.prefetch(prefetch, false); // Meaning that the broker will not send more than one message to a worker at a time
  
    return this.channel.consume(queue, (message: any) => {
      try {
        callback(message);
        this.channel.ack(message);
        return;
      } catch (error:any) {
        this.channel.nack(message);
        error.message = `consumeFromQueue: ${error.message}`;
        console.error(error);
        // this.channel.close();
      }
    });
  }

  /**
   * Description: Delete queue
   * @param queue string
   * @param options Patrial<Options.DeleteQueue>
   * @returns promise<Replies.DeleteQueue>
   * Replies.DeleteQueue = { messageCount: number }
   */
  async deleteQueue(queue: string, options:Partial<Options.DeleteQueue>): Promise<Replies.DeleteQueue> {
    try {
      return await this.channel.deleteQueue(queue, options);
    }
    catch (error:any) {
      error.message = `deleteQueue: ${error.message}`;
      console.error(error);
      return { messageCount: 0 };
    }
  }
  
  /**
   * Description: Purge queue
   * @param queue string
   * @returns promise<Replies.PurgeQueue>
   * Replies.PurgeQueue = { messageCount: number }
   */
  async purgeQueue(queue: string): Promise<Replies.PurgeQueue> {
    try {
      return await this.channel.purgeQueue(queue);
    } catch (error:any) {
      error.message = `purgeQueue: ${error.message}`;
      console.error(error);
      return { messageCount: 0 };
    }
  }
  /**
   * Get connection
   * @returns Connection
   */
  getConnection(): Connection {
    return this.conn;
  }

  /**
   * Get channel
   * @returns Channel
   * */
  getChannel(): Channel {
    return this.channel;
  }

  /**
   * RabbitmqServer instance
   * @returns RabbitmqServer instance [this]
   */
  getThis(): RabbitmqServer {
    return this;
  }

  /**
   * Description: From this point is only persinals methods for this class
   * They are not part of the original rabbitmq class from amqplib
   * It is only for this project with WooCommerce and Wordpress
   */

  /**
   * Description: Consumer WC-Orders
   * @param queue string
   * @param callback (message: Message) => Promise<void>
   * @returns promise<void>
   */
   async consumerWC(queue: string, callback: (message: Message) => Promise<boolean>, options?: Partial<Options.Consume>, notify?: notifyTaskData): Promise<void> {
    this.channel.prefetch(1, false);
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.consume(queue, async (message: any) => {
      try {
        const result:boolean = await callback(message); // processa a mensagem
        if (!result) {
          console.log("consumerWC", "nack");
          this.channel.nack(message);
          return;
        }
        // delay para processamento da mensagem
        await sleepRandomTime({
          minMilliseconds: Number(process.env.WC_ORDERS_MIN_SLEEP_INTERVAL || 500),
          maxMilliseconds: Number(process.env.WC_ORDERS_MAX_SLEEP_INTERVAL || 2000)
        });
        console.log("consumerWC", "ack");
        this.channel.ack(message);

        // This in case we need to notify any other service that the message was processed
        if (notify?.activated) {
          this.publishInQueue(notify.queueName, notify.data);
        }
        return;
      } catch (error:any) {
        this.channel.nack(message);
        console.error("consumeWhatsapp", error);
        this.channel.close();
      }
    }, options);
  }
}
