// api/index.js
//const { BaseApi } = require('./baseApi.js');
//const { AuthApi } = require('./authApi.js');
const { UserApi } = require('./userApi.js');
const { GamesApi } = require('./gamesApi.js');
const { TransactionsApi } = require('./transactionsApi.js');
const { BonusesApi } = require('./bonusesApi.js');

// module.exports = {
//   BaseApi,
//   AuthApi,
//   UserApi,
//   GamesApi,
//   TransactionsApi,
//   BonusesApi
// };

export { AuthApi } from './authApi.js';
export { BaseApi } from './baseApi.js';