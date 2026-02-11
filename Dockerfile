FROM node:18-alpine
# Install OpenSSL for prisma
RUN apk add --no-cache openssl 
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 3500
CMD ["npm","start"]