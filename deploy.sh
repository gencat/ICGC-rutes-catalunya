#!/bin/bash

rm -fr /home/tic/rutes-catalunya

cp -r tmp /home/tic/rutes-catalunya

# service nginx stop
rm -fr /var/www/html/rutes-catalunya/*
mkdir -p /var/www/html/rutes-catalunya
cp  /home/tic/rutes-catalunya/index.html  /var/www/html/rutes-catalunya/
cp  /home/tic/rutes-catalunya/favicon.ico  /var/www/html/rutes-catalunya/
cp -r /home/tic/rutes-catalunya/dist  /var/www/html/rutes-catalunya/

#service nginx start
