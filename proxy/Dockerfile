# Base on offical NGINX Alpine image
FROM nginx:alpine
ARG MODE
RUN test -n "$MODE" || (echo "MODE not set (prod or dev)" && false)
RUN echo "Got mode: $CONF"

# Remove any existing config files
RUN rm /etc/nginx/conf.d/*

# Copy config files
# *.conf files in conf.d/ dir get included in main config
COPY ./$MODE.conf /etc/nginx/conf.d/

# Expose the listening port
EXPOSE 80
EXPOSE 443

# Launch NGINX
CMD [ "nginx", "-g", "daemon off;" ]
