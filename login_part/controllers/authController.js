const User = require('../models/User');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Token functions
const maxAge = 3 * 24 * 60 * 60; // 3 days
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: maxAge });
};

// Routes
router.get('/login', (req, res) => {
    res.render('login', { errorMessage: null }); // กำหนดค่าเริ่มต้นเป็น null
});

router.get('/register', (req, res) => {
    res.render('register', { errorMessage: null }); // กำหนดค่าเริ่มต้นเป็น null
});


router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Plaintext password (register):', password); // Log plaintext password

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('register', { errorMessage: 'Email already exists' });
        }

        // Create user without hashing password (pre('save') จะจัดการให้)
        const user = await User.create({ email, password });
        console.log('User registered:', user); // Log

        res.redirect('/login');

    } catch (err) {
        console.error('Error during registration:', err);
        res.render('register', { errorMessage: err.message || 'An error occurred during registration' });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Plaintext email (login):', email); // Log email from input
        console.log('Plaintext password (login):', password); // Log plaintext password

        // ค้นหาอีเมลใน MongoDB
        const user = await User.findOne({ email });
        if (!user) {
            cconsole.log('Email not found in database:', email); // Log email not found
            // หากไม่พบอีเมล แสดงข้อความข้อผิดพลาด
            return res.render('login', { errorMessage: 'Invalid email or password' });
        }

        console.log('Hashed password from database:', user.password); // Log hashed password from database

        // ตรวจสอบรหัสผ่าน
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password match:', isPasswordValid); // เพิ่ม log

        if (!isPasswordValid) {
            console.log('Password mismatch');
            // หากรหัสผ่านไม่ถูกต้อง
            return res.render('login', { errorMessage: 'Invalid email or password' });
        }

        // หากเข้าสู่ระบบสำเร็จ
        // สร้าง JWT Token
        const token = createToken(user._id); // สร้าง JWT Token
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

        
        // Redirect ไปยังหน้าหลัก index.html
        res.redirect('/');

    } catch (err) {
        // กรณีมีข้อผิดพลาดอื่น ๆ
        console.error('Error during login:', err);
        res.render('login', { errorMessage: 'An error occurred during login' });
    }
});


router.get('/logout', (req, res) => {
    const token = req.cookies.jwt;

    if (!token) {
        console.log('No token found, redirecting to login');
        return res.redirect('/login');
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET || 'your_secure_secret');
        console.log('Token valid, logging out');
    } catch (err) {
        console.log('Invalid token during logout:', err.message);
    }

    res.cookie('jwt', '', { maxAge: 1 }); // ลบ Cookie
    res.redirect('/login'); // redirect ไปหน้า login
});




// Export the router
module.exports = router;
