const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET || 'your_secure_secret', (err, decodedToken) => {
            if (err) {
                console.log('Invalid Token:', err.message);
                res.redirect('/login');
            } else {
                console.log('Decoded Token:', decodedToken);
                req.userId = decodedToken.id; // เพิ่ม userId ลงใน Request
                next();
            }
        });
    } else {
        console.log('No token found'); // หากไม่มี token
        res.redirect('/login');
    }
};


const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'your_secure_secret', async (err, decodedToken) => {
            if (err) {
                console.log('Invalid token:', err.message);
                res.locals.user = null;
                next();
            } else {
                console.log('Decoded token:', decodedToken);
                const user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};


module.exports = { requireAuth, checkUser };
