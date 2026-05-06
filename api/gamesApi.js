// api/gamesApi.js
const { BaseApi } = require('./baseApi.js');

class GamesApi extends BaseApi {
  async getGames(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.get(`/api/games?${query}`);
  }

  async getGameCategories() {
    return this.get('/api/games/categories');
  }

  async getGameById(gameId) {
    return this.get(`/api/games/${gameId}`);
  }

  async launchGame(gameId, params = {}) {
    return this.post(`/api/games/${gameId}/launch`, params);
  }

  async getGameHistory(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.get(`/api/games/history?${query}`);
  }

  async getFavorites() {
    return this.get('/api/games/favorites');
  }

  async addToFavorites(gameId) {
    return this.post(`/api/games/${gameId}/favorite`);
  }

  async removeFromFavorites(gameId) {
    return this.delete(`/api/games/${gameId}/favorite`);
  }

  async searchGames(query) {
    return this.get(`/api/games/search?q=${encodeURIComponent(query)}`);
  }
}

module.exports = { GamesApi };