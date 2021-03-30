FROM node

WORKDIR /home/app

COPY ./package.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN apt-get update -qq && apt-get install -qqy \
    apt-transport-https \
    ca-certificates \
    curl \
    lxc \
    iptables

# Install Docker from Docker Inc. repositories.
RUN curl -sSL https://get.docker.com/ | sh

# Install the magic wrapper.
# ADD ./wrapdocker /usr/local/bin/wrapdocker
# RUN chmod +x /usr/local/bin/wrapdocker

# Define additional metadata for our image.
VOLUME /var/run/docker.sock
# CMD ["wrapdocker"]

# CMD ["docker", "run", "-d", "--rm", "--name", "code", "-it", "-v", "code", "neoclear/conterview-code-engine"]

# CMD ["node", "app.js"]

CMD docker run -d --rm --name code -it -v code neoclear/conterview-code-engine && node app.js
