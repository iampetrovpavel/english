const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String},
    createdAt: { type: Date, default: Date.now},
    groups: {type: [String]},
    tolearn: {type: [{
        word: {id: String, value: String},
        translate: {id: String, value: String},
    }], default: [{
        word: {id: '1', value: 'Wellcome'},
        translate: {id: '2', value: 'Добро пожаловать'},
    }]}
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
})

usersSchema.set('versionKey', 'version')

const usersModel = mongoose.model("User", usersSchema)


module.exports = { usersModel }
