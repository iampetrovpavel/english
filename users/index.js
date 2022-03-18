const { ServiceBroker } = require("moleculer");

console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

const broker = new ServiceBroker({
    nodeID: "node-users",
    transporter: "nats://nats:4222",
});

// Load API Gateway
broker.createService({
    name: "users",
    actions: {
        hello() {
            return 'Hello'
        },
    }
});

// Start server
broker.start();