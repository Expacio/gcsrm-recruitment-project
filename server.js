    const express = require('express');
    const mongoose = require('mongoose');
    const app = express()
    const Task = require('./models/task.model')
    app.use(express.json())

    mongoose.connect('mongodb://localhost:27017/task_management', {
    }).then(() => {
        console.log('Connected to the db')
    })

    app.get('/', (req, res) => {
    res.send('Hello World!')
    })

    app.post('/api/tasks/create', (req, res) => {
        const task = new Task(req.body)
        task.save().then(() => {
            res.status(201).send(task)
        }).catch((error) => {
            res.status(400).send(error)
        })
    })

    app.get('/api/tasks/all', (req, res) => {
        Task.find().then((tasks) => {
            if (!tasks || tasks.length === 0) {
                return res.status(404).json({ error: 'No tasks found!' })
            }
            res.status(200).send(tasks)
        }).catch((error) => {
            res.status(400).send(error)
        })
        })

    app.get('/api/tasks/findbyid/:id', (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid task ID format" })
    }
    Task.findById(id)
        .then((task) => {
            if (!task) {
                return res.status(404).json({ error: "Task not found" })
            }
            res.status(200).json(task)
        })
        .catch(() => {
            res.status(500).json({ error: "Server error" })
        })})


    app.post('/api/tasks/update/:id', (req, res) =>{
        const {id} = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid task ID format" })
        }

        Task.findByIdAndUpdate(id, req.body, {new: true}).then((task) => {
            res.status(200).send(task)
        }).catch((error) => {
            res.status(400).send(error)
        })
    })

    app.delete('/api/tasks/delete/:id', (req, res) => {
        const {id} = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid task ID format" })
        }
        Task.findByIdAndDelete(id).then(() => {
            res.status(204).send()
        }).catch((error) => {
            res.status(400).send(error)
        })
    })

    app.listen(3000)