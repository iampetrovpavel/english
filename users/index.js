const { ServiceBroker } = require("moleculer");
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const mongoose = require("mongoose");
const { compare, genSalt, hash } =  require('bcryptjs')
const jwt = require("jsonwebtoken");
const authorize = require("./authorize")

const broker = new ServiceBroker({
    nodeID: "node-users",
    transporter: "nats://nats:4222",
});

broker.createService({
    name: "users",
    mixins: [DbService],

    adapter: new MongooseAdapter(process.env.MONGO_URI),

    model: mongoose.model("User", mongoose.Schema({
        name: { type: String },
        email: { type: String },
        password: { type: String},
        createdAt: { type: Date},
        groups: {type: [String]}
    })),

    settings: {
        fields: ["_id", "name", "email", "groups", "createdAt"],
        entityValidator: {
			name: "string",
            email: "string",
            password: "string"
		},
        authorization: true,
        routes: [{
            path: '/users',
            authorization: true
        }]

    },

    hooks: {
        before: {
            create: [
                function addTimestamp(ctx) {
                    ctx.params.createdAt = new Date();    
                    return ctx;
                },
                async function hashPassword(ctx) {
                    const salt = await genSalt(10);
                    const hashedPassword = await hash(ctx.params.password, salt);
                    ctx.params.password = hashedPassword;
                    return ctx;
                }
            ]
        },
    },

    actions: {
        hello(ctx) {
            console.log("!!!!!!!!!!!!!!!", ctx.meta)
            return 'Hello'
        },
        async login(ctx) {
            const {email, password} = ctx.params;
            const user = await this.validate(email, password)
            console.log("!!!!!!!", user)
            if(!user) return null
            const userJwt = jwt.sign(user, process.env.JWT_KEY)
            return userJwt;
        },

    },
    methods: {
        async validate(email, password) {
            const user = await this.adapter.findOne({email})
            if(!user) {
                return null
            }
            const isCorrectPassword = await compare(password, user.password)
            if(!isCorrectPassword) return null
            return { email: user.email }
        },
        authorize
    }
});

broker.start();