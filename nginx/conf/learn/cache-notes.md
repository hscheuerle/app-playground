https://serverfault.com/questions/915463/nginx-proxy-default-cache-time-with-cache-control-and-no-expiration

> That is right, by default, with just proxy_cache configured, nginx only caches responses that have max-age set in the Cache-Control header.
>
> Without any Cache-Control header or just Cache-Control: public nginx doesn't cache the response (i.e. you get each time X-Cache-Status: MISS when you also configure add_header X-Cache-Status $upstream_cache_status;).
>
> You can configure a default caching time for responses without a Cache-Control header or ones without a max-age field in a Cache-Control header:
>
> # for 200, 301, 302 responses
>
> proxy_cache_valid 10m;
>
> # for all other responses
>
> proxy_cache_valid any 1m;
>
> That means a Cache-Control header has precedence over a proxy_cache_valid setting and there are no defaults for proxy_cache_valid.
