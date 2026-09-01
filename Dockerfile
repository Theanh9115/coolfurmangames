FROM python:3.11-slim

WORKDIR /app

# Install dependencies first so Docker can cache this layer
# and only re-run pip install when requirements.txt changes.
COPY app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app (overridden by the bind mount in
# docker-compose.yml during development, but kept here too so
# this image also works standalone if needed).
COPY app/ .

COPY scripts/start_gunicorn_docker.sh /usr/local/bin/start_gunicorn.sh
RUN chmod +x /usr/local/bin/start_gunicorn.sh

EXPOSE 8000

CMD ["/usr/local/bin/start_gunicorn.sh"]
