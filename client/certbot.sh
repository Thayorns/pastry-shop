#!/bin/sh

set -e  # stop if error occurs

if [ ! -f "/etc/letsencrypt/live/creamkorzh.ru/fullchain.pem" ]; then
    certbot certonly --standalone -d creamkorzh.ru --non-interactive --agree-tos --email thayornswordsman@gmail.com || exit 1
    chown -R nginx:root /etc/letsencrypt/live/creamkorzh.ru/
    chmod 750 /etc/letsencrypt/live/creamkorzh.ru/
    chmod 640 /etc/letsencrypt/live/creamkorzh.ru/privkey.pem
fi

# nginx reload
nginx -t && nginx -s reload 2>/dev/null || true

# auto-renew with --post-hook (if cert was renewed)
echo "30 2 * * * certbot renew --quiet --post-hook 'nginx -s reload'" >> /etc/crontabs/root
crond -b
