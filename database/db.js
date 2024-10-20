const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const User =  new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
})

const Todo = new Schema({
    title: {type: String, required: true},
    createdOn : {type: Date, default: Date.now},
    dueDate: Date,
    status: {type: String, enum: ['Not Started', 'Pending', 'Completed'], default: 'Not Started'},
    assignedTo: {type: ObjectId, ref: 'users'}
})

const UserModel = mongoose.model('users', User);
const TodoModel = mongoose.model('todos', Todo);

module.exports = {
    UserModel,
    TodoModel
}