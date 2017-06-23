FROM node:6.11

RUN echo Europe/Paris >/etc/timezone && dpkg-reconfigure -f noninteractive tzdata

# Create app directory
RUN mkdir -p /usr/src/app/upload
WORKDIR /usr/src/app

# Fix on move in link volume
#RUN cd $(npm root -g)/npm \
#&& npm install fs-extra \
#&& sed -i -e s/graceful-fs/fs-extra/ -e s/fs.rename/fs.move/ ./lib/utils/rename.js

# Install Bower & Grunt & Deps
COPY src/package.json /usr/src/app/
RUN npm install --no-optional

# copying dockerfile so force rebuild that might be unnecessary
COPY src/ /usr/src/app/

EXPOSE 8001
CMD ["node", "app.js"]
