
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const https = require('https');
const http = require('http');

const corsOptions = require('./config/cors');
const { sequelize } = require('./models');
const ws = require('./websocket');

const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');
const coffeeRoutes = require('./routes/coffee');
const qrRoutes = require('./routes/qr');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api', orderRoutes);
app.use('/api', productRoutes);
app.use('/api', adminRoutes);
app.use('/api', coffeeRoutes);
app.use('/api', qrRoutes);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected with Sequelize');
    await sequelize.sync({ force: false });
    console.log('Database synchronized');

    let server;
    if (process.env.NODE_ENV === 'production') {
      const options = {
        key: fs.readFileSync('/etc/letsencrypt/live/your_domain_here/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/your_domain_here/fullchain.pem')
      };
      server = https.createServer(options, app);
      ws.init(server, { path: '/api/' });
    } else {
      server = http.createServer(app);
      ws.init(server);
    }

    server.listen(PORT, '0.0.0.0', () => console.log(`Server listening on ${PORT}`));
  } catch (err) {
    console.error('PostgreSQL connection error:', err);
  }
})();
