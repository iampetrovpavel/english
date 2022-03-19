module.exports = {
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
            ]
        },
    },


    actions: {
        hello(ctx) {
            return 'Hello!'
        },
        create: {auth: "required"},
        insert: {auth: "required"},
        update: {auth: "required"},
        remove: {auth: "required"},
    },
    methods: {}
}