import * as dotenv from 'dotenv';
dotenv.config();

export const cfg = {
  baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com',
  user: process.env.STANDARD_USER || 'standard_user',
  pass: process.env.STANDARD_PASS || 'secret_sauce',
};
