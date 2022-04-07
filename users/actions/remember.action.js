var mongoose = require('mongoose');
const { MoleculerError } = require("moleculer").Errors;
const { WORD_EXIST } = require('../constants')

module.exports = {
    params: {
        word: { type: "string", min: 1},
        translate: { type: "string", min: 1 }
    },
    async handler(ctx){
        const user = await this.adapter.findById(ctx.meta.user.id)
        const existWord = user.tolearn.find(item=>(
            item.word.value==ctx.params.word && item.translate.value==ctx.params.translate
        ))
        // if(!existWord){
            var wordId = new mongoose.Types.ObjectId().toHexString();
            var translateId = new mongoose.Types.ObjectId().toHexString();
            var id = new mongoose.Types.ObjectId().toHexString();
            await this.saveWord({
                id,
                word: {value: ctx.params.word, id: wordId},
                translate: {value: ctx.params.translate, id: translateId},
                userId: ctx.meta.user.id
            })
            ctx.broker.emit('word.added', {
                id,
                word: {value: ctx.params.word, id: wordId},
                translate: {value: ctx.params.translate, id: translateId},
                user: ctx.meta.user
            })
            if(existWord)throw new MoleculerError( WORD_EXIST, 422);
            return {
                id,
                word: {value: ctx.params.word, id: wordId},
                translate: {value: ctx.params.translate, id: translateId},
            }
        // } else throw new MoleculerError( WORD_EXIST, 422)
    }
}