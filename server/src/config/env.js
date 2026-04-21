require('dotenv').config();

const config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campus-skill-exchange',
  
  JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret_change_me',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  
  EMAIL_HOST: process.env.EMAIL_HOST || null,
  EMAIL_PORT: process.env.EMAIL_PORT || null,
  EMAIL_USER: process.env.EMAIL_USER || null,
  EMAIL_PASS: process.env.EMAIL_PASS || null,
  EMAIL_FROM: process.env.EMAIL_FROM || null,
  
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || null,
  
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123'
};

module.exports = config;
