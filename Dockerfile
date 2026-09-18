# Use official Playwright image with Node.js
FROM mcr.microsoft.com/playwright:v1.63.0-jammy

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Install Playwright browsers (if not already in base image)
RUN npx playwright install --with-deps chromium firefox webkit

# Copy project files
COPY . .

# Set environment variables
ENV NODE_ENV=test
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# Expose ports for debugging
EXPOSE 9229

# Default command (can be overridden)
CMD ["npm", "run", "test:all"]
