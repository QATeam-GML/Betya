import { readAllCredentials, readUsedUsers } from './credentialStore.js';

export function getRandomUnusedUser() {
  const users = readAllCredentials();
  const used = readUsedUsers();

  if (!users.length) {
    throw new Error('❌ No registered users found');
  }

  const unusedUsers = users.filter(u => !used.includes(u.username));

  if (unusedUsers.length === 0) {
    console.warn('⚠️ All users recently used, picking any user randomly');
    return users[Math.floor(Math.random() * users.length)];
  }

  return unusedUsers[Math.floor(Math.random() * unusedUsers.length)];
}
