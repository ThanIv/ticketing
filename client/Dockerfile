FROM node:20.18-alpine

WORKdIR /app
COPY package.json ./
RUN npm install
COPY . .

CMD ["npm", "run", "dev"]