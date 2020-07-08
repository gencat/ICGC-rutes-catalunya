#!/bin/bash

rm -fr /home/tic/rutes-catalunya
cp -r tmp /home/tic/rutes-catalunya

#service nginx stop
rm -fr /var/www/html/rutes-catalunya/*
cp -r /home/tic/rutes-catalunya/*  /var/www/html/rutes-catalunya/

#service nginx start
