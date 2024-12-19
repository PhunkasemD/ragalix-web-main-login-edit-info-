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
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('register', { errorMessage: 'Email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with hashed password
        const user = await User.create({ email, password: hashedPassword });
        res.redirect('/login');
    } catch (err) {
        res.render('register', { errorMessage: err.message || 'An error occurred during registration' });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // ค้นหาอีเมลใน MongoDB
        const user = await User.findOne({ email });
        if (!user) {
            // หากไม่พบอีเมล แสดงข้อความข้อผิดพลาด
            return res.render('login', { errorMessage: 'Invalid email or password' });
        }

        // ตรวจสอบรหัสผ่าน
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            // หากรหัสผ่านไม่ถูกต้อง
            return res.render('login', { errorMessage: 'Invalid email or password' });
        }

        // หากเข้าสู่ระบบสำเร็จ
        req.session.userId = user._id; // กำหนด session
        res.redirect('/frontend_part/index.html'); // เปลี่ยนไปยังหน้า index.html ในโฟลเดอร์ frontend_part

    } catch (err) {
        // กรณีมีข้อผิดพลาดอื่น ๆ
        res.render('login', { errorMessage: 'An error occurred during login' });
    }
});



router.get('/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/login');
});

// Export the router
module.exports = router;
