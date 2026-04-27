const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const errorMiddleware = require('./middlewares/error');
const authRoutes = require('./routes/authRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const employerRoutes = require('./routes/employerRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const cvRoutes = require('./routes/cvRoutes');
const aiToolsRoutes = require('./routes/aiToolsRoutes');
const careerRoutes = require('./routes/careerRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const chatRoutes = require('./routes/chatRoutes');
const applicationNoteRoutes = require('./routes/applicationNoteRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const skillRoutes = require('./routes/skillRoutes');
const offerRoutes = require('./routes/offerRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

const app = express();

// 9. Security
app.use(helmet()); // Protects against known web vulnerabilities by setting HTTP headers
app.use(cors()); // Enables Cross-Origin Resource Sharing for the Frontend

// Rate Limiting to prevent Brute-Force and DDoS attacks
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Built-in middleware to parse JSON bodies
app.use(express.json());

// Main API Routes
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/employers', employerRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/cvs', cvRoutes);
app.use('/api/ai-tools', aiToolsRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/applications', applicationNoteRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/offers', offerRoutes);

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "NextHire API Explorer"
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API is running successfully!' });
});

// 9. Security & Error Handling (must be the last middleware)
app.use(errorMiddleware);

// Redirect root to Swagger UI
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

module.exports = app;
