const { connectDatabase, disconnectDatabase } = require('./mongoose');

const startServer = async (app) => {
  const PORT = process.env.PORT || 5000;

  try {
    // Connect to database
    await connectDatabase();

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
    });

    // Graceful shutdown on SIGINT (Ctrl+C)
    process.on('SIGINT', async () => {
      console.log('\n\nShutting down gracefully...');
      server.close(async () => {
        await disconnectDatabase();
        console.log('✓ Server shutdown complete');
        process.exit(0);
      });
    });

    // Graceful shutdown on SIGTERM
    process.on('SIGTERM', async () => {
      console.log('\n\nShutting down gracefully...');
      server.close(async () => {
        await disconnectDatabase();
        console.log('✓ Server shutdown complete');
        process.exit(0);
      });
    });

    return server;
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
};

module.exports = {
  startServer,
};
