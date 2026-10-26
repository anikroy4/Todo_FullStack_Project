const dns = require('dns');
try {
  // Use public DNS resolvers on Windows to avoid ECONNREFUSED with mongodb+srv querySrv
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (err) {
  // Ignore in environments where setting DNS servers is restricted
}

const mongoose = require('mongoose');

const databaseConfig = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database Connection Error:', error.message);
  }
};

module.exports = databaseConfig;
