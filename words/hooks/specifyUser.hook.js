const { MoleculerClientError } = require("moleculer").Errors;
const { USER_NOT_AUTHORIZED } = require('../constants')

function specifyUser(ctx) {
    if (!ctx.meta.user) throw new MoleculerClientError(USER_NOT_AUTHORIZED, 404);
    const query = {userId: ctx.meta.user._id}
    ctx.params.query = query;
    return ctx;
}

module.exports = specifyUser;