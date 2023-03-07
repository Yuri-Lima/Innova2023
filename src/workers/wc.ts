require("dotenv").config();
/**
 * Third Party Imports
 */
import { Message } from "amqplib";
import axios from "axios";

/**
 * From Services
 */
import RabbitmqServer from "../services/rabbitMQ";
import cacheStrategyRedis from "../Utils/cacheStrategyRedis";
import { mongoConnection } from "../services/mongo";
// import spreadSheet from "../services/spreadSheet";

/**
 * From Models
 */
import { OrdersModel } from '../db/models/wc.orders.model';
import { UatizMsgModel } from '../db/models/wc.uatiz.model';

/**
 * From Utils
 */
import stringInjections from '../Utils/string.injections';
import { randomNumbersRange } from "../Utils/randomNumbers";
import { data_to_be_Injected_Function } from '../Utils/data_to_be_Injected';

/**
 * from Types
 */
import { orderproperties } from '../types/order';
import { getWooStatusTranslated } from "../Utils/woo.status.type";

/**
 * SpreadSheet Auth
 */
// let authSpreadSheet: any;
// (async () => {
//     authSpreadSheet = await spreadSheet.getAuthorize();
// })();

/**
 * Mongo Connection
 */
(async () => {
    await mongoConnection();
})();


/**
 * Description: RabbitMQ Connection
 * @returns RabbitMQ Instance
 */
async function RabbitMQConnection() {
    try {
        const rabbitMQ = new RabbitmqServer({
            uri: process.env.AMQP_URI || "amqp://localhost:5672",
            prefetch: 1,
        });
        await rabbitMQ.start();
        return rabbitMQ; // Return rabbitMQ instance
    } catch (error:any) {
        error.source = "RabbitMQConnection"; // Add source to error
        throw new Error(error);
    }
}

/**
 * Description: Order Created Consumer.
 * @param _msg Message
 */
RabbitMQConnection().then(async (mq) => {
    const queueName = <string>process.env.WC_TASKS_CREATED_QUEUENAME;
    const queueNameDone = <string>process.env.WC_TASKS_DONE_CREATED_QUEUENAME;

    /**
     * Description: Notify the WC_TASKS_DONE_CREATED_QUEUENAME that the task is done.
     * That notification will trigger the Uatiz API.
     */
    const notifyTaskDoneData = {
        queueName: queueNameDone,
        activated: true,
        data: "done",
        source: "wc",
    };
    console.log("queueName: ", queueName);
    mq.consumerWC(queueName, orderCreatedConsumerTasks, {priority: 1}, notifyTaskDoneData);
});

