FROM node:alpine

WORKDIR /app
COPY package.json .
# The --only-prod does the build WITHOUT devDependencies
RUN npm install --only=prod 
COPY . .

CMD ["npm", "start"]