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


exports.login = async (request, h) => {
    const { email, password } = request.payload;

    // Validasi input
    if (!email || !password) {
        return h.response({ error: 'Email and password are required' }).code(400);
    }

    try {
        // Cari pengguna berdasarkan email
        const user = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
                if (error) return reject(error);
                resolve(results[0]);
            });
        });

        // Jika user tidak ditemukan
        if (!user) {
            return h.response({ error: 'Invalid email or password' }).code(401);
        }

        // Cek password yang diinput dengan password yang di-hash
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return h.response({ error: 'Invalid email or password' }).code(401);
        }

        // Jika login berhasil, bisa kirimkan data pengguna atau token (jika menggunakan autentikasi berbasis token)
        return h.response({ message: 'Login successful', user: { email: user.email } }).code(200);
    } catch (error) {
        console.error(error);
        return h.response({ error: 'Server error' }).code(500);
    }
};