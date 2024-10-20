const { Router } = require('express');
const userMiddleware = require('../middleware/userMiddleware');
const todoRouter = Router();
const { z } = require('zod');
const { TodoModel, UserModel } = require('../database/db');

todoRouter.post("/add", userMiddleware, async (req, res) => {
    const todoSchema = z.object({
        title: z.string(),
        dueDate: z.string().date().optional(),
        status: z.string().optional(),
    })
    const parsedTodo = todoSchema.safeParse(req.body);
    if(!parsedTodo.success) {
        return res.status(422).json({
            msg: "Invalid format"
        })
    }
    try {
        const todo = await TodoModel.create({
            title: parsedTodo.data.title,
            ...(parsedTodo.data.status && { status: parsedTodo.data.status }),
            assignedTo: req.userId,
            ...(parsedTodo.data.dueDate && { dueDate: parsedTodo.data.dueDate })
        })
        res.status(200).json({
            msg: `Successfully added todo`,
            todo
        })
    }
    catch(e) {
        res.json({
            msg: "Error creating Todo"
        })
    }
})

todoRouter.put("/edit/:id", userMiddleware, async (req, res) => {
    const todoSchema = z.object({
        title: z.string().optional(),
        dueDate: z.string().date().optional(),
        status: z.string().optional(),
    })
    const parsedTodo = todoSchema.safeParse(req.body);
    if(!parsedTodo.success) {
        return res.status(422).send("Invalid Format")
    }
    try {
        const update = await TodoModel.findOneAndUpdate(
            { _id: req.params.id, assignedTo: req.userId },
            {"$set": parsedTodo.data}
        )
        if (!update) {
            return res.status(404).send("Todo Not Found");
        }
        res.status(200).json({
            msg: "Updated Todo Successfully",
            update
        })
    }
    catch(e) {
        console.log(e);
        res.json({
            msg: "Error Updating Todo"
        })
    }
})

todoRouter.delete("/:id", userMiddleware, async (req, res) => {
    try {
        const result = await TodoModel.deleteOne(
            {_id: req.params.id, assignedTo: req.userId}
        )
        if (result.deletedCount == 0) {
            return res.status(404).send("Todo Not Found");
        }
        res.status(201).json({msg: "Todo Deleted Successfully"});

    }
    catch(e) {
        console.log(e);
        res.json({
            msg: "Error Deleting Todo"
        })
    }
})

todoRouter.get("/", userMiddleware, async (req, res)=> {
    try{
        const todos = await TodoModel.find({ assignedTo: req.userId }, {});
        if (todos && todos.length > 0) {
            return res.status(200).json({
                todos
            })
        }
        else{
            return res.status(204).json({
                msg: "No Todos to Display"
            });
        }
    }
    catch(e) {
        console.log(e);
        res.json({
            msg: "Error Retrieving Todos"
        })
    }
})


todoRouter.get("/:id", userMiddleware, async (req, res)=> {
    try{
        const todos = await TodoModel.find({ _id: req.params.id, assignedTo: req.userId }, {});
        if (todos && todos.length > 0) {
            return res.status(200).json({
                todos
            })
        }
        else{
            return res.status(404).send("Todo Not Found");
        }
    }
    catch(e) {
        console.log(e);
        res.json({
            msg: "Error Retrieving Todos"
        })
    }
})


module.exports = {
    todoRouter
}