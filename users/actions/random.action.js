const { MoleculerError } = require("moleculer").Errors;
const { USER_NOT_FOUND } = require('../constants')

module.exports = {
    async handler(ctx){
        const result = [];
        const user = await this.adapter.findById(ctx.meta.user.id)
        if(!user) throw new MoleculerError(USER_NOT_FOUND, 422);
        if(user.tolearn.length === 0) throw new MoleculerError(NO_WORDS, 422)
        const count = user.tolearn.length<10?user.tolearn.length:10;
        let i = 0;
        while (i<count){
            var random = user.tolearn[Math.floor(Math.random()*user.tolearn.length)]
            console.log(!result.includes(random), user.tolearn.length)
            if(!result.includes(random)){
                result.push(random)
                i++;
            }
        }
        return result;
    }
}