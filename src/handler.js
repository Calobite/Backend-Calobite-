const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./dbhandler');

const SECRET_KEY = 'ec4270c9bd48b26abb4bcfb26b8f12c697a15053e7d5950bc7eb28728dec35az';

exports.register = async (request, h) => {
    const { email, password } = request.payload;

    if (!email || !password) {
        return h.response({ error: 'Email and password are required' }).code(400);
    }

    try {
        const userExists = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
                if (error) return reject(error);
                resolve(results.length > 0);
            });
        });

        if (userExists) {
            return h.response({ error: 'Email already registered' }).code(400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

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

        // Buat JWT token untuk user yang baru terdaftar
        const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });

        return h.response({ 
            message: 'User registered successfully',
            token
        }).code(201);
    } catch (error) {
        console.error(error);
        return h.response({ error: 'Server error' }).code(500);
    }
};

exports.login = async (request, h) => {
    const { email, password } = request.payload;

    if (!email || !password) {
        return h.response({ error: 'Email and password are required' }).code(400);
    }

    try {
        const user = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
                if (error) return reject(error);
                resolve(results[0]);
            });
        });

        if (!user) {
            return h.response({ error: 'Invalid email or password' }).code(401);
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return h.response({ error: 'Invalid email or password' }).code(401);
        }

        // Buat JWT token untuk user yang berhasil login
        const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });

        return h.response({ 
            message: 'Login successful',
            token 
        }).code(200);
    } catch (error) {
        console.error(error);
        return h.response({ error: 'Server error' }).code(500);
    }
};

exports.getUserEmail = async (request, h) => {
    const { userId } = request.params;

    try {
        const user = await new Promise((resolve, reject) => {
            db.query('SELECT email FROM users WHERE user_id = ?', [userId], (error, results) => {
                if (error) return reject(error);
                resolve(results[0]);
            });
        });
        if (!user) {
            return h.response({ error: 'User not found' }).code(404);
        }

        return h.response({ email: user.email }).code(200);
    } catch (error) {
        console.error(error);
        return h.response({ error: 'Server error' }).code(500);
    }
};

exports.getFoods = async (request, h) => {
    const { category, maxPrice } = request.query;

    try {
        let sql = 'SELECT * FROM recipes WHERE 1=1';
        const params = [];

        if (category) {
            sql += ' AND category = ?';
            params.push(category);
        }

        if (maxPrice) {
            sql += ' AND price <= ?';
            params.push(parseInt(maxPrice));
        }

        const foods = await new Promise((resolve, reject) => {
            db.query(sql, params, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });

        return h.response(foods).code(200);
    } catch (error) {
        console.error(error);
        return h.response({ error: 'Server error' }).code(500);
    }
};

exports.getFoodDetail = async (request, h) => {
    const { id } = request.params;

    try {
        const food = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM recipes WHERE recipes_id = ?', [id], (error, results) => {
                if (error) return reject(error);
                resolve(results[0]);
            });
        });

        if (!food) {
            return h.response({ error: 'Food not found' }).code(404);
        }

        return h.response(food).code(200);
    } catch (error) {
        console.error(error);
        return h.response({ error: 'Server error' }).code(500);
    }
};

exports.getIngredients = async (request, h) => {
    const { name } = request.query; // Ambil query parameter `name` jika ada
    try {
        const ingredients = await new Promise((resolve, reject) => {
            // Jika query parameter `name` ada, gunakan SQL dengan kondisi LIKE
            const query = name 
                ? 'SELECT * FROM food_calories WHERE Food LIKE ?' 
                : 'SELECT * FROM food_calories';

            const params = name ? [`%${name}%`] : []; // Parameter untuk query

            db.query(query, params, (error, results) => {
                if (error) {
                    console.error("SQL Error:", error);
                    return reject(error);
                }
                resolve(results);
            });
        });

        if (name && ingredients.length === 0) {
            // Jika pencarian dengan `name` tidak menghasilkan apapun
            return h.response({ error: 'Ingredient not found' }).code(404);
        }

        return h.response(ingredients).code(200); // Kembalikan hasil
    } catch (error) {
        console.error("Error in getIngredients:", error);
        return h.response({ error: 'Server error' }).code(500);
    }
};

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
