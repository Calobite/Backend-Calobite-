const { register, login } = require('./handler');
//getExercise, getAllExercise, getDetailUser, addCalories, getDailyCalories, submission, StartMission, FinishMission

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
     /*
    {
        method: 'POST',
        path: '/requestpass',
        handler: requestPasswordReset
    },
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