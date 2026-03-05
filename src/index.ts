import AgentAPI from 'apminsight'
AgentAPI.config()

import express from 'express';
import subjectsRouter from './routes/subjects.js'
import usersRouter from './routes/users.js'
import classesRouter from './routes/classes.js'
import departmentsRouter from './routes/departments.js'
import statsRouter from './routes/stats.js'
import enrollmentsRouter from './routes/enrollments.js'

import securityMiddleware from './middleware/security.js'
import cors from 'cors'
import { auth } from './lib/auth';
import { toNodeHandler } from 'better-auth/node'

const app = express();
const port = 8000;

if (!process.env.FRONTEND_URL) {
  throw new Error('FRONTEND_URL is not set in .env file')
}

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials:true
}))

app.all('/api/auth/*splat', toNodeHandler(auth))

// Use JSON middleware
app.use(express.json());

app.use(securityMiddleware)
app.use('/api/subjects', subjectsRouter)
app.use('/api/users', usersRouter)
app.use('/api/classes', classesRouter)
app.use('/api/departments', departmentsRouter)
app.use('/api/stats', statsRouter)
app.use('/api/enrollments', enrollmentsRouter)
// Root GET route
app.get('/', (req, res) => {
  res.json({ message: 'Hello from the classroom backend!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});