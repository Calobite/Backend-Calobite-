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

exports.getUserEmail = async (request, h) => {
    const { userId } = request.params;  // Ambil userId dari parameter URL

    try {
        // Query untuk mengambil email berdasarkan userId
        const user = await new Promise((resolve, reject) => {
            db.query('SELECT email FROM users WHERE user_id = ?', [userId], (error, results) => {
                if (error) return reject(error);
                resolve(results[0]);
            });
        });
        // Cek apakah user ditemukan
        if (!user) {
            return h.response({ error: 'User not found' }).code(404);
        }

        // Kembalikan email user
        return h.response({ email: user.email }).code(200);
    } catch (error) {
        console.error(error);
        return h.response({ error: 'Server error' }).code(500);
    }
};

exports.getFoods = async (request, h) => {
    const { category, maxPrice } = request.query;  // Ambil query parameter untuk filter

    try {
        // Query dasar
        let sql = 'SELECT * FROM recipes_1 WHERE 1=1';
        const params = [];

        // Tambahkan filter kategori jika tersedia
        if (category) {
            sql += ' AND category = ?';
            params.push(category);
        }

        // Tambahkan filter harga maksimum jika tersedia
        if (maxPrice) {
            sql += ' AND price <= ?';
            params.push(parseInt(maxPrice));
        }

        // Eksekusi query
        const foods = await new Promise((resolve, reject) => {
            db.query(sql, params, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });

        // Kembalikan hasil
        return h.response(foods).code(200);
    } catch (error) {
        console.error(error);
        return h.response({ error: 'Server error' }).code(500);
    }
};

exports.getFoodDetail = async (request, h) => {
    const { id } = request.params;  // Ambil id dari parameter URL

    try {
        // Query untuk mencari makanan berdasarkan id
        const food = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM recipes_1 WHERE recipes_id = ?', [id], (error, results) => {
                if (error) return reject(error);
                resolve(results[0]);
            });
        });

        // Jika makanan tidak ditemukan
        if (!food) {
            return h.response({ error: 'Food not found' }).code(404);
        }

        // Kembalikan detail makanan
        return h.response(food).code(200);
    } catch (error) {
        console.error(error);
        return h.response({ error: 'Server error' }).code(500);
    }
};

// Handler untuk mendapatkan semua ingredients
exports.getIngredients = async (request, h) => {
    try {
        const ingredients = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM food_calories', (error, results) => {
                if (error) {
                    console.error("SQL Error:", error);
                    return reject(error);
                }
                resolve(results);
            });
        });
        return h.response(ingredients).code(200);
    } catch (error) {
        console.error("Error in getIngredients:", error);
        return h.response({ error: 'Server error' }).code(500);
    }
};

// Handler untuk mendapatkan detail ingredient berdasarkan ID
exports.getIngredientById = async (request, h) => {
    const { id } = request.params;
    try {
        const ingredient = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM ingredients WHERE ingredient_id = ?', [id], (error, results) => {
                if (error) {
                    console.error("SQL Error:", error);
                    return reject(error);
                }
                resolve(results[0]);
            });
        });

        if (!ingredient) {
            return h.response({ error: 'Ingredient not found' }).code(404);
        }

        return h.response(ingredient).code(200);
    } catch (error) {
        console.error("Error in getIngredientById:", error);
        return h.response({ error: 'Server error' }).code(500);
    }
};

// Handler untuk menambahkan ingredient baru
exports.addIngredient = async (request, h) => {
    const { name, quantity } = request.payload;

    if (!name || !quantity) {
        return h.response({ error: 'Name and quantity are required' }).code(400);
    }

    try {
        await new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO ingredients (name, quantity) VALUES (?, ?)',
                [name, quantity],
                (error) => {
                    if (error) {
                        console.error("SQL Error:", error);
                        return reject(error);
                    }
                    resolve();
                }
            );
        });

        return h.response({ message: 'Ingredient added successfully' }).code(201);
    } catch (error) {
        console.error("Error in addIngredient:", error);
        return h.response({ error: 'Server error' }).code(500);
    }
};

// Handler untuk memperbarui ingredient berdasarkan ID
exports.updateIngredient = async (request, h) => {
    const { id } = request.params;
    const { name, quantity } = request.payload;

    if (!name || !quantity) {
        return h.response({ error: 'Name and quantity are required' }).code(400);
    }

    try {
        const result = await new Promise((resolve, reject) => {
            db.query(
                'UPDATE ingredients SET name = ?, quantity = ? WHERE id = ?',
                [name, quantity, id],
                (error, results) => {
                    if (error) {
                        console.error("SQL Error:", error);
                        return reject(error);
                    }
                    resolve(results);
                }
            );
        });

        if (result.affectedRows === 0) {
            return h.response({ error: 'Ingredient not found' }).code(404);
        }

        return h.response({ message: 'Ingredient updated successfully' }).code(200);
    } catch (error) {
        console.error("Error in updateIngredient:", error);
        return h.response({ error: 'Server error' }).code(500);
    }
};

// Handler untuk menghapus ingredient berdasarkan ID
exports.deleteIngredient = async (request, h) => {
    const { id } = request.params;

    try {
        const result = await new Promise((resolve, reject) => {
            db.query('DELETE FROM ingredients WHERE id = ?', [id], (error, results) => {
                if (error) {
                    console.error("SQL Error:", error);
                    return reject(error);
                }
                resolve(results);
            });
        });

        if (result.affectedRows === 0) {
            return h.response({ error: 'Ingredient not found' }).code(404);
        }

        return h.response({ message: 'Ingredient deleted successfully' }).code(200);
    } catch (error) {
        console.error("Error in deleteIngredient:", error);
        return h.response({ error: 'Server error' }).code(500);
    }
};