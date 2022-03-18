const { ServiceBroker } = require("moleculer");
const ApiService = require("moleculer-web");

const broker = new ServiceBroker({
    nodeID: "node-api",
    transporter: "nats://nats:4222",
});

// Load API Gateway
broker.createService(ApiService);

// Start server
broker.start();