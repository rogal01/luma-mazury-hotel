import express from 'express';
import cors from 'cors';
import { initDb, dbRun, dbGet, dbAll } from './database.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Initialize Database
initDb().then(() => {
  console.log('SQLite database initialized successfully.');
}).catch(err => {
  console.error('Failed to initialize SQLite database:', err);
});

// REST API Endpoints

// Get all workflows
app.get('/api/workflows', async (req, res) => {
  try {
    const workflows = await dbAll('SELECT id, name, created_at FROM workflows ORDER BY created_at DESC');
    res.json(workflows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get workflow by ID
app.get('/api/workflows/:id', async (req, res) => {
  try {
    const workflow = await dbGet('SELECT * FROM workflows WHERE id = ?', [req.params.id]);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    // Parse JSON strings
    workflow.nodes = JSON.parse(workflow.nodes);
    workflow.connections = JSON.parse(workflow.connections);
    res.json(workflow);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save or Update workflow
app.post('/api/workflows', async (req, res) => {
  const { id, name, nodes, connections } = req.body;
  if (!id || !name || !nodes || !connections) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const nodesStr = JSON.stringify(nodes);
    const connectionsStr = JSON.stringify(connections);

    const existing = await dbGet('SELECT id FROM workflows WHERE id = ?', [id]);
    if (existing) {
      await dbRun(
        'UPDATE workflows SET name = ?, nodes = ?, connections = ? WHERE id = ?',
        [name, nodesStr, connectionsStr, id]
      );
    } else {
      await dbRun(
        'INSERT INTO workflows (id, name, nodes, connections) VALUES (?, ?, ?, ?)',
        [id, name, nodesStr, connectionsStr]
      );
    }
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get runs for a workflow
app.get('/api/executions/workflow/:id', async (req, res) => {
  try {
    const runs = await dbAll(
      'SELECT id, status, started_at, ended_at FROM executions WHERE workflow_id = ? ORDER BY started_at DESC LIMIT 10',
      [req.params.id]
    );
    res.json(runs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get execution run details and logs
app.get('/api/executions/:id', async (req, res) => {
  try {
    const run = await dbGet('SELECT * FROM executions WHERE id = ?', [req.params.id]);
    if (!run) {
      return res.status(404).json({ error: 'Execution run not found' });
    }
    const logs = await dbAll('SELECT * FROM logs WHERE execution_id = ? ORDER BY timestamp ASC', [req.params.id]);
    res.json({ run, logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Execution Pipeline Engine
app.post('/api/workflows/:id/execute', async (req, res) => {
  const workflowId = req.params.id;
  const executionInput = req.body.input || "Default support ticket text: I need a refund on my purchase, the product is completely broken.";

  try {
    const workflow = await dbGet('SELECT * FROM workflows WHERE id = ?', [workflowId]);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    const nodes = JSON.parse(workflow.nodes);
    const connections = JSON.parse(workflow.connections);

    const executionId = 'run-' + Math.random().toString(36).substring(2, 9);
    
    // Create execution run record
    await dbRun(
      'INSERT INTO executions (id, workflow_id, status) VALUES (?, ?, ?)',
      [executionId, workflowId, 'running']
    );

    // Run pipeline asynchronously to prevent API timeout
    runWorkflowPipeline(executionId, nodes, connections, executionInput).catch(console.error);

    res.json({ success: true, executionId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Asynchronous execution engine
async function runWorkflowPipeline(executionId, nodes, connections, initialInput) {
  const addLog = async (nodeId, level, message) => {
    await dbRun(
      'INSERT INTO logs (execution_id, node_id, level, message) VALUES (?, ?, ?, ?)',
      [executionId, nodeId, level, message]
    );
  };

  try {
    await addLog(null, 'info', `🚀 Initializing workflow pipeline with input: "${initialInput}"`);
    
    // Find trigger node
    const triggerNode = nodes.find(n => n.type === 'trigger');
    if (!triggerNode) {
      throw new Error('No trigger node found in this workflow');
    }

    await addLog(triggerNode.id, 'info', `✔ Trigger matching incoming payload: Webhook route active.`);
    
    let currentNode = triggerNode;
    let currentData = initialInput;
    let stepsCount = 0;
    const maxSteps = 20; // Prevent infinite loops

    while (currentNode && stepsCount < maxSteps) {
      stepsCount++;
      const currentId = currentNode.id;

      // Find connections from current node
      const nextConnections = connections.filter(c => c.from === currentId);

      if (currentNode.type === 'trigger') {
        // Find next node connected to trigger
        const nextConn = nextConnections[0];
        currentNode = nextConn ? nodes.find(n => n.id === nextConn.to) : null;
        continue;
      }

      if (currentNode.type === 'agent') {
        await addLog(currentId, 'info', `🔄 Invoking ${currentNode.name} using ${currentNode.config.model || 'Gemini 1.5 Pro'}`);
        await new Promise(r => setTimeout(r, 600)); // Simulate API latency

        // Mock AI decision logic
        let sentiment = 'NEUTRAL';
        const lowercaseInput = currentData.toLowerCase();
        if (lowercaseInput.includes('broken') || lowercaseInput.includes('refund') || lowercaseInput.includes('bad') || lowercaseInput.includes('terrible') || lowercaseInput.includes('broken')) {
          sentiment = 'NEGATIVE';
        } else if (lowercaseInput.includes('love') || lowercaseInput.includes('great') || lowercaseInput.includes('awesome') || lowercaseInput.includes('good')) {
          sentiment = 'POSITIVE';
        }

        await addLog(currentId, 'info', `🤖 AI Prompt resolved: "${currentNode.config.prompt.replace('{{input}}', currentData)}"`);
        await addLog(currentId, 'info', `🤖 Model Response: "${sentiment}" (Latency: 280ms, Tokens: 180)`);
        
        currentData = sentiment; // Pass sentiment forward
        
        const nextConn = nextConnections[0];
        currentNode = nextConn ? nodes.find(n => n.id === nextConn.to) : null;
      } 
      else if (currentNode.type === 'router') {
        const routeTarget = currentNode.config.condition || 'NEGATIVE';
        const matches = currentData === routeTarget;
        
        await addLog(currentId, 'info', `⚡ Checking condition: Result "${currentData}" matches target "${routeTarget}"? ${matches ? 'YES' : 'NO'}`);
        
        // Find matching branch connection
        const matchConn = nextConnections.find(c => c.condition === (matches ? 'true' : 'false'));
        currentNode = matchConn ? nodes.find(n => n.id === matchConn.to) : null;
      } 
      else if (currentNode.type === 'action') {
        await addLog(currentId, 'info', `⚙ Dispatching action ${currentNode.name}...`);
        await new Promise(r => setTimeout(r, 300)); // Simulate action latency

        if (currentNode.name.includes('Telegram') || currentNode.name.includes('Slack')) {
          await addLog(currentId, 'info', `✔ Notification successfully dispatched to ${currentNode.config.target || '@telegram_channel'}`);
        } else {
          await addLog(currentId, 'info', `✔ Auto-reply message successfully queued: "${currentNode.config.template || 'Default text'}"`);
        }
        
        // Actions are leaf nodes, finish execution
        currentNode = null;
      }
    }

    // Set execution as complete
    await dbRun(
      'UPDATE executions SET status = ?, ended_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['completed', executionId]
    );
    await addLog(null, 'info', `🏁 Workflow pipeline executed successfully.`);

  } catch (err) {
    console.error(err);
    await dbRun(
      'UPDATE executions SET status = ?, ended_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['failed', executionId]
    );
    await addLog(null, 'error', `❌ Pipeline aborted: ${err.message}`);
  }
}

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
