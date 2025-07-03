FROM n8nio/n8n:latest

# Create app directory
WORKDIR /home/node

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app files
COPY . .

# Expose n8n port
EXPOSE 5678

# Use the PORT environment variable that Railway provides
ENV PORT=5678
ENV N8N_PORT=5678

# Start n8n
CMD ["n8n", "start"]
