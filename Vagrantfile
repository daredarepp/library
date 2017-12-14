Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.network :forwarded_port, guest: 3000, host: 4000, auto_correct: true
  config.vm.synced_folder ".", "/var/www"
  config.vm.provision :shell, path: "nodejs.sh"
  config.vm.provision :shell, path: "mongodb.sh"
  config.vm.provision :shell, run: "always", path: "run_app.sh"
end