// BUILD YOUR SERVER HERE

// IMPORTS AT THE TOP
const express = require("express")
const Users = require("./users/model")

// INSTANCE OF EXPRESS APP
const server = express()

// GLOBAL MIDDLEWARE
server.use(express.json())

// ENDPOINTS


// [GET] /api/users/:id (R of CRUD, fetch user by :id)
server.get("/api/users/:id", (req, res) => {
    const idVar = req.params.id
    Users.findById(idVar)
        .then(user => {
            if (!user) {
                res.status(404).json("User doesn't exist")
            } else {
                res.json(user)
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
})

// [GET] /api/users (R of CRUD, fetch all users)
server.get("/api/users", (req, res) => {
    Users.find()
        .then(users => {
            console.log(users)
            res.status(200).json(users)
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
})

// [POST] /api/users (C of CRUD, create new user from JSON payload)
server.post("/api/users", (req, res) => {
    const newUser = req.body
    if (!newUser.name || !newUser.bio) {
        res.status(422).json("Need name and bio")
    } else {
        Users.insert(newUser)
            .then(user => {
                res.status(201).json(user)
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
})
// [PUT] /api/users/:id (U of CRUD, update user with :id using JSON payload)
server.put("/api/users/:id", async (req, res) => {
    const { id } = req.params
    const changes = req.body
    try {
        if (!changes.name || !changes.bio) {
            res.status(422).json({ message: "need name and bio" })
        } else {
            const updatedUser = await Users.update(id, changes)
            if (!updatedUser) {
                res.status(404).json("User doesn't exist")
            } else {
                res.status(200).json(updatedUser)
            }
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})
// [DELETE] /api/users/:id (D of CRUD, remove user with :id)
server.delete("/api/users/:id", async (req, res) => {
    try {
        //throw "crappy crap!"
        const { id } = req.params
        const deletedUser = await Users.delete(id)
        if (!deletedUser) {
            res.status(404).json("User not found")
        } else {
            res.status(200).json(deletedUser)
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})
// [GET] / (Catch all if resource not found)
server.use("*", (req, res) => {
    res.status(404).json({ message: "404 Not Found!!!" })
})


module.exports = server // EXPORT YOUR SERVER instead of {}



