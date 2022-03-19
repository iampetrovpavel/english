function setQueryUserId(ctx) {
    const query = {userId: ctx.meta.user._id}
    ctx.params.query = query;
    return ctx;
}

module.exports = setQueryUserId;