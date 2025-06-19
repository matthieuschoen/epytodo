const express = require("express");
const routes_user = express.Router();
const commands_user = require("./user.query");
const db = require("../../config/db");
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");

routes_user.get("/user", auth, (req, res) => {
    const id = req.user.id;

    db.query(commands_user.GetFromUserId, [id], (err, results) => {
        if (err) {
            return res.status(500).json({msg: "Internal server error"});
        }

        if (results.length === 0) {
            return res.status(404).json({msg: "Not found"});
        }

        const user = results[0];
        user.created_at = user.created_at.toISOString().slice(0, 19).replace('T', ' ');
        return res.status(200).json({
            id: user.id,
            email: user.email,
            password: user.password,
            created_at: user.created_at,
            firstname: user.firstname,
            name: user.name
        });
    });
});

routes_user.get("/user/todos", auth, (req, res) => {
    const id = req.user.id;

    db.query(commands_user.GetFromTodosByUserId, [id], (err, results) => {
        if (err) {
            return res.status(500).json({msg: "Internal server error"});
        }

        if (results.length === 0) {
            return res.status(404).json({msg: "Not found"});
        }

        results.forEach(todo => {
            todo.due_time = todo.due_time.toISOString().slice(0, 19).replace('T', ' ');
            todo.created_at = todo.created_at.toISOString().slice(0, 19).replace('T', ' ');
        });
        return res.status(200).json(results);
    });
});

routes_user.get("/users/:info", auth, (req, res) => {
    const info = req.params.info;

    if (!info) {
        return res.status(400).json({msg: "Bad parameter"});
    }

    if (!isNaN(info)) {
        db.query(commands_user.GetFromUserId, [info], (err, results) => {
            if (err) {
                return res.status(500).json({ msg: "Internal server error" });
            }
    
            if (results.length === 0) {
                return res.status(404).json({ msg: "Not found" });
            }
    
            const user = results[0];
            user.created_at = user.created_at.toISOString().slice(0, 19).replace('T', ' ');
            return res.status(200).json({
                id: user.id,
                email: user.email,
                password: user.password,
                created_at: user.created_at,
                firstname: user.firstname,
                name: user.name
            });
        });
    } else {
        db.query(commands_user.GetFromUserEmail, [info], (err, results) => {
            if (err) {
                return res.status(500).json({ msg: "Internal server error" });
            }
    
            if (results.length === 0) {
                return res.status(404).json({ msg: "Not found" });
            }
    
            const user = results[0];
            user.created_at = user.created_at.toISOString().slice(0, 19).replace('T', ' ');
            return res.status(200).json({
                id: user.id,
                email: user.email,
                password: user.password,
                created_at: user.created_at,
                firstname: user.firstname,
                name: user.name
            });
        });
    }
});

routes_user.put("/users/:id", auth, (req, res) => {
    const id = req.params.id;
    const {email, password, name, firstname} = req.body;
    const updates = [];
    const values = [];

    if (!id || isNaN(id) || !email && !password && !name && !firstname) {
        return res.status(400).json({msg: "Bad parameter"});
    }

    if (email) {
        updates.push("email = ?");
        values.push(email);
    }

    if (password) {
        const hash_password = bcrypt.hashSync(password, 10);
        updates.push("password = ?");
        values.push(hash_password);
    }

    if (name) {
        updates.push("name = ?");
        values.push(name);
    }

    if (firstname) {
        updates.push("firstname = ?");
        values.push(firstname);
    }

    const query = commands_user.UpdateUserById(updates.join(","));
    values.push(id);

    db.query(query, values, (err, results) => {
        if (err) {
            return res.status(500).json({msg: "Internal server error"});
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({msg: "Not found"});
        }

        db.query(commands_user.GetFromUserId, [id], (err, user_results) => {
            if (err) {
                return res.status(500).json({msg: "Internal server error"});
            }

            if (user_results.length === 0) {
                return res.status(404).json({msg: "Not found"});
            }

            const user = user_results[0];
            user.created_at = user.created_at.toISOString().slice(0, 19).replace('T', ' ');
            return res.status(200).json({
                id: user.id,
                email: user.email,
                password: user.password,
                created_at: user.created_at,
                firstname: user.firstname,
                name: user.name
            });
        });
     });
});

routes_user.delete("/users/:id", auth, (req, res) => {
    const id = req.params.id;

    if (!id || isNaN(id)) {
        return res.status(400).json({msg: `Bad parameter`});
    }

    db.query(commands_user.DeleteTodoFromUserId, [id], (err) => {
        if (err) {
            return res.status(500).json({msg: `Internal server error`});
        }

        db.query(commands_user.DeleteFromUserId, [id], (err, results) => {
            if (err) {
                return res.status(500).json({msg: `Internal server error`});
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({msg: `Not found`});
            }
            return res.status(200).json({msg: `Successfully deleted record number: ${id}`});
        });
    });
});

module.exports = routes_user;