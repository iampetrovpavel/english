const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const mongoose = require("mongoose");
const specifyUser = require('../hooks/specifyUser.hook')
const { WORD_NOT_FOUND } = require('../constants')
const { MoleculerClientError } = require("moleculer").Errors;
const mongoosePaginate = require('mongoose-paginate-v2');

mongoose.plugin(mongoosePaginate);

const wordsSchema = new mongoose.Schema({
    word: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    trans: {type: [String]},
    createdAt: {type: Date, default: Date.now}
})

const wordsModel = mongoose.model('Word', wordsSchema)
// wordsModel.plugin(mongoosePaginate);

module.exports = {
    name: "words",
    mixins: [DbService],

    adapter: new MongooseAdapter(process.env.MONGO_URI),

    model: wordsModel,

    settings: {
        fields: ["_id", "word", "trans", "createdAt", "userId"],
        entityValidator: {
			word: "string",
            trans: { type: "array", items: "string" },
		},
    },

    hooks: {
        before: {
            find: [
                specifyUser
            ],
            list: [
                specifyUser,
            ],
            count: [
                specifyUser
            ],
            create: [
                function addUser(ctx) {
                    ctx.params.userId = ctx.meta.user._id
                    return ctx
                }
            ]
        },
    },


    actions: {
        list: {
            auth: "required",
            params: {
                page: Number
            },
            handler(ctx){
                const { page = 1 } = ctx.params;
                const myCustomLabels = {
                    totalDocs: 'total',
                    docs: 'rows',
                    limit: 'pageSize',
                    page: 'page',
                    totalPages: 'totalPages',
                };
                const options = {
                    sort: {'createdAt': -1},
                    page,
                    limit: 10,
                    customLabels: myCustomLabels,
                };
                return this.adapter.model.paginate({}, options)
            }
        },
        async random(ctx) {
            return await this.adapter.model.aggregate([
                { '$sample': {size: 3} }
            ]);
        },
        create: {auth: "required"},
        insert: {auth: "required"},
        update: {auth: "required"},
        remove: {auth: "required"},
    },
    methods: {}
}