	apt-get update
    apt-get install -y g++
    curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
    sudo apt-get install -y nodejs
    su vagrant
    mkdir /home/vagrant/node_modules
    cd /var/www
    ln -s /home/vagrant/node_modules/ node_modules
    cd /var/www
    sudo npm install