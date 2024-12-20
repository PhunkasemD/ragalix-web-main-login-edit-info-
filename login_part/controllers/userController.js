// userController.js (Controller for User CRUD operations)
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const { checkUser } = require('../middleware/authMiddleware');
const { requireAuth } = require('../middleware/authMiddleware');


// Render user page
router.get('/view/:id', requireAuth, async (req, res) => {
    const userId = req.cookies.userId; // ดึง userId จาก Cookie
    if (!userId) {
        console.error('User ID not found in session');
        return res.redirect('/login');
    }

    try {
        const user = res.locals.user; // ใช้ข้อมูลผู้ใช้ที่ Middleware อัปเดตแล้ว
        if (!user) return res.redirect('/login'); // หากไม่มีข้อมูล ให้ Redirect ไปหน้า Login
        res.render('user', { user });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Server error');
    }
});

// Render edit page
router.get('/edit/:id', checkUser, async (req, res) => {
    const userId = req.cookies.userId; // ดึง userId จาก Cookie
    if (!userId) {
        console.error('User ID not found in session');
        return res.redirect('/login');
    }

    try {
        const user = res.locals.user; // ใช้ข้อมูลผู้ใช้จาก Middleware
        if (!user) return res.redirect('/login');
        res.render('edit', { user });
    } catch (error) {
        console.error('Error fetching user for edit:', error);
        res.status(500).send('Server error');
    }
});

// Update user information
router.post('/edit/:id', requireAuth, async (req, res) => {
    const token = req.cookies.jwt; // ดึง Token จาก Cookie
    if (!token) {
        console.error('No token found in cookies');
        return res.redirect('/login'); // หากไม่มี Token ให้ไปหน้า Login
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your_secure_secret'); // ถอดรหัส Token
    } catch (err) {
        console.error('Invalid Token:', err.message);
        return res.redirect('/login'); // หาก Token ไม่ถูกต้อง ให้ไปหน้า Login
    }

    console.log('ID from token:', decodedToken.id); // แสดง ID ที่ได้จาก Token
    console.log('ID from params:', req.params.id); // แสดง ID ที่ได้จาก URL

    if (decodedToken.id !== req.params.id) {
        console.error('User ID mismatch');
        return res.redirect('/login'); // หาก ID ไม่ตรงกัน ให้ผู้ใช้ไปหน้า Login
    }

    const { fullName, email, phone } = req.body;

    // ตรวจสอบว่า Input ครบถ้วน
    if (!fullName || !email || !phone) {
        console.error('All fields are required');
        return res.status(400).send('All fields are required');
    }

    try {
        const user = await User.findByIdAndUpdate(
            req.params.id, // ใช้ ID ที่ได้จาก URL
            { fullName, email, phone },
            { new: true } // Return ข้อมูลใหม่หลังอัปเดต
        );

        if (!user) {
            console.error('User not found with ID:', req.params.id);
            return res.status(404).send('User not found');
        }

        console.log('User updated successfully:', user);
        res.redirect(`/user/view/${user._id}`); // Redirect ไปหน้า My Account
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).send('Server error');
    }
    
});


module.exports = router;
