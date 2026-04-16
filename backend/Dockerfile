FROM node:21-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=3030

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy source
COPY . .

EXPOSE 3030

CMD ["npm", "start"]
