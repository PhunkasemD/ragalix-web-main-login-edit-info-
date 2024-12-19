require('dotenv').config();
const express = require('express');
const app = express()
const ejs = require('ejs')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./controllers/authController');
const { requireAuth } = require('./middleware/authMiddleware');
const session = require('express-session');
const flash = require('connect-flash')
const path = require('path');
const dotenv = require('dotenv').config();

//MongoDB Connect
mongoose.connect('mongodb+srv://admin:1234@cluster0.kiero.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    
})

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } // ใช้ `secure: true` เมื่อรันใน HTTPS
}));

// ตั้งค่าการใช้ EJS และตำแหน่งโฟลเดอร์ views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files (สำหรับ frontend_part)
app.use(express.static(path.join(__dirname, '../frontend_part')));

// ให้บริการไฟล์ Static
app.use('/frontend_part', express.static(path.join(__dirname, '../frontend_part')));

// ทดสอบ Static File
app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend_part/index.html'));
});


// Routes
app.get('/register', (req, res) => {
    res.render('register'); // render ไฟล์ register.ejs
});

app.get('/login', (req, res) => {
    res.render('login'); // render ไฟล์ login.ejs
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error(err));

console.log('MONGO_URI:', process.env.MONGO_URI);


// Routes
app.use(authRoutes);

// เริ่มต้นเซิร์ฟเวอร์
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
