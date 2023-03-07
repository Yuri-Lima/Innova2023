const path = require('path');
const envs = require('../server/.env.json');

// console.log('envs', envs);

module.exports = {
  apps : [
    {
      namespace: 'Server Innova',
      name: 'NewInnova',
      script: '../server/dist/src/server.js', // Or whatever your start script is
      instances: 2, // Number of instances to run
      source_map_support: true, // Enable source map support
      exec_mode: 'cluster', // Run your app in cluster mode
      ignore_watch: ['node_modules'],
      max_memory_restart: '1G', // Restart your app if it exceeds 1GB
      restart_delay: 2000, // Time in ms to wait before crashed process restarts
      autorestart: false, // Restart the process if it crashes (default: true)
      cron_restart: '0 1 * * * *', // Restart the process every day at 1:00 AM
      wait_ready: true, // Wait for the app to be ready before launching
      listen_timeout: 10000, // Time in ms to wait for the app to be ready
      shutdown_with_message: true, // Send a message to the process before killing it
      // force: true, // Force restart if the process is not alive
      env: {
        ...envs,
      }
    },
    // {
    //   namespace: 'ConsumerWC',
    //   name: 'Wc Worker',
    //   script: '../server/dist/src/workers/wc.js', // Or whatever your start script is
    //   instances: 2, // Number of instances to run
    //   source_map_support: true, // Enable source map support
    //   exec_mode: 'cluster', // Run your app in cluster mode
    //   ignore_watch: ['node_modules'],
    //   env: {
    //     ...envs,
    //   }
    // },
    // {
    //   namespace: 'SockerIO',
    //   name: 'SockerIO Worker',
    //   script    : "../server/dist/src/workers/socket.io.js",
    //   instances : "1",
    //   exec_mode : "cluster",
    //   ignore_watch: ['node_modules'],
    //   env: {
    //     ...envs,
    //   }
    // },
    // {
    //   namespace: 'Uatiz',
    //   name: 'Uatiz Worker',
    //   script    : "../server/dist/src/workers/uatiz.js",
    //   instances : "1",
    //   exec_mode : "cluster",
    //   ignore_watch: ['node_modules'],
    //   env: {
    //     ...envs,
    //   }
    // }
  ]
};
