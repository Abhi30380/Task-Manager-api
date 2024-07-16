const router = require("express").Router();
const Task = require("../models/task");
const User = require("../models/user");
const authenticate = require("./auth");
const History = require('../models/history');
router.post("/createtask", authenticate, async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;
        const { id } = req.headers;
        const newTask = new Task({ title, description, status, priority, dueDate });
        const saveTask = await newTask.save();
        const taskId = saveTask._id;
        await User.findByIdAndUpdate(id, { $push: { tasks: taskId._id } });
        res.status(200).json({ message: "task added successfully", good: 'this one' });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error" });
    }
})
router.get("/getalltask", authenticate, async (req, res) => {
    try {
        const id = req.header('id');
        const userData = await User.findById(id).populate({
            path: "tasks",
            options: { sort: { createdAt: -1 } }
        });
        const tasks = userData.tasks;
        console.log(tasks);
        return res.status(200).json(tasks);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error" });
    }
})

router.get("/gettaskbyid/:id", authenticate, async (req, res) => {
    try {
        console.log("hello");
      const id = req.params.id;
      const task = await Task.findById(id).populate({
        path: 'history',
      });
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      console.log(task);
      return res.status(200).json(task);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Internal server error" });
    }
  })
router.delete("/deletetask/:id", authenticate, async (req, res) => {
    try {
        console.log("let try it out");
        const { id } = req.params;
        await Task.findByIdAndDelete(id);
        const userId = req.header('id');
        await User.findByIdAndUpdate(userId, { $pull: { tasks: id } });
        return res.status(200).json({ message: "task deleted successfully" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error" });
    }
})

router.put("/updatetask/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority, dueDate } = req.body;
        const task = await Task.findById(id);
        const history = new History({
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
        });
        await history.save();
        await Task.findByIdAndUpdate(id, { title, description, status, priority, dueDate });
        await Task.findByIdAndUpdate(id, { $push: { history: history._id } });
        return res.status(200).json({ message: "task updated successfully",good:"well done" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error" });
    }
})  

router.get("/getimportanttask", authenticate, async (req, res) => {
    try {
        const id = req.header('id');
        const data = await User.findById(id).populate({
            path: "tasks",
            match: { priority: "high" },
            options: { sort: { createdAt: -1 } },
        });
        const ImportData = data.tasks;
        return res.status(200).json({ ImportData });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error" });
    }
})
router.get("/getcompeletedtask", authenticate, async (req, res) => {
    try {
        const id = req.header('id');
        const data = await User.findById(id).populate({
            path: "tasks",
            match: { status: "Completed" },
            options: { sort: { createdAt: -1 } },
        });
        const compleData = data.tasks;
        return res.status(200).json({ compleData });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error" });
    }
})
router.get("/getincompeletedtask", authenticate, async (req, res) => {
    try {
        const id = req.header('id');
        const data = await User.findById(id).populate({
            path: "tasks",
            match: { status: "Incomplete" },
            options: { sort: { createdAt: -1 } },
        });
        const incompleData = data.tasks;
        return res.status(200).json({ incompleData });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error" });
    }
})
module.exports = router;