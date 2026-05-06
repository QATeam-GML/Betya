// api/bonusesApi.js
const { BaseApi } = require('./baseApi.js');

class BonusesApi extends BaseApi {
  async getAvailableBonuses() {
    return this.get('/api/bonuses');
  }

  async getActiveBonuses() {
    return this.get('/api/bonuses/active');
  }

  async claimBonus(bonusId) {
    return this.post(`/api/bonuses/${bonusId}/claim`);
  }

  async getBonusHistory() {
    return this.get('/api/bonuses/history');
  }

  async getBonusDetails(bonusId) {
    return this.get(`/api/bonuses/${bonusId}`);
  }

  async cancelBonus(bonusId) {
    return this.delete(`/api/bonuses/${bonusId}`);
  }

  async getPromotions() {
    return this.get('/api/promotions');
  }

  async getPromotionDetails(promotionId) {
    return this.get(`/api/promotions/${promotionId}`);
  }
}

module.exports = { BonusesApi };