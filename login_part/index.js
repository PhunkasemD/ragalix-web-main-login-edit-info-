require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const authRoutes = require('./controllers/authController');
const userRoutes = require('./controllers/userController');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');


const app = express();

// Middleware
app.use(express.json()); // ใช้ express.json() แทน bodyParser.json()
app.use(express.urlencoded({ extended: true })); // ใช้ express.urlencoded()
app.use(cookieParser());
app.use(cookieParser('your_secret_key'));
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // ตั้ง `secure: true` เมื่อใช้ HTTPS
}));
app.use(flash());
app.use('*', checkUser); // ใช้ checkUser กับทุก Route
app.use('/user/edit', requireAuth); // ใช้ requireAuth กับ /user/edit

// ตั้งค่าการใช้ EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files (สำหรับ frontend_part)
app.use(express.static(path.join(__dirname, '../frontend_part')));

// ให้บริการไฟล์ Static
app.use('/frontend_part', express.static(path.join(__dirname, '../frontend_part')));

// Routes
app.use('/user', userRoutes); // กำหนด route "/user" ให้ใช้ userController.js
app.use(authRoutes);

// Pages
app.get('/register', (req, res) => {
    res.render('register'); // render ไฟล์ register.ejs
});

app.get('/login', (req, res) => {
    res.render('login'); // render ไฟล์ login.ejs
});

app.get('/', requireAuth, (req, res) => {
    res.render('index', { user: res.locals.user });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
