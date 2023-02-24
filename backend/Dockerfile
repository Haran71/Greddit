FROM node:18.12.1

# Install Dependencies
COPY package*.json ./

RUN npm install --silent

# Copy app source code
COPY . .

EXPOSE 3003
# Exports

CMD ["npm","start"]