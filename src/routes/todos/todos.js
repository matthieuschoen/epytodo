require('dotenv').config();
const express = require('express');
const routes_todos = express.Router();
const commands_todos = require('./todos.query.js');
const db = require('../../config/db');

routes_todos.post('/todos', (req, res) => {
    let {title, description, due_time, user_id, status} = req.body;

    if (!title || !description || !due_time || !user_id) {
        return res.status(400).json({msg: 'Bad parameter'});
    }
    status = status || 'not started';

    const query = commands_todos.InsertIntoTable;
    db.query(query, [title, description, due_time, user_id, status], (err, results) => {
        if (err) {
            console.error('Error inserting todo:', err);
            return res.status(500).json({msg: 'Internal server error'});
        }

        return res.status(201).json({
                id: results.insertId,
                title: title,
                description: description,
                created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
                due_time: due_time,
                user_id: user_id,
                status: status
        });
    });
});

routes_todos.get('/todos/:id', (req, res) => {
    const {id} = req.params;

    if (!id) {
        return res.status(400).json({msg: 'Bad parameter'});
    }

    const query = commands_todos.SelectFromId;
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching todo:', err);
            return res.status(500).json({msg: 'Internal server error'});
        }

        if (results.length === 0) {
            return res.status(404).json({msg: 'Not found'});
        }

        const todo = results[0];
        todo.due_time = todo.due_time.toISOString().slice(0, 19).replace('T', ' ');
        todo.created_at = todo.created_at.toISOString().slice(0, 19).replace('T', ' ');
        return res.status(200).json({
            id: todo.id,
            title: todo.title,
            description: todo.description,
            created_at: todo.created_at,
            due_time: todo.due_time,
            user_id: todo.user_id,
            status: todo.status,
        });
    });
});

routes_todos.get('/todos', (req, res) => {
    db.query(commands_todos.SelectFromTodo, (err, results) => {
        if (err) {
            return res.status(500).json({msg: `Internal server error`});
        }

        if (results.length === 0) {
            return res.status(404).json({msg: `Not found`});
        }

        results.forEach(todo => {
            todo.due_time = todo.due_time.toISOString().slice(0, 19).replace('T', ' ');
            todo.created_at = todo.created_at.toISOString().slice(0, 19).replace('T', ' ');
        });
        return res.status(200).json(results);
    });
});

routes_todos.put('/todos/:id', (req, res) => {
    const id = req.params.id;
    const {title, description, due_time, user_id, status} = req.body;

    if (!id || isNaN(id)) {
        return res.status(400).json({ msg: 'Bad parameter' });
    }
    if (!title || !description || !due_time || !user_id) {
        return res.status(400).json({ msg: 'Bad parameter' });
    }

    const values = [title, description, due_time, user_id, status, id];

    db.query(commands_todos.UpdateFromId, values, (err, result) => {
        if (err) {
            return res.status(500).json({ msg: 'Internal server error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Not found' });
        }

        db.query(commands_todos.SelectFromId, [id], (err, results) => {
            if (err) {
                return res.status(500).json({ msg: 'Internal server error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ msg: 'Not found' });
            }

            const todo = results[0];
            todo.due_time = todo.due_time.toISOString().slice(0, 19).replace('T', ' ');
            todo.created_at = todo.created_at.toISOString().slice(0, 19).replace('T', ' ');
            return res.status(200).json({
                id: todo.id,
                title: todo.title,
                description: todo.description,
                created_at: todo.created_at,
                due_time: todo.due_time,
                user_id: todo.user_id,
                status: todo.status,
            });
        });
    });
});


routes_todos.delete('/todos/:id', (req, res) => {
    const id = req.params.id;

    if (!id || isNaN(id)) {
        return res.status(400).json({msg: `Bad parameter`});
    }

    db.query(commands_todos.DeleteFromTodoId, [id], (err, results) => {
        if (err) {
            return res.status(500).json({msg: `Internal server error`});
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({msg: `Not found`});
        }

        return res.status(200).json({msg: `Successfully deleted record number: ${id}`});
    });
});

module.exports = routes_todos;