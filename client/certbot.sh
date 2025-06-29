#!/bin/sh

# stop if error occurs
set -e

if [ ! -f "/etc/letsencrypt/live/your_domain_here/fullchain.pem" ]; then # type your domain
    certbot certonly --standalone -d your_domain_here --non-interactive --agree-tos --email your_email_here || exit 1 # type your domain & email
    chown -R nginx:root /etc/letsencrypt/live/your_domain_here/ # type your domain
    chmod 750 /etc/letsencrypt/live/your_domain_here/ # type your domain
    chmod 640 /etc/letsencrypt/live/your_domain_here/privkey.pem # type your domain
fi

# nginx reload
nginx -t && nginx -s reload 2>/dev/null || true

# auto-renew with --post-hook (if cert was renewed)
echo "30 2 * * * certbot renew --quiet --post-hook 'nginx -s reload'" >> /etc/crontabs/root
crond -b
