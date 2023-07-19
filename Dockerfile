# build backend service first
FROM --platform=$BUILDPLATFORM node:19.6-alpine3.16 AS builder
WORKDIR /backend
COPY vm/package*.json .
# RUN npm install # Could not find origin
RUN --mount=type=cache,target=/user/src/app/.npm \
    npm set cache /usr/src/app/.npm && \ 
    npm ci
COPY vm /backend

# build frontend service
FROM --platform=$BUILDPLATFORM node:19.6-alpine3.16 AS client-builder
WORKDIR /ui
# cache packages in layer
COPY ui/package.json /ui/package.json
COPY ui/package-lock.json /ui/package-lock.json
RUN npm install
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci
# install
COPY ui /ui
RUN npm run build

# copy from the above what we needed (backend service, frontend assets)
FROM --platform=$BUILDPLATFORM node:19.6-alpine3.16
LABEL org.opencontainers.image.title="Kafka Sonar" \
    org.opencontainers.image.description="One stop shop for Kafka Cluster Monitoring" \
    org.opencontainers.image.vendor="Kafka Sonar" \
    com.docker.desktop.extension.api.version="0.1.0" \
    com.docker.extension.screenshots="" \
    com.docker.desktop.extension.icon="" \
    com.docker.extension.detailed-description="" \
    com.docker.extension.publisher-url="" \
    com.docker.extension.additional-urls="" \
    com.docker.extension.categories="" \
    com.docker.extension.changelog=""

COPY docker-compose.yml .
COPY metadata.json .
COPY kafkasonar.svg .
# COPY --chmod=755 --from=builder /backend /backend
COPY --from=builder /backend backend
# COPY --from=client-builder /ui/build ui
COPY --from=client-builder /ui ui
# run the backend service as a container, passing the socket path where the backend is listening
# RUN chmod +x /backend
# CMD ["/backend", "-socket", "/run/guest-services/backend.sock"]
WORKDIR /backend
CMD ["npm", "start"]
# WORKDIR /ui
# CMD ["npm", "run", "frontend"]