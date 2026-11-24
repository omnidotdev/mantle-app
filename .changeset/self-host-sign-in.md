---
"@omnidotdev/mantle-app": minor
---

Self-hosted instances work with any OpenID Connect provider. The app now reads its public URLs (`VITE_BASE_URL`, `VITE_API_URL`) from the runtime environment instead of values baked into the image, so one image serves any deployment. With `PERSONAL_WORKSPACE_FALLBACK=true`, a user whose provider sends no workspace claims gets a personal workspace. Signing out ends the session at the provider's advertised end-session endpoint instead of a fixed path.
