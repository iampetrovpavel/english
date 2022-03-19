const { ServiceBroker } = require("moleculer");
const WordsService = require("./services/words.service")

const broker = new ServiceBroker({
    nodeID: "node-words",
    transporter: "nats://nats:4222",
});

broker.createService(WordsService);

broker.start();