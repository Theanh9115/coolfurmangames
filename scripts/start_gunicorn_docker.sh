#!/bin/bash

# Runs gunicorn inside the container.
# --reload watches app/ for changes and restarts automatically,
# so you don't need to rebuild or restart the container while coding.
exec gunicorn --reload --workers 1 \
    --capture-output --log-level debug \
    --bind 0.0.0.0:8000 wsgi:app
