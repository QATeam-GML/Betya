import fs from 'fs';
import path from 'path';

const FILE_PATH = path.resolve('test-data/registeredUsersLive.json');

const USED_FILE_PATH = path.resolve('test-data/usedUsers.json');

export function saveCredentials(creds) {
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });

  let users = [];
  if (fs.existsSync(FILE_PATH)) {
    users = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
  }

  users.push({
    ...creds,
    createdAt: new Date().toLocaleString(),
  });

  fs.writeFileSync(FILE_PATH, JSON.stringify(users, null, 2));
}

export function readAllCredentials() {
  if (!fs.existsSync(FILE_PATH)) {
    throw new Error('No registered users found');
  }
  return JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
}

export function readLatestCredentials() {
  const users = readAllCredentials();
  return users[users.length - 1];
}

// ------------------
// New helper to track used users
export function readUsedUsers() {
  if (!fs.existsSync(USED_FILE_PATH)) return [];
  return JSON.parse(fs.readFileSync(USED_FILE_PATH, 'utf-8'));
}

export function saveUsedUser(username) {
  let used = readUsedUsers();
  used.push(username);

  // Optional: keep only last N users (say 5)
  const N = 5;
  if (used.length > N) used = used.slice(-N);

  fs.writeFileSync(USED_FILE_PATH, JSON.stringify(used, null, 2));
}
