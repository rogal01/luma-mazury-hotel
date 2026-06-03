import sqlite3 from 'sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbDir = join(__dirname, '../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = join(dbDir, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Helper to run query with Promise
export const dbRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

// Helper to get single row
export const dbGet = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Helper to get all rows
export const dbAll = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Initialize schema
export const initDb = async () => {
  // Create tables
  await dbRun(`
    CREATE TABLE IF NOT EXISTS workflows (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      nodes TEXT NOT NULL,
      connections TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS executions (
      id TEXT PRIMARY KEY,
      workflow_id TEXT NOT NULL,
      status TEXT NOT NULL,
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ended_at DATETIME,
      FOREIGN KEY(workflow_id) REFERENCES workflows(id)
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      execution_id TEXT NOT NULL,
      node_id TEXT,
      level TEXT NOT NULL,
      message TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(execution_id) REFERENCES executions(id)
    )
  `);

  // Insert seed data if empty
  const count = await dbGet('SELECT COUNT(*) as count FROM workflows');
  if (count.count === 0) {
    const seedWorkflow = {
      id: 'default-flow',
      name: 'OmniThread Apparel: AI Ticket & Return Automator',
      nodes: JSON.stringify([
        { id: '1', type: 'trigger', name: 'Incoming Webhook', x: 80, y: 150, config: { path: '/v1/webhook' } },
        { id: '2', type: 'agent', name: 'AI Sentiment Analyzer', x: 320, y: 150, config: { model: 'Gemini 1.5 Pro', prompt: 'Determine the sentiment of this support ticket: "{{input}}". Reply with either: POSITIVE, NEUTRAL, or NEGATIVE.' } },
        { id: '3', type: 'router', name: 'Sentiment Router', x: 560, y: 150, config: { condition: 'NEGATIVE' } },
        { id: '4', type: 'action', name: 'Telegram Slack Alert', x: 800, y: 80, config: { target: '@rogalll10', template: '⚠️ Critical negative ticket: {{input}}' } },
        { id: '5', type: 'action', name: 'Auto-Reply Dispatch', x: 800, y: 280, config: { template: 'Thank you for your feedback. We are processing your request.' } }
      ]),
      connections: JSON.stringify([
        { from: '1', to: '2' },
        { from: '2', to: '3' },
        { from: '3', to: '4', condition: 'true' }, // Match negative
        { from: '3', to: '5', condition: 'false' } // Match neutral/positive
      ])
    };

    await dbRun(
      'INSERT INTO workflows (id, name, nodes, connections) VALUES (?, ?, ?, ?)',
      [seedWorkflow.id, seedWorkflow.name, seedWorkflow.nodes, seedWorkflow.connections]
    );
  }
};