const orderCreatedConsumerTasks = async (_msg: Message) => {
    console.log("orderCreatedConsumerTasks: ", _msg.content.toString());

    let final_list_to_be_used_by_uatiz:any = [];

    /**
     * @description: Get the first 30 orderCreated from the database.
     */
    const orders = await OrdersModel.find(
        {
            orderCreated: { $exists: true }, // Check if the orderCreated exists.
        },
        { __v: 0 }, // remove __v from the response.
        {
            sort: { createdAt: 1 }, // sort by createdAt in ascending order.
            limit: 30, // limit to 30. This is a requirement from the API. Could be changed in the future.
        },
    )
    
    /**
     * @description: If there are no orders, no need to save the data in the UatizMsgModel.
     * Just return true. The Uatiz API will not be triggered.
     */
    if(!orders.length) {
        console.log("No Created orders found");
        return true;
    }
    /**
     * Get all messages from the API and store it in the Redis Cache.
     * The cache will be updated every 5 minutes.
     * The cache will be deleted if the server is restarted.
     */
    const endpoint = "https://innovaapi.yurilima.uk/api/woo/order/created/get-all-msg";
    const limit =  30; // limit to 30. This is a requirement from the API. Could be changed in the future.
    const query = `?page=1&limit=${limit}&order=asc`;
    const msgData = await cacheStrategyRedis("wc-orders-created-msg", async () => {
        const data = await axios.get(endpoint + query);
        return data.data.msgData;
    }, 300)
    .catch((error:any) => {
        console.error("Error getting the updated messages from the API", error.message);
    });

    /**
     * Select a random number from the array
     * The random number is used to select a random message from the array
     */
    const selectedNumber = randomNumbersRange(0, msgData.length - 1); // It has to be -1 because the array starts at 1
    const selectedMsg = msgData[selectedNumber];

    /**
     * Loop through the orders and create the final list to be used by the Uatiz API
     */
    for(let i = 0; i < orders.length; i++) {
        const obj = <orderproperties> orders[i].toObject().orderCreated;

        /**
         * Pre insert the data to an object to be used by the stringInjections function
         * The stringInjections function will replace the placeholders with the data
         * The data will be injected in the message.
         * Example: "Hello {name}, your order {orderNumber} has been created."
         * Output: "Hello John, your order 123456 has been created."
         **/
        const data_to_be_Injected = data_to_be_Injected_Function(obj);

        const msgclient =  stringInjections(selectedMsg.msgClient, data_to_be_Injected);
        const msgAdmin =  stringInjections(selectedMsg.msgAdmin, data_to_be_Injected);

        final_list_to_be_used_by_uatiz.push({
            client: {
                msg: msgclient,
                phone: obj.billing.phone,
            },
            clientDestination: {},
            admin: {
                msg: msgAdmin,
                phone: selectedMsg.mobileMsgAdmin
            }
        });
    }

    /**
     * Save the message to the database to be used by the Uatiz API
     */
    const uatizMsg = await UatizMsgModel.create({
        uatizMsg: final_list_to_be_used_by_uatiz,
    });
    console.log("Uatiz Created List: ", final_list_to_be_used_by_uatiz);
    final_list_to_be_used_by_uatiz = []; // Empty the array to free up memory space for the next iteration.

    // Check if the message was saved to the database
    if(!uatizMsg) {
        console.error("Error saving the message to the database", uatizMsg);
        return false; // Return false if the message was not saved to the database
    }
    
    /**
     * Delete the last 30 orders created from the database
     */
    for (const order of orders) {
        const result = await OrdersModel.deleteOne({_id: order._id});
        console.log("Order deleted: ", result);
    }
    
    return true;
};

/**
 * Description: Order Updated Consumer.
 * @param _msg Message
 */
RabbitMQConnection().then(async (mq) => {
    const queueName = <string>process.env.WC_TASKS_UPDATED_QUEUENAME;
    const queueNameDone = <string>process.env.WC_TASKS_DONE_UPDATED_QUEUENAME;
    const notifyTaskDoneData = {
        queueName: queueNameDone,
        activated: true,
        data: "done",
        source: "wc",
    };
    mq.consumerWC(queueName, orderUpdatedConsumerTasks, {priority: 2}, notifyTaskDoneData);
});

const orderUpdatedConsumerTasks = async (_msg: Message) => {
    console.log("orderUpdatedConsumerTasks: ", _msg.content.toString());

    let errorFlag = true;

    let final_list_to_be_used_by_uatiz:any = [];

    /**
     * Description: Get the first 30 orderUpdated from the database.
     */
    const orders = await OrdersModel.find(
        {
            orderUpdated: { $exists: true }, // Check if the orderUpdated exists.
        },
        { __v: 0 }, // remove __v from the response.
        {
            sort: { createdAt: 1 }, // sort by createdAt in ascending order.
            limit: 30, // limit to 30. This is a requirement from the API. Could be changed in the future.
        },
    );

    if(!orders) {
        console.error("No Updated orders found");
        return true;
    }

    /**
     * Loop through the orders and create the final list to be used by the Uatiz API
     */
    for(let i = 0; i < orders.length; i++) {
        const obj = <orderproperties> orders[i].toObject().orderUpdated;

        /**
         * Description: Translate the status from the API to the status used by WooCommerce
         * And add it to the data_to_be_Injected_Function
         */
        const statusTranslated = {
            "status": getWooStatusTranslated(obj.status),
        }

        if(statusTranslated?.status === "Status not found") {
            console.error("Status not found");
            errorFlag = false;
        }
        /**
         * Get all messages from the API and store it in the Redis Cache.
         * The cache will be updated every 5 minutes.
         * The cache will be deleted if the server is restarted.
         */        
        let endpoint = `https://innovaapi.yurilima.uk/api/woo/order/${obj.status}/get-all-msg`;
        const limit =  30; // limit to 30. This is a requirement from the API. Could be changed in the future.
        let query = `?page=1&limit=${limit}&order=asc`;
        const msgData = await cacheStrategyRedis(`wc-orders-${obj.status}-msg`, async () => {
            const data = await axios.get(endpoint + query);
            return data.data.msgData;
        }, 300)
        .catch((error:any) => {
            console.error("[ wc.ts ] - Error getting the updated messages from the API\n", error.message);
            errorFlag = false;
        });
    
        /**
         * Select a random number from the array
         * The random number is used to select a random message from the array
         */
        const selectedNumber = randomNumbersRange(0, msgData.length - 1); // It has to be -1 because the array starts at 1
        const selectedMsg = msgData[selectedNumber];

        /**
         * Pre insert the data to an object to be used by the stringInjections function
         * The stringInjections function will replace the placeholders with the data
         * The data will be injected in the message.
         * Example: "Hello {name}, your order {orderNumber} has been created."
         * Output: "Hello John, your order 123456 has been created."
         **/
        const data_to_be_Injected = data_to_be_Injected_Function(obj, statusTranslated);

        const msgclient =  stringInjections(selectedMsg.msgClient, data_to_be_Injected);
        const msgAdmin =  stringInjections(selectedMsg.msgAdmin, data_to_be_Injected);

        final_list_to_be_used_by_uatiz.push({
            client: {
                msg: msgclient,
                phone: obj.billing.phone,
            },
            clientDestination: {},
            admin: {
                msg: msgAdmin,
                phone: selectedMsg.mobileMsgAdmin
            }
        });
    }
    if (errorFlag === false) {
        console.error("Error getting the updated messages from the API");
        return false;
    }

    /**
     * Save the message to the database to be used by the Uatiz API
     */
    const uatizMsg = await UatizMsgModel.create({
        uatizMsg: final_list_to_be_used_by_uatiz,
    });
    console.log("Uatiz Updated List: ", final_list_to_be_used_by_uatiz);
    final_list_to_be_used_by_uatiz = []; // Empty the array to free up memory space for the next iteration.

    // Check if the message was saved to the database
    if(!uatizMsg) {
        console.error("Error saving the message to the database", uatizMsg);
        errorFlag = false; // Return false if the message was not saved to the database
    }

    /**
     * Delete the last 30 orders updated from the database
     */
    for (const order of orders) {
        const result = await OrdersModel.deleteOne({_id: order._id});
        console.log("Order deleted: ", result);
    }

    return true;
};
//@deprecated - From here - This is not being used anymore
/**
 * Description: Order Created Consumer.
 * @param _msg Message
 */
// RabbitMQConnection().then(async (mq) => {
//     mq.consumerWC("wc-orders-created", orderCreatedConsumer, {priority: 1}); // This will be executed first
// });

/**
 * Description: Order Created Consumer Processing data.
 * @param _msg Message
 */
// const orderCreatedConsumer = async (_msg: Message) => {
//     /**
//      * Read the spreadsheet
//      * Cache has been implemented in the service to avoid reading the spreadsheet every time
//      * The default cache time is 30 minutes
//      */
//     // const arraySpreadSheet =  await spreadSheet.readSheet({
//     //     spreadsheetId: process.env.WC_SPREADSHEET_0_ID || "",
//     //     sheetNameRange: process.env.WC_SPREADSHEET_0_NAME_RANGE || "",
//     //     majorDimension: process.env.WC_SPREADSHEET_0_MAJOR_DIMENSION || "",
//     //     auth: authSpreadSheet,
//     //     valueRenderOption: process.env.WC_SPREADSHEET_0_VALUERENDEROPTION || "",
//     // });
    
//     const order = JSON.parse(_msg.content.toString());
//     // stringInjections(order, array);
//     console.log(" [x] Done Created");
//     console.log(order);
//     return true;
// };

/**
 * Description: Order Updated Consumer.
 * @param _msg Message
 */
// RabbitMQConnection().then(async(mq) => {
//     mq.consumerWC("wc-orders-updated", orderUpdatedConsumer, {priority: 2}); // This will be executed after the previous one
// });

/**
 * Description: Order Updated Consumer Processing data.
 * @param msg Message
 */
// const orderUpdatedConsumer = async (msg: Message) => {
//     console.log(" [x] Received %s", msg.content.toString());
//     console.log(" [x] Done Updated");
//     return true;
// };

// app.rabbitMQ.consumerWC("wc-orders-created", orderCreatedConsumer, {priority: 1}); // This will be executed first
