const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        console.log('No token found');
        return res.redirect('/login'); // ไม่มี token ให้ redirect ไปที่ /login
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your_secure_secret');
        console.log('Decoded Token:', decodedToken);
        req.userId = decodedToken.id; // เพิ่ม userId ลงใน Request
        next();
    } catch (err) {
        console.log('Invalid Token:', err.message);
        res.redirect('/login'); // หาก token ไม่ถูกต้อง
    }
};


const checkUser = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        res.locals.user = null; // ไม่มี token ให้ตั้ง user เป็น null
        return next();
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your_secure_secret');
        console.log('Decoded Token:', decodedToken);

        const user = await User.findById(decodedToken.id); // ค้นหาผู้ใช้จาก token
        res.locals.user = user || null; // หากไม่เจอผู้ใช้ ให้ตั้งเป็น null
    } catch (err) {
        console.log('Invalid token:', err.message);
        res.locals.user = null; // หาก token ไม่ถูกต้อง
    }

    next();
};



module.exports = { requireAuth, checkUser };
