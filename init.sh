#!/bin/bash -eux

if [[ $EUID -ne 0 ]]; then
    echo "Must run as root." 1>&2
    exit 1
fi

if [ -z $APP_DIR ]; then
    echo "Must set APP_DIR to the root directory of the app." 1>&2
    exit 1
fi

# install nodejs
curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -
yum -y install nodejs

[ -d "/data" ] || mkdir /data
[ -d "/data/www" ] || mkdir /data/www
[ -d "/usr/share/blog" ] || mkdir /usr/share/blog
[ -d "/var/log/blog" ] || mkdir /var/log/blog

pushd $APP_DIR
    # install init.d script
    cp -f blog /etc/init.d/
    # install nginx configuration
    cp -f nginx.conf /etc/nginx/
    cp -f blog.conf /etc/nginx/conf.d/
    # install app files
    cp -rf . /usr/share/blog
    pushd /usr/share/blog
        # install app
        npm install --production
    popd
popd

# setup run levels
chkconfig blog --add
chkconfig blog on

# restart services
service blog restart
service nginx restart
