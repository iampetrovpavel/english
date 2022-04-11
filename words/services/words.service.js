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
        fields: ["id", "value", "createdAt", "version", "creatorId", "translate", "translateId", "checked"],
    },
    events: {
        async "word.added"(ctx){
            console.log("Words got message word.added with params ", ctx.params)
            let word = await this.adapter.model.findOne({
                value: ctx.params.word.value,
                // translate: ctx.params.translate.value
            })
            if(!word){
                word = await this.adapter.model.create({
                    _id: ctx.params.word.id,
                    value: ctx.params.word.value,
                    translate: ctx.params.translate.value,
                    translateId: ctx.params.translate.id,
                    creatorId: ctx.params.user.id
                })
            } else {
                console.log("WORD EXIST")
            }
            ctx.broker.emit('word.created', { 
                word: word.toJSON(),
                translate: ctx.params.translate,
                user: ctx.params.user
            })
        }
    },
    actions: {
        create: {
            params: {
                word: {type: "string", min: 1, max: 30},
                translate: {type: "string", min: 1, max: 30}
            },
            async handler(ctx){
                let word = await this.adapter.model.findOne({value: ctx.params.word})
                if(!word){
                    word = await this.adapter.model.create({
                        value: ctx.params.word,
                        translate: ctx.params.translate,
                        creatorId: ctx.meta.user
                    })
                }
                console.log('word', word)
                ctx.broker.emit('word.created', { 
                    word: word.toJSON(), 
                    translate: ctx.params.translate,
                    user: ctx.meta.user,
                })
                return word;
            }
        },
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