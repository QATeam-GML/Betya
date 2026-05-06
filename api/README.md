# API Page Object Model (POM)

This directory contains API client classes following the Page Object Model pattern for testing APIs.

## Structure

- `baseApi.js` - Base API class with common HTTP methods
- `authApi.js` - Authentication endpoints (login, logout, register)
- `userApi.js` - User management (profile, settings, balance)
- `gamesApi.js` - Game-related endpoints (list games, launch, favorites)
- `transactionsApi.js` - Financial transactions (deposits, withdrawals)
- `bonusesApi.js` - Bonuses and promotions
- `index.js` - Exports all API classes

## Usage

```javascript
const { AuthApi, UserApi } = require('./api/index.js');

const auth = new AuthApi();
await auth.login({ username: 'user', password: 'pass' });

const user = new UserApi();
const profile = await user.getProfile();
```

## Identified APIs from Site Exploration

Based on the site's structure and common casino patterns, the following APIs can be addressed:

### Authentication
- `/api/auth/login` - User login
- `/api/auth/logout` - User logout
- `/api/auth/register` - User registration
- `/api/auth/forgot-password` - Password reset
- `/api/auth/verify-email` - Email verification
- `/api/auth/refresh` - Token refresh

### User Management
- `/api/user/profile` - Get/update user profile
- `/api/user/balance` - Get user balance
- `/api/user/settings` - Get/update user settings
- `/api/user/change-password` - Change password
- `/api/user/transactions` - Transaction history
- `/api/user/bonuses` - User bonuses

### Games
- `/api/games` - List games with filters
- `/api/games/categories` - Game categories
- `/api/games/{id}` - Game details
- `/api/games/{id}/launch` - Launch game
- `/api/games/history` - Game play history
- `/api/games/favorites` - Favorite games
- `/api/games/search` - Search games

### Transactions
- `/api/transactions/balance` - Current balance
- `/api/transactions/deposit` - Make deposit
- `/api/transactions/withdraw` - Make withdrawal
- `/api/transactions/history` - Transaction history
- `/api/transactions/payment-methods` - Available payment methods
- `/api/transactions/limits` - Deposit/withdrawal limits

### Bonuses & Promotions
- `/api/bonuses` - Available bonuses
- `/api/bonuses/active` - Active bonuses
- `/api/bonuses/{id}/claim` - Claim bonus
- `/api/promotions` - Current promotions

## Testing

Run API tests with:
```bash
npx playwright test tests/api/
```

## Notes

- API endpoints are based on common casino site patterns
- Actual endpoints may vary - inspect network requests for exact URLs
- Authentication tokens are automatically handled in the base class
- Error handling is built-in with descriptive messages