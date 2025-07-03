FROM n8nio/n8n:latest

# Expose n8n port
EXPOSE 5678

# Use the PORT environment variable that Railway provides
ENV PORT=5678
ENV N8N_PORT=5678

# Set the work directory
WORKDIR /home/node

# The n8n image already has n8n installed, so we don't need to install it again
# Just copy any custom files if needed
COPY . .

# Start n8n
CMD ["n8n", "start"]
