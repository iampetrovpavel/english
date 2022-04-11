const { ServiceBroker } = require("moleculer");
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const { MoleculerClientError } = require("moleculer").Errors;
const { compare, genSalt, hash } =  require('bcryptjs')
const jwt = require("jsonwebtoken");
const { EMAIL_PASSWORD_ERROR, EMAIL_EXIST_ERROR, USER_NOT_FOUND } = require('./constants')
const { usersModel } = require('./models/users.model')
const actions = require('./actions')

const broker = new ServiceBroker({
    nodeID: "node-users",
    transporter: "nats://english-nats:4222",
});

const mongo_link = process.env.MONGO_URI+'/'+process.env.MONGO_DB;

broker.createService({
    name: "users",
    mixins: [DbService],

    adapter: new MongooseAdapter(mongo_link),

    model: usersModel,

    settings: {
        fields: ["id", "name", "email", "groups", "createdAt", "tolearn"],
        entityValidator: {
			name: "string",
            email: "string",
            password: "string"
		},
    },

    events: {
        // async "translate.created"(ctx){
        //     console.log("Users got message translate.created with params ", ctx.params)
        //     if(!ctx.params.user)return;
        //     const user = await this.adapter.findById(ctx.params.user.id)
        //     if(!user) throw new MoleculerClientError('Пользователь не найден', 404)
        //     const exist = user.tolearn.find(e=>(
        //         e.word.id==ctx.params.word.id && e.translate.id==ctx.params.translate.id
        //     ))
        //     if(exist)return;
        //     user.tolearn.unshift({
        //         word: {id: ctx.params.word.id, value: ctx.params.word.value}, 
        //         translate: {id: ctx.params.translate.id, value: ctx.params.translate.value}
        //     })
        //     await user.save()
        //     console.log("UPDATED USER ", user.toJSON())
        // }
    },

    hooks: {
        before: {
            create: [
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
        ...actions,
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
                return {token, email: user.email, groups: user.groups, name: user.name};
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
                const token = jwt.sign(newUser, process.env.JWT_KEY)
                ctx.meta.cookies = { token }
                return { token, email: newUser.email, groups: newUser.groups, name: newUser.name };
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
                ctx.meta.cookies = {token: ''}
                return;
            },
        }
    },
    methods: {
        async saveWord({userId, word, translate, id}){
            const user = await this.adapter.findById(userId)
            if(!user) throw new MoleculerClientError('Пользователь не найден', 404)
            user.tolearn.unshift(undefined)
            const existItemIndex = user.tolearn.findIndex(exist=>{
                if(!exist || !exist.word || !exist.word.value)return false;
                return exist.word.value === word.value && exist.translate.value === translate.value;
            })

            if(existItemIndex>=0){
                user.tolearn[0] = user.tolearn[existItemIndex];
                user.tolearn.splice(existItemIndex, 1)
            } else {
                user.tolearn[0] = {
                    _id: id,
                    word,
                    translate
                }
            }
            await user.save()
            console.log("UPDATED USER ", user)
        },
        fixIds(rows){
            const result = rows.map(row=>{
                row.id = row._id
                delete row._id
                console.log(row)
                return {id: row._id, ...row}
            })
            return result;
        },
        async validateUser(email, password) {
            const user = await this.adapter.findOne({email})
            if(!user) {
                return null
            }
            const isCorrectPassword = await compare(password, user.password)

            if(!isCorrectPassword) return null
            return { id: user.id, email: user.email, groups: user.groups, name: user.name }
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