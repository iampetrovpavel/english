const { ServiceBroker } = require("moleculer");
const WordsService = require("./services/words.service")
const TranslatesService = require("./services/translates.service")

const broker = new ServiceBroker({
    nodeID: "node-words",
    transporter: "nats://english-nats:4222",
});

broker.loadServices('services');
// broker.createService(WordsService);

// broker.createService(TranslatesService);

broker.start();