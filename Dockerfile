FROM node:10-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy Sources
COPY . .

# Install Dep and build
RUN npm install && npm build

# Remove dev dependencies
RUN rm -rf node_modules && npm install --only=production

CMD [ "npm", "start" ]
