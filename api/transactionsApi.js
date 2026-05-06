// api/transactionsApi.js
const { BaseApi } = require('./baseApi.js');

class TransactionsApi extends BaseApi {
  async getBalance() {
    return this.get('/api/transactions/balance');
  }

  async deposit(amount, method, details = {}) {
    return this.post('/api/transactions/deposit', {
      amount,
      method,
      ...details
    });
  }

  async withdraw(amount, method, details = {}) {
    return this.post('/api/transactions/withdraw', {
      amount,
      method,
      ...details
    });
  }

  async getTransactionHistory(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.get(`/api/transactions/history?${query}`);
  }

  async getPaymentMethods() {
    return this.get('/api/transactions/payment-methods');
  }

  async cancelTransaction(transactionId) {
    return this.delete(`/api/transactions/${transactionId}`);
  }

  async getLimits() {
    return this.get('/api/transactions/limits');
  }

  async setLimits(limits) {
    return this.put('/api/transactions/limits', limits);
  }
}

module.exports = { TransactionsApi };