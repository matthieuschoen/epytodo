require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const router = express.Router();

router.post('/register', (req, res) => {
    const {email, name, firstname, password} = req.body;

    if (!email || !name || !firstname || !password) {
        return res.status(400).json({message: 'Bad parameter'});
    }

    db.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error checking email:', err);
            return res.status(500).json({message: 'Internal server error'});
        }

        if (results.length > 0) {

            return res.status(401).json({msg: 'Account already exists'});
        }

        const HashedPassword = bcrypt.hashSync(password, 10);

        const query = 'INSERT INTO user (email, password, name, firstname) VALUES (?, ?, ?, ?)';

        db.query(query, [email, HashedPassword, name, firstname], (err, results) => {
            if (err) {
                console.error('Error inserting user:', err);
                return res.status(500).json({msg: 'Internal server error'});

            }
            
            const token = jwt.sign({ id: results.insertId, email }, process.env.SECRET, {
                expiresIn: '1h',
            });
            return res.status(201).json({ token });
        });
    });
});

router.post('/login', (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({message: 'Bad parameter'});
    }

    db.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error checking email:', err);
            return res.status(500).json({msg: 'Internal server error'});
        }

        if (results.length === 0) {
            return res.status(401).json({msg: 'Invalid Credentials'});
        }

        const user = results[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({msg: 'Invalid Credentials'});
        }

        const token = jwt.sign({ id: user.id, email }, process.env.SECRET, {
            expiresIn: '1h',
        });
        return res.status(200).json({ token });
    });
});

module.exports = router;