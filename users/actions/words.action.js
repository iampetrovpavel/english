const { MoleculerError } = require("moleculer").Errors;
const { AUTH_ERROR } = require('../constants')

module.exports = {
    async handler(ctx) {
        if(!ctx.meta.user){ throw new MoleculerError(AUTH_ERROR, 401)}
        const { page = 1, pageSize = 5} = ctx.params;
        const data = await this.adapter.model.aggregate([
            {$match: {email: ctx.meta.user.email}},
            {$project: {
                rows: {$slice: ["$tolearn", (page - 1) * pageSize, pageSize]},
                total: {$size: "$tolearn"},
            }},
        ])
        if(!Array.isArray(data) && data.length===0)return;
        return {rows: this.fixIds(data[0].rows), total: data[0].total, page, pageSize}
    }
}