const express = require('express');
const authRoutes = require('./routes/auth.routes');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

//middlewares
app.use(express.json());

//routes
app.use('/api/auth', authRoutes);

module.exports = app;
