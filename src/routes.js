const { register, login, getUserEmail, getFoods, getFoodDetail, getIngredients, getIngredientById, addIngredient, updateIngredient, deleteIngredient} = require('./handler');
//getAllExercise, getDetailUser, addCalories, getDailyCalories, submission, StartMission, FinishMission

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
    // Route untuk mendapatkan ingredient berdasarkan ID
    {
        method: 'GET',
        path: '/ingredients/{id}',
        handler: getIngredientById
    },
    // Route untuk menambahkan ingredient baru
    {
        method: 'POST',
        path: '/ingredients',
        handler: addIngredient
    },
    // Route untuk memperbarui ingredient berdasarkan ID
    {
        method: 'PUT',
        path: '/ingredients/{id}',
        handler: updateIngredient
    },
    // Route untuk menghapus ingredient berdasarkan ID
    {
        method: 'DELETE',
        path: '/ingredients/{id}',
        handler: deleteIngredient
    }


    /*
    {
        method: 'POST',
        path: '/resetpass',
        handler: resetPassword
    },
    {
        method: 'GET',
        path: '/exercise/{id}',
        handler: getExercise
    },
    {
        method: 'GET',
        path: '/exercises',
        handler: getAllExercise
    },
    {
        method: 'GET',
        path: '/user/{id}',
        handler: getDetailUser
    },
    {
        method: 'POST',
        path: '/calories',
        handler: addCalories
    },
    {
        method: 'GET',
        path: '/calories/{user_id}/{date}',
        handler: getDailyCalories
    },
    {
        method: 'POST',
        path: '/submission',
        handler: submission
    },
    {
        method: 'POST',
        path: '/startmission',
        handler: StartMission
    },
    {
        method: 'POST',
        path: '/finishmission',
        handler: FinishMission
    },
    */
];

module.exports = routes;