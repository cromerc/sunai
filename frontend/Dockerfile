FROM node:18.11.0-bullseye-slim AS installer
USER node
WORKDIR /app
COPY . .
RUN yarn install
CMD ["yarn", "run", "start"]
