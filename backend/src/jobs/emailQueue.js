const Queue = require('bull');
const logger = require('../config/logger');

// 8. Background Jobs & Queues
// Using Bull (backed by Redis) to handle background tasks like Emails.
const emailQueue = new Queue('email processing', process.env.REDIS_URL || 'redis://127.0.0.1:6379');

emailQueue.process(async (job) => {
  // 6. Email / Notifications Logic
  logger.info(`Processing email job for: ${job.data.to}`);
  // TODO: Add actual email sending logic here (e.g., using Nodemailer or SendGrid)
  return { status: 'sent', to: job.data.to };
});

emailQueue.on('completed', (job, result) => {
  logger.info(`Email job completed for ${job.data.to} with result ${result.status}`);
});

module.exports = emailQueue;
