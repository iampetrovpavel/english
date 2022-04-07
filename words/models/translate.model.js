const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

mongoose.plugin(mongoosePaginate);

const translateSchema = new mongoose.Schema({
    wordId: {type: String},
    word: {type: String},
    value: {type: String},
    creatorId: {type: String},
    createdAt: {type: Date, default: Date.now}
},{
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
})

translateSchema.set('versionKey', 'version')

const translateModel = mongoose.model('Translate', translateSchema)

module.exports = { translateModel }