const { ServiceBroker } = require("moleculer");
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const { MoleculerClientError } = require("moleculer").Errors;
const mongoose = require("mongoose");
const { compare, genSalt, hash } =  require('bcryptjs')
const jwt = require("jsonwebtoken");

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
            console.log("AUTH REQUIRE ", this.actions.create.auth)
            return 'Hello!'
        },
        wellcome: {
            rest: "POST /users/login",
            params: {
                email: { type: "email" },
                password: { type: "string", min: 1 }
			},
            async handler(ctx) {
                const count = await ctx.call('users.count')
                if(count === 0) {
                    ctx.call('users.create', {
                        name: 'admin',
                        email: ctx.params.email,
                        password: ctx.params.password,
                        groups: ['admin']
                    })
                }
            }
        },
        create: {auth: "required"},
        insert: {auth: "required"},
        update: {auth: "required"},
        remove: {auth: "required"},
        login: {
            rest: "POST /users/login",
            params: {
                email: { type: "email" },
                password: { type: "string", min: 1 }
			},
            async handler(ctx) {
                const {email, password} = ctx.params;
                const user = await this.validateUser(email, password)
                if(!user) throw new MoleculerClientError("Email or password is invalid!", 422, "", [{ field: "email", message: "is not found" }]);
                const token = jwt.sign(user, process.env.JWT_KEY)
                ctx.meta.cookies = {token}
                return {token, email: user.email};
            },
        },
    },
    methods: {
        async validateUser(email, password) {
            const user = await this.adapter.findOne({email})
            if(!user) {
                return null
            }
            const isCorrectPassword = await compare(password, user.password)
            if(!isCorrectPassword) return null
            return { email: user.email }
        },
    }
});

broker.start();