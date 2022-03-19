const { ServiceBroker } = require("moleculer");
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const { MoleculerClientError } = require("moleculer").Errors;
const mongoose = require("mongoose");
const { compare, genSalt, hash } =  require('bcryptjs')
const jwt = require("jsonwebtoken");
const { EMAIL_PASSWORD_ERROR, EMAIL_EXIST_ERROR, USER_NOT_FOUND } = require('./constants')

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
        email: { type: String, unique: true },
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
            ],
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
                    const admin = await ctx.call('users.create', {
                            name: 'admin',
                            email: ctx.params.email,
                            password: ctx.params.password,
                            groups: ['admin']
                        })
                    return admin
                }
                throw new MoleculerClientError("First admin allready created", 422);
            }
        },
        create: {auth: "required", admin: "required"},
        insert: {auth: "required", admin: "required"},
        update: {auth: "required", admin: "required"},
        remove: {auth: "required", admin: "required"},
        login: {
            rest: "POST /users/login",
            params: {
                email: { type: "email" },
                password: { type: "string", min: 1 }
			},
            async handler(ctx) {
                const { email, password } = ctx.params;
                const user = await this.validateUser(email, password)
                if(!user) throw new MoleculerClientError(EMAIL_PASSWORD_ERROR, 422);
                const token = jwt.sign(user, process.env.JWT_KEY)
                ctx.meta.cookies = {token}
                return {token, email: user.email, groups: user.groups};
            },
        },
        reg: {
            params: {
                email: { type: "email" },
                name: { type: "string", min: 2 },
                password: { type: "string", min: 4 }
			},
            async handler(ctx) {
                const { email, password, name } = ctx.params;
                const user = await this.validateEmail(email)
                if( user ) throw new MoleculerClientError(EMAIL_EXIST_ERROR, 422);
                const newUser = await ctx.call('users.create', {email, password, name})
                const token = this.signJWT({_id: newUser._id, email: newUser.email, groups: newUser.groups})
                ctx.meta.cookies = { token }
                return { token, email: newUser.email, groups: newUser.groups };
            },
        },
        me: {
            auth: "required",
            async handler(ctx) {
                const { email } = ctx.meta.user;
                const user = await this.adapter.findOne({ email });
                if( !user ) throw new MoleculerClientError( USER_NOT_FOUND, 422);
                return { email: user.email, groups: user.groups, name: user.name };
            },
        },
        exit: {
            auth: "required",
            async handler(ctx) {
                ctx.meta.cookies = null
                return;
            },
        }
    },
    methods: {
        async validateUser(email, password) {
            const user = await this.adapter.findOne({email})
            if(!user) {
                return null
            }
            const isCorrectPassword = await compare(password, user.password)

            if(!isCorrectPassword) return null
            return { _id: user._id, email: user.email, groups: user.groups }
        },
        async validateEmail(email) {
            const user = await this.adapter.findOne({email})
            if(user) { return user }
            return null
        },
        signJWT(payload) {
            return jwt.sign(payload, process.env.JWT_KEY)
        }
    }
});

broker.start();