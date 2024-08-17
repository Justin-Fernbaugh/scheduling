# Stage 1: Build the frontend
FROM node:18 as build

# Set the working directory
WORKDIR /app

# Copy the frontend package.json and package-lock.json
COPY frontend/package*.json ./frontend/

# Install frontend dependencies
RUN cd frontend && npm install --force

# Copy the rest of the frontend application files
COPY frontend ./frontend

# Build the frontend
RUN cd frontend && npm run build --force

# Stage 2: Setup the production environment
FROM node:18

# Set the working directory
WORKDIR /app

# Copy the backend package.json and package-lock.json
COPY backend/package*.json ./backend/

# Install backend dependencies
RUN cd backend && npm install --only=production

# Copy the backend application files
COPY backend ./backend

# Copy the built frontend from the previous stage
COPY --from=build /app/frontend/dist /app/frontend/dist

# Copy the start script
COPY start.sh /app/start.sh

# Expose the necessary ports
EXPOSE 8000 3000

# Set the startup command to run the start script
CMD ["/bin/bash", "/app/start.sh"]