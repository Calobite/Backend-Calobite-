const { register, login, getUserEmail, getFoods, getFoodDetail, getIngredients, getIngredientById, addIngredient, updateIngredient, deleteIngredient} = require('./handler');

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
        path: '/ingredients/{id}',
        handler: getIngredientById
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