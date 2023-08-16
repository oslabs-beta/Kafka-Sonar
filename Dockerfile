# build backend service first
FROM --platform=$BUILDPLATFORM node:19.6-alpine3.16 AS builder
WORKDIR /backend
COPY vm/package*.json .
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

# copy from the above what we needed (backend service, frontend assets) https://drive.google.com/file/d/1MJaKPZmCTK3dRRX1vf99ykaGNXIlVdFl/view?usp=sharing
FROM --platform=$BUILDPLATFORM node:19.6-alpine3.16
LABEL org.opencontainers.image.title="Kafka Sonar" \
    org.opencontainers.image.description="The one-stop shop Docker Desktop Extension for seamless Kafka cluster monitoring and troubleshooting." \
    org.opencontainers.image.vendor="Kafka Sonar" \
    com.docker.desktop.extension.api.version="0.3.4" \
    com.docker.desktop.extension.icon="https://raw.githubusercontent.com/oslabs-beta/ContainerWatch/main/screenshots/containerwatch_logo.png" \
    com.docker.extension.screenshots="[{'url':'https://drive.google.com/file/d/1bcs4ldPPtTaDiV-3mYFn-jQQRhKf4t1I/view?usp=sharing'}]" \
    com.docker.extension.detailed-description="Kafka Sonar is the first-of-its-kind Docker Desktop Extension aimed at enhancing the Kafka developer experience. For developers monitoring or testing their Kafka clusters, Sonar offers an at-a-glance overview of cluster health with 20 essential metrics, and archives those metrics for postmortem retrieval and analysis. Sonar provides a transparent, no-code configuration solution to your Kafka cluster monitoring needs, all in Docker Desktop. It's as simple as entering your cluster information and clicking to connect." \
    com.docker.extension.publisher-url="https://www.kafkasonar.io/" \
    com.docker.extension.additional-urls="[{"title":"Documentation","url":"https://github.com/oslabs-beta/Kafka-Sonar"}]" \
    com.docker.extension.changelog="No changelog" \
    com.docker.extension.account-info="" \
    com.docker.extension.categories="kafka, broker, message-broker, microservices"

COPY docker-compose.yml .
COPY metadata.json .
COPY kafkasonar.svg .
COPY --from=builder /backend backend
COPY --from=client-builder /ui ui

# Copy user directory and static directory into the extension image
COPY vm/static static
COPY vm/user user

RUN chmod +x /backend
WORKDIR /backend
CMD ["npm", "start"]