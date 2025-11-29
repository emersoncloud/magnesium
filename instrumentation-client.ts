import posthog from "posthog-js";
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: "/beta/",
  defaults: "2025-05-24",
  ui_host: "https://us.posthog.com",
});
