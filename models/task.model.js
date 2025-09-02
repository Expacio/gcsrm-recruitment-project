const mongoose = require('mongoose')

const task_schema = mongoose.Schema({
    title: String,
    description: String,
    status: String,
    dueDate: Date
})

module.exports = mongoose.model('Task', task_schema)