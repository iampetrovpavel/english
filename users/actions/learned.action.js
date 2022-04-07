module.exports = {
    params: {
        id: {type: "string"}
    },
    async handler(ctx) {
        const user = await this.adapter.findById(ctx.meta.user.id)
        user.tolearn.pull({_id: ctx.params.id})
        await user.save()
        return this.fixIds(user.toJSON().tolearn);
    }
}