const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const { translateModel } = require('../models/translate.model')

module.exports = {
    name: 'translates',
    mixins: [DbService],
    adapter: new MongooseAdapter(process.env.MONGO_URI+'/'+process.env.MONGO_DB),
    model: translateModel,
    settings: {
        fields: ["id", "words", "translate", "createdAt", "version"],
    },
    events: {
        async "word.created"(ctx){
            console.log("Translate got message word.created with params ", ctx.params)
            let translate = await this.adapter.findOne({translate: ctx.params.translate})
            if(!translate) {
                translate = await this.adapter.model.create({ 
                    translate: ctx.params.translate,
                    words: [ctx.params.word.id]
                })
            } else {
                let word = translate.words.find(id=>ctx.params.word.id==id)
                if (!word) {
                    translate.words.push(ctx.params.word.id)
                    await translate.save()
                }
            }

            ctx.emit("translate.created", { 
                translate, 
                word: ctx.params.word,
                user: ctx.params.user
            });
        }
    }
}