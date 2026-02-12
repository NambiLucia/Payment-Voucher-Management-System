FROM node:20-alpine
# Install OpenSSL for prisma and build tools
RUN apk add --no-cache bash python3 make g++ openssl
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 3500
CMD ["npm","start"]