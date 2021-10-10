# Base Docker image for the container
FROM node:14.17.5

# Define the home directory INSIDE the container
ENV CONTAINER_HOME_DIR=/applications
ENV APP_NAME=nodejs-express-template

# Create a directory in the docker container
# This directory will store and run the app
WORKDIR $CONTAINER_HOME_DIR/$APP_NAME

# Copy our local files into the working directory (inside the container)
# This will require we re-build every time there's a code change
COPY . .

# Run the installation commands inside the container
RUN npm install --only=production

# Define the command to start the application
ARG NODE_ENV="production"
CMD ["npm", "start"]