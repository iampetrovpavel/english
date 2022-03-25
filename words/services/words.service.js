const DbService = require("moleculer-db");
// const setQueryUserId = require('../hooks/setQueryUserId.hook')
const { WORD_NOT_FOUND } = require('../constants')
const { MoleculerClientError } = require("moleculer").Errors;
const Word = require('../models/word.model')
const adapter = require('../configs/adapter')


module.exports = {
    name: "words",
    mixins: [DbService],
    adapter,
    model: Word,
    settings: {
        // fields: ["id", "word", "trans", "createdAt", "updatedAt"],
        entityValidator: {
			text: "string",
            trans: { type: "array", items: "string" },
		},
    },

    hooks: {
        before: {
            find: [
            ],
            list: [
            ],
            count: [
            ],
            create: [
            ]
        },
    },


    actions: {
        list: {
            // auth: "required",
            // params: {
            //     page: Number
            // },
            // handler(ctx){
            //     const { page = 1 } = ctx.params;
            //     const myCustomLabels = {
            //         totalDocs: 'total',
            //         docs: 'rows',
            //         limit: 'pageSize',
            //         page: 'page',
            //         totalPages: 'totalPages',
            //     };
            //     const options = {
            //         sort: {'createdAt': -1},
            //         page,
            //         limit: 10,
            //         customLabels: myCustomLabels,
            //     };
            //     console.log(this.adapter.model.paginate)
            //     return this.adapter.model.paginate({}, options)
            // }
        },
        async random(ctx) {
            const count = await ctx.call('words.count')
            var random = Math.floor(Math.random() * count)
            const word = await ctx.call('words.find', {offset: random})
            if (!word || word.length === 0) { throw new MoleculerClientError(WORD_NOT_FOUND, 404);}
            return word[0];
        },
        create: {
            // auth: "required"
        },
        insert: {auth: "required"},
        update: {auth: "required"},
        remove: {auth: "required"},
    },
    methods: {}
}