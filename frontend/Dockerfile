# frontend/Dockerfile
FROM node:20.11.1-alpine3.19

WORKDIR /app

# Add non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 3030

# Switch to non-root user
USER appuser

CMD ["yarn", "dev"]