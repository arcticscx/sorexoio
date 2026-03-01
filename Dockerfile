FROM node:22-bullseye-slim

WORKDIR /app

# Copy ONLY package files first to cache install
COPY package.json package-lock.json ./

# RUN normal install, NOT ci to avoid the bufferutil lock error
RUN npm install

# Copy the rest of the app
COPY . .

# Build the Vite/React frontend and TypeScript backend
RUN npm run build

EXPOSE 3000

# Start the server
CMD ["npm", "run", "start"]
