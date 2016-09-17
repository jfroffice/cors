FROM node:6.6

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

#COPY src/process.yml /usr/src/app/
RUN npm install pm2 -g
RUN pm2 install pm2-logrotate

# copying dockerfile so force rebuild that might be unnecessary
COPY src/ /usr/src/app/

EXPOSE 8001
CMD ["pm2", "start", "--no-daemon", "process.yml", "--env", "production"]
