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


FROM --platform=$BUILDPLATFORM node:19.6-alpine3.16
LABEL org.opencontainers.image.title="Kafka Sonar" \
    org.opencontainers.image.description="The one-stop shop Docker Desktop Extension for seamless Kafka cluster monitoring and troubleshooting." \
    org.opencontainers.image.vendor="Kafka Sonar" \
    com.docker.desktop.extension.api.version="0.3.4" \
    com.docker.desktop.extension.icon="https://raw.githubusercontent.com/oslabs-beta/Kafka-Sonar/dev/.github/images/kafka-sonar-orange-logo.png" \
    com.docker.extension.screenshots='[{"alt": "First step to connect to cluster", "url": "https://raw.githubusercontent.com/oslabs-beta/Kafka-Sonar/dev/.github/images/add1.png"}, {"alt": "Second step to connect to cluster", "url": "https://raw.githubusercontent.com/oslabs-beta/Kafka-Sonar/dev/.github/images/add2.png"}, {"alt": "View metrics for connected cluster", "url": "https://raw.githubusercontent.com/oslabs-beta/Kafka-Sonar/dev/.github/images/connected.png"}, {"alt": "Grid view of saved cluster connections", "url": "https://raw.githubusercontent.com/oslabs-beta/Kafka-Sonar/dev/.github/images/saved.png"}]' \
    com.docker.extension.detailed-description="<br>Kafka Sonar is the first-of-its-kind Docker Desktop Extension aimed at enhancing the Kafka developer experience. For developers monitoring or testing their Kafka clusters, Sonar offers an at-a-glance overview of cluster health with 20 essential metrics, and archives those metrics for postmortem retrieval and analysis. Sonar provides a transparent, no-code configuration solution to your Kafka cluster monitoring needs, all in Docker Desktop. It's as simple as entering your cluster information and clicking to connect." \
    com.docker.extension.publisher-url="https://www.kafkasonar.io/" \
    com.docker.extension.additional-urls='[{"title":"Documentation","url":"https://github.com/oslabs-beta/Kafka-Sonar"}]' \
    com.docker.extension.changelog="v1.0.0 Launch" \
    com.docker.extension.account-info="" \
    com.docker.extension.categories="testing-tools, utility-tools"

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