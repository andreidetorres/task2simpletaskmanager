const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

db.init();

app.get('/health', (req, res) => res.json({ ok: true }));

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required.' });
  if (typeof username !== 'string' || typeof password !== 'string') return res.status(400).json({ error: 'Invalid input.' });
  if (password.length < 4) return res.status(400).json({ error: 'Password too short.' });
  try {
    const user = await db.createUser(username, password);
    return res.json({ ok: true, username: user.username });
  } catch (err) {
    if (err && err.message && err.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'Username already registered.' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required.' });
  try {
    const user = await db.getUserByUsername(username);
    if (!user) return res.status(400).json({ error: 'Account not found.' });
    if (user.password !== password) return res.status(400).json({ error: 'Incorrect password.' });
    return res.json({ ok: true, username: user.username, id: user.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// Create a completed task
app.post('/tasks', async (req, res) => {
  const { userId, task_name } = req.body;
  if (!userId || !task_name) return res.status(400).json({ error: 'User ID and task name required.' });
  try {
    const task = await db.createTask(userId, task_name);
    return res.json({ ok: true, task });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create task.' });
  }
});

// Get tasks for a specific user
app.get('/tasks/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const tasks = await db.getTasksByUserId(userId);
    return res.json({ ok: true, tasks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch tasks.' });
  }
});

// Mark task as completed (already handled by createTask in this simple version)
app.put('/tasks/:taskId/complete', async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await db.getTaskById(taskId);
    if (!task) return res.status(404).json({ error: 'Task not found.' });
    const result = await db.completeTask(taskId);
    return res.json({ ok: true, task: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to complete task.' });
  }
});

// Delete a task
app.delete('/tasks/:taskId', async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await db.getTaskById(taskId);
    if (!task) return res.status(404).json({ error: 'Task not found.' });
    await db.deleteTask(taskId);
    return res.json({ ok: true, message: 'Task deleted.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to delete task.' });
  }
});

// Get all user data with tasks (for records/reports)
app.get('/user-tasks/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const data = await db.getUserTasks(username);
    return res.json({ ok: true, data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch user data.' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
