import type { CapacitorConfig } from "@capacitor/cli";

const isLocalDev = process.env.CAPACITOR_LOCAL_DEV === "true";
const localDevServerUrl = "http://192.168.1.68:3000";
const productionServerUrl = "https://mg.rockmillclimbing.com";

const config: CapacitorConfig = {
  appId: "com.magnesium",
  appName: "Magnesium",
  webDir: "public",
  server: {
    url: isLocalDev ? localDevServerUrl : productionServerUrl,
    allowNavigation: [
      "mg.rockmillclimbing.com",
      "accounts.google.com",
      "*.google.com",
      "*.googleusercontent.com",
      "192.168.1.68",
      "localhost",
    ],
  },
  android: {
    backgroundColor: "#0F172A",
    allowMixedContent: true,
  },
  ios: {
    overrideUserAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    contentInset: "always",
    backgroundColor: "#F8FAFC",
  },
};

export default config;
