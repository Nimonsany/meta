const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

// In-memory "database" for fake products
const products = [
  { id: 1, name: "Vintage Leather Jacket", price: 120, category: "fashion", sellerId: "seller_1" },
  { id: 2, name: "Handmade leather wallet", price: 45, category: "fashion", sellerId: "seller_1" },
  { id: 3, name: "Mechanical keyboard", price: 89, category: "electronics", sellerId: "seller_2" },
  { id: 4, name: "Ceramic coffee mug", price: 15, category: "home", sellerId: "seller_2" },
  { id: 5, name: "Smartwatch", price: 199, category: "electronics", sellerId: "seller_1" },
];

// GET /api/node/products/search?q= -> returns 5 fake products from JSON
app.get('/api/node/products/search', (req, res) => {
  const q = req.query.q || '';
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase()) ||
    p.category.toLowerCase().includes(q.toLowerCase())
  );
  res.json({
    success: true,
    products: filtered.slice(0, 5),
    total: filtered.length,
    query: q
  });
});

// POST /api/node/delivery/nearest -> returns fake agent {lat:27.71,lng:85.31}
app.post('/api/node/delivery/nearest', (req, res) => {
  const { lat, lng } = req.body;
  // Return a random nearby "agent" position
  const agentLat = parseFloat((lat + 0.001 * (Math.random() - 0.5)).toFixed(4));
  const agentLng = parseFloat((lng + 0.001 * (Math.random() - 0.5)).toFixed(4));
  res.json({
    success: true,
    agent: { lat: agentLat, lng: agentLng },
    distance_km: Math.random() * 5
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Socket.io mock: tracking:update every 3 sec with moving lat/lng
let trackingIntervals = {};

io.on('connection', (socket) => {
  console.log('Mock socket connected:', socket.id);

  // Start tracking interval for this socket
  trackingIntervals[socket.id] = setInterval(() => {
    // Simulate moving delivery agent
    const baseLat = 27.71; // Kathmandu area
    const baseLng = 85.31;
    const moveLat = parseFloat((baseLat + (Math.random() - 0.5) * 0.01).toFixed(4));
    const moveLng = parseFloat((baseLng + (Math.random() - 0.5) * 0.01).toFixed(4));

    socket.emit('tracking:update', {
      agentId: socket.id.substring(0, 8),
      lat: moveLat,
      lng: moveLng,
      status: Math.random() > 0.1 ? 'online' : 'delivering',
      timestamp: new Date().toISOString()
    });
  }, 3000);

  socket.on('disconnect', () => {
    if (trackingIntervals[socket.id]) {
      clearInterval(trackingIntervals[socket.id]);
      delete trackingIntervals[socket.id];
    }
  });
});

// Start server on port 3001
const PORT = process.env.MOCK_PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Mock Node Server running on http://localhost:${PORT}`);
  console.log(`   GET  /api/node/products/search?q=product`);
  console.log(`   POST /api/node/delivery/nearest`);
  console.log(`   Socket.io: tracking:update every 3s`);
});

// Export for testing
module.exports = { app, io, server };