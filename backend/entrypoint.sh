#!/bin/sh

echo "Waiting for Django..."

python manage.py migrate

echo "Starting Django..."

python manage.py runserver 0.0.0.0:8000