---
"@omnidotdev/mantle-app": patch
---

Sign-in rate limiting now tells clients apart when the app is not behind Cloudflare, using the forwarded client address (and `TRUSTED_PROXIES` for multi-proxy setups), instead of sharing one limit across everyone.
