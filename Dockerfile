FROM node:alpine


WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

RUN echo '*  *  *  *  *  node /usr/src/app/app.js >> /var/log/cron.log' > /etc/crontabs/root

CMD crond && touch /var/log/cron.log && tail -f /var/log/cron.log
