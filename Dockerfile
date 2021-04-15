# NodeJS Alpine
FROM node:12

# Show all node logs
ENV NPM_CONFIG_LOGLEVEL warn

# Create app directory
RUN mkdir -p /usr/src/app/upload
WORKDIR /usr/src/app

# Install Bower & Grunt & Deps
COPY src/package.json /usr/src/app/
RUN yarn install --verbose --production --ignore-optional --pure-lockfile --non-interactive

# copying dockerfile so force rebuild that might be unnecessary
COPY src/ /usr/src/app/

EXPOSE 8001
CMD ["node", "app.js"]
