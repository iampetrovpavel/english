const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const { translateModel } = require('../models/translate.model')

module.exports = {
    name: 'translates',
    mixins: [DbService],
    adapter: new MongooseAdapter(process.env.MONGO_URI+'/'+process.env.MONGO_DB),
    model: translateModel,
    settings: {
        fields: ["id", "word", "wordId", "value", "createdAt", "version", "creatorId", "checked"],
    },
    events: {
        async "word.created"(ctx){
            console.log("Translate got message word.created with params ", ctx.params)
            let translate = await this.adapter.findOne({
                value: ctx.params.translate.value,
                word: ctx.params.word.value
            })
            if(!translate) {
                translate = await this.adapter.model.create({
                    _id: ctx.params.translate.id,
                    value: ctx.params.translate.value,
                    word: ctx.params.word.value,
                    wordId: ctx.params.word.id,
                    creatorId: ctx.params.user.id
                })
                ctx.emit("translate.created", {
                    translate: translate.toJSON(),
                    word: ctx.params.word,
                    user: ctx.params.user
                });
            } else {
                console.log("TRANSLATE EXIST")
            }
        }
    }
}