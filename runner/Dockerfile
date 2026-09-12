FROM node:20-alpine

RUN apk add --no-cache g++ libstdc++

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY src/ ./src/

RUN mkdir -p /tmp/code-runner && chmod 777 /tmp/code-runner

ENV PORT=5000
ENV TIMEOUT_MS=5000

EXPOSE 5000

CMD ["node", "src/server.js"]
