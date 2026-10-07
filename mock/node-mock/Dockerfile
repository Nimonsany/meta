FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose mock server port
EXPOSE 3001

# Environment configuration
ENV MOCK_PORT=3001

# Start the server
CMD ["node", "server.js"]