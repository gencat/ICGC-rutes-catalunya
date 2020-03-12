#!/bin/bash

rm -fr /home/tic/inundaciopermanent

cp -r tmp /home/tic/inundaciopermanent

# service nginx stop
rm -fr /var/www/html/inundaciopermanent/*
mkdir -p /var/www/html/inundaciopermanent
cp  /home/tic/inundaciopermanent/index.html  /var/www/html/inundaciopermanent/
cp  /home/tic/inundaciopermanent/favicon.ico  /var/www/html/inundaciopermanent/
cp -r /home/tic/inundaciopermanent/dist  /var/www/html/inundaciopermanent/

#service nginx start

