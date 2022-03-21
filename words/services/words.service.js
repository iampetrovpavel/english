const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const mongoose = require("mongoose");
const setQueryUserId = require('../hooks/setQueryUserId.hook')
const { WORD_NOT_FOUND } = require('../constants')
const { MoleculerClientError } = require("moleculer").Errors;
const mongoosePaginate = require('mongoose-paginate-v2');

mongoose.plugin(mongoosePaginate);

const wordsSchema = new mongoose.Schema({
    word: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    trans: {type: [String]},
    createdAt: {type: Date}
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
                setQueryUserId
            ],
            list: [
                setQueryUserId,
            ],
            count: [
                setQueryUserId
            ],
            create: [
                function addTimestamp(ctx) {
                    ctx.params.createdAt = new Date();    
                    return ctx;
                },
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
                console.log(this.adapter.model.paginate)
                return this.adapter.model.paginate({}, options)
            }
        },
        async random(ctx) {
            const count = await ctx.call('words.count')
            var random = Math.floor(Math.random() * count)
            const word = await ctx.call('words.find', {offset: random})
            if (!word || word.length === 0) { throw new MoleculerClientError(WORD_NOT_FOUND, 404);}
            return word[0];
        },
        create: {auth: "required"},
        insert: {auth: "required"},
        update: {auth: "required"},
        remove: {auth: "required"},
    },
    methods: {}
}