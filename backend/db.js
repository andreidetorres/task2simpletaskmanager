const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data.sqlite');
const db = new sqlite3.Database(dbPath);

function init() {
  const createUsers = `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );`;

  const createTasks = `CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    task_name TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    completed_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );`;

  db.run(createUsers);
  db.run(createTasks);
}

function createUser(username, password) {
  return new Promise((resolve, reject) => {
    const stmt = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.run(stmt, [username, password], function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, username });
    });
  });
}

function getUserByUsername(username) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

// No last_login needed for simple version

  return new Promise((resolve, reject) => {
    const stmt = `INSERT INTO tasks (user_id, task_name, completed, completed_at) VALUES (?, ?, 1, datetime('now'))`;
    db.run(stmt, [userId, title], function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, userId, task_name: title, completed: 1 });
    });
  });
}

function getTasksByUserId(userId) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM tasks WHERE user_id = ?`, [userId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows || []);
    });
  });
}

function completeTask(taskId) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE tasks SET completed = 1, completed_at = datetime('now') WHERE id = ?`,
      [taskId],
      function (err) {
        if (err) return reject(err);
        resolve({ id: taskId, completed: 1 });
      }
    );
  });
}

function getTaskById(taskId) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM tasks WHERE id = ?`, [taskId], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function deleteTask(taskId) {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM tasks WHERE id = ?`, [taskId], function (err) {
      if (err) return reject(err);
      resolve({ id: taskId });
    });
  });
}

function getUserTasks(username) {
  return new Promise((resolve, reject) => {
    const stmt = `
      SELECT u.username, u.password, t.task_name, t.completed, t.completed_at
      FROM users u
      LEFT JOIN tasks t ON u.id = t.user_id
      WHERE u.username = ?
    `;
    db.all(stmt, [username], (err, rows) => {
      if (err) return reject(err);
      resolve(rows || []);
    });
  });
}

module.exports = {
  init,
  createUser,
  getUserByUsername,
  createTask,
  getTasksByUserId,
  completeTask,
  getTaskById,
  deleteTask,
  getUserTasks
};
