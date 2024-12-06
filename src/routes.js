const Joi = require('@hapi/joi');
const { register, login, getUserEmail, getFoods, getFoodDetail, getIngredients, getIngredientById, 
        getIngredientByName, addIngredient, updateIngredient, deleteIngredient} = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/register',
        handler: register
    },
    {
        method: 'POST',
        path: '/login',
        handler: login
    }, 
    {
        method: 'GET',
        path: '/user/{userId}',
        handler: getUserEmail
    },
    {
        method: 'GET',
        path: '/food',
        handler: getFoods
        
    },
    {
        method: 'GET',
        path: '/food/{id}',
        handler: getFoodDetail
    },
    {
        method: 'GET',
        path: '/ingredients',
        handler: getIngredients
    },
    {
        method: 'GET',
        path: '/ingredients/id/{id}',
        handler: getIngredientById,
        options: {
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required(),
                }),
            },
        },
    },
    {
        method: 'GET',
        path: '/ingredients/name/{name}',
        handler: getIngredientByName,
        options: {
            validate: {
                params: Joi.object({
                    name: Joi.string().required(),
                }),
            },
        },
    },
    {
        method: 'POST',
        path: '/ingredients',
        handler: addIngredient
    },
    {
        method: 'PUT',
        path: '/ingredients/{id}',
        handler: updateIngredient
    },
    {
        method: 'DELETE',
        path: '/ingredients/{id}',
        handler: deleteIngredient
    }
];

module.exports = routes;
