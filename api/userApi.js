// api/userApi.js
const { BaseApi } = require('./baseApi.js');

class UserApi extends BaseApi {
  async getProfile() {
    return this.get('/api/user/profile');
  }

  async updateProfile(profileData) {
    return this.put('/api/user/profile', profileData);
  }

  async getBalance() {
    return this.get('/api/user/balance');
  }

  async getSettings() {
    return this.get('/api/user/settings');
  }

  async updateSettings(settings) {
    return this.put('/api/user/settings', settings);
  }

  async changePassword(passwordData) {
    return this.put('/api/user/change-password', passwordData);
  }

  async getTransactionHistory(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.get(`/api/user/transactions?${query}`);
  }

  async getBonuses() {
    return this.get('/api/user/bonuses');
  }

  async claimBonus(bonusId) {
    return this.post(`/api/user/bonuses/${bonusId}/claim`);
  }
}

module.exports = { UserApi };