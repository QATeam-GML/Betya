export function getInvalidCredentials(type) {
  switch (type) {

    // Existing
    case 'INVALID_USER':
      return { username: 'wronguser@test.com', password: '123456Abc' };

    case 'INVALID_PASS':
      return { username: 'Satish', password: 'Wrong@123' };

    case 'INVALID_BOTH':
      return { username: 'wronguser@test.com', password: 'Wrong@123' };

    // =========================
    // NEW VALIDATION SCENARIOS
    // =========================

    case 'EMPTY_CREDENTIALS':
      return { username: '', password: '' };

    case 'EMPTY_USERNAME':
      return { username: '', password: 'Naidu123' };

    case 'EMPTY_PASSWORD':
      return { username: 'Lokesh  ', password: '' };

    case 'SHORT_PASSWORD':
      return { username: 'Satish', password: '123' };

    case 'INVALID_PASSWORD_FORMAT':
      return { username: 'Satish', password: 'abcdef' };

     case 'INVALID_EMAIL_FORMAT':
      return { username: 'invalidemail', password: '123456Abc' };

    case 'USERNAME_WITH_SPACES':
      return { username: 'user name', password: '123456Abc' };

    case 'USERNAME_SPECIAL_CHARS':
      return { username: 'user@#$%', password: '123456Abc' };

    case 'LONG_USERNAME':
      return { username: 'a'.repeat(100), password: '123456Abc' };

    case 'LONG_PASSWORD':
      return { username: 'Lokesh', password: 'a'.repeat(100) };

    case 'SQL_INJECTION':
      return { username: "' OR '1'='1", password: "' OR '1'='1" };

    default:
      throw new Error(`Unknown credential type: ${type}`);
  }
}
