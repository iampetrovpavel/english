const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const specifyUser = require('../hooks/specifyUser.hook')
const { wordsModel } = require('../models/words.model')

module.exports = {
    name: "words",
    mixins: [DbService],
    adapter: new MongooseAdapter(process.env.MONGO_URI+'/'+process.env.MONGO_DB),
    model: wordsModel,
    settings: {
        fields: ["id", "word", "createdAt", "version"],
    },
    actions: {
        create: {
            params: {
                word: {type: "string"},
                translate: {type: "string"}
            },
            async handler(ctx){
                let word = await this.adapter.model.findOne({word: ctx.params.word})
                if(!word){
                    word = await this.adapter.model.create({word: ctx.params.word})
                }
                ctx.broker.emit('word.created', { 
                    word: word.toJSON(), 
                    translate: ctx.params.translate,
                    user: ctx.meta.user
                })
                return word;
            }
        },
        // list: {
        //     auth: "required",
        //     params: {
        //         page: Number
        //     },
        //     handler(ctx){
        //         const { page = 1 } = ctx.params;
        //         const myCustomLabels = {
        //             totalDocs: 'total',
        //             docs: 'rows',
        //             limit: 'pageSize',
        //             page: 'page',
        //             totalPages: 'totalPages',
        //         };
        //         const options = {
        //             sort: {'createdAt': -1},
        //             page,
        //             limit: 10,
        //             customLabels: myCustomLabels,
        //         };
        //         return this.adapter.model.paginate({}, options)
        //     }
        // },
        async random(ctx) {
            return await this.adapter.model.aggregate([
                { '$sample': {size: 3} }
            ]);
        },
        // create: {auth: "required"},
        // insert: {auth: "required"},
        // update: {auth: "required"},
        // remove: {auth: "required"},
    },
    methods: {}
}