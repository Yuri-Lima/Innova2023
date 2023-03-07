/**
 * @fileoverview This file contains all the cron jobs endpoints
 */
import express from 'express';

/**
 * Description: Endpoint to send tasks to the queue to be processed by the workers
 * @param _req Request
 * @param res Response
 * @returns response
 */
async function tasks(_req: express.Request, res: express.Response): Promise<any> {
    try {
        const exchange = <string>process.env.WC_EXCHANGENAME;
        let routingKey:string;

        // Use query instead of params (this is the original code)
        const taskId = _req.query.taskid? _req.query.taskid : _req.params.taskid;
        const source = _req.query.source? _req.query.source : _req.params.source;
        
        if (!taskId || !source) {
            console.error("Task: ", "Error taskid not found or source not found");
            return res.status(400).json({
                message: 'Error taskid not found or source not found',
            });
        }

        const payload = {
            source: source,
            task: `task_${taskId}`
        };

        /**
         * Description: This switch is to define the routing key to send the task to the queue.
         * Each task has a routing key to be processed by the worker that is responsible for that task.
         * The routing key is defined in the .env file
         */
        switch (taskId) {
            case '1' || 'created':
                routingKey = <string>process.env.WC_TASKS_CREATED_ROUTINGKEY;
                break;
            case '2' || 'updated':
                routingKey = <string>process.env.WC_TASKS_UPDATED_ROUTINGKEY;
                break;
            case '3' || 'deleted':
                routingKey = <string>process.env.WC_TASKS_DELETED_ROUTINGKEY;
                break;
            default:
                routingKey = <string>process.env.WC_TASKS_CREATED_ROUTINGKEY;
                break;
        }
        const statusMQ = rabbitMQ.publishInExchange(exchange, routingKey, payload, {
            persistent: true, // if true, the message will be persisted to disk
            mandatory: true, // if true, the message will be returned if it cannot be routed to a queue
            contentType: "application/json" // MIME type
        });

        if (statusMQ === false) {
            console.error("Task: ", "Error sending task", `task${taskId}`);
            return res.status(400).json({
                message: 'Error sending task, please try again or contact the administrator',
            });
        }

        console.log("Task sent", payload);
        return res.status(200).json(
            {
                message: "Task sent",
                payload: payload
            }
        );
    } catch (error:any) {
        console.error("task1: ", error.message);
        return res.status(201).json({error: error.message})
    }
}

export {
    tasks
}