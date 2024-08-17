#!/bin/bash

# Navigate to the backend directory and start the API server
cd backend
npm install --force
npm start &

# Navigate to the frontend directory, build the frontend, and serve it
cd ../frontend
npm install --force
npm run build --force
npx serve -s dist -l 3000 &

# Wait for both services to exit (this will keep the container running)
wait