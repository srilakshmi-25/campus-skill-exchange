const app = require('./app');
const http = require('http');
const config = require('./config/env');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const PORT = config.PORT;
const server = http.createServer(app);

const seedAdmin = async () => {
  try {
    // Give DB a short chance to connect properly
    setTimeout(async () => {
      const adminExists = await User.findOne({ role: 'admin' });
      if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(config.ADMIN_PASSWORD, salt);
        await User.create({
          name: 'System Admin',
          email: `${config.ADMIN_USERNAME}@campusskills.edu`, // Use as email field mapping
          password: hashedPassword,
          role: 'admin'
        });
        console.log(`Admin seeded! Login: ${config.ADMIN_USERNAME}@campusskills.edu`);
      }
    }, 2000);
  } catch (error) {
    console.error('Failed to seed admin:', error.message);
  }
};

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    seedAdmin();
});
