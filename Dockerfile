FROM node:16

# Create app directory
WORKDIR /home/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)

RUN ls

# RUN npm install
# RUN npm install -g nodemon 
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source

EXPOSE 8080

## Launch the wait tool and then your application
CMD npm install && npm run dev