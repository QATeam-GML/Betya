import fetch from 'node-fetch';

export class BaseApi {
  constructor(baseURL = 'https://www.betya.com') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method: options.method || 'GET',
      headers: { ...this.defaultHeaders, ...options.headers }
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    console.log('\n===== API REQUEST =====');
    console.log('URL:', url);
    console.log('METHOD:', config.method);
    console.log('BODY:', options.body);

    const response = await fetch(url, config);

    let data;
    let rawText = '';
    
    try {
      rawText = await response.text();
      // Try to parse as JSON
      if (rawText) {
        data = JSON.parse(rawText);
      } else {
        data = {};
      }
    } catch (parseError) {
      // If JSON parsing fails, return the raw text
      console.log('Failed to parse JSON:', parseError.message);
      data = { rawResponse: rawText, parseError: parseError.message };
    }

    console.log('STATUS:', response.status);
    console.log('RESPONSE:', data);
    console.log('=======================\n');

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${data.message || data.rawResponse || 'Unknown error'}`);
    }

    return data;
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}