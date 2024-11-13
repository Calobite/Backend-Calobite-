// handler.js
const bcrypt = require('bcryptjs');
const db = require('./dbhandler');

exports.register = async (request, h) => {
    const { email, password } = request.payload;

    // Validasi data input
    if (!email || !password) {
        return h.response({ error: 'Email and password are required' }).code(400);
    }

    try {
        // Cek apakah email sudah terdaftar
        const userExists = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
                if (error) return reject(error);
                resolve(results.length > 0);
            });
        });

        if (userExists) {
            return h.response({ error: 'Email already registered' }).code(400);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user ke database
        await new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO users (email, password) VALUES (?, ?)',
                [email, hashedPassword],
                (error) => {
                    if (error) return reject(error);
                    resolve();
                }
            );
        });

        return h.response({ message: 'User registered successfully' }).code(201);
    } catch (error) {
        console.error(error);
        return h.response({ error: 'Server error' }).code(500);
    }
};