import 'dotenv/config';
import app from './server.js';

const PORT = process.env.PORT || 3001;

// Start the server
// We separate index.js (start) from server.js (logic) to make testing easier
// Testing libraries like Supertest can import the app without starting the port
const server = app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// Handle unhandled rejections (e.g., database connection failures)
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
