require('dotenv').config();
const db = require('./config/db');
const authRoutes = require('./routes/auth/auth');
const userRouter = require('./routes/user/user');
const todosRoutes = require('./routes/todos/todos');

const express = require('express');
const app = express();

app.use(express.json());
app.use(authRoutes);
app.use(userRouter);
app.use(todosRoutes);

app.get('/test', (req, res) => {
    console.log('Request received');
    res.send('Hello World!\n');
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});