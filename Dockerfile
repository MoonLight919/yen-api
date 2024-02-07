FROM node:18.17.1-alpine as builder

ARG COMMIT_SHORT_SHA=unknown

ENV NODE_ENV production

RUN mkdir -p /app

WORKDIR /app

# copy app to container
COPY . .

# Install dependencies, build application and generate runtime build info
RUN yarn install && \
    yarn run build && \
    echo "{\"commitShortSha\": \"$COMMIT_SHORT_SHA\"}" > .runtime-build-info

FROM node:18.17.1-alpine as installer

ENV NODE_ENV production

RUN mkdir -p /app

WORKDIR /app

# copy yarn configs to properly install dependencies
COPY .yarn/plugins .yarn/plugins
COPY .yarn/releases .yarn/releases
COPY .yarnrc.yml .yarnrc.yml
COPY yarn.lock yarn.lock
COPY package.json package.json

RUN yarn workspaces focus --production

FROM node:18.17.1-alpine

ENV NODE_ENV production
ENV ADDRESS "0.0.0.0"

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/.runtime-build-info /app/.runtime-build-info
COPY --from=installer /app/.yarn/unplugged /app/.yarn/unplugged
COPY --from=installer /app/.pnp.cjs /app/.pnp.cjs
COPY --from=installer /app/.pnp.loader.mjs /app/.pnp.loader.mjs
COPY --from=installer /app/package.json /app/package.json
COPY --from=installer /app/.yarn/cache /app/.yarn/cache

WORKDIR /app

# Expose the listening port of app
EXPOSE 8080

CMD [ "node", "--require", "/app/.pnp.cjs", "--require", "dotenv/config", "--enable-source-maps", "dist/main" ]
