import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.magnesium',
  appName: 'Magnesium',
  webDir: 'public',
  server: {
    url: 'https://mg.rockmillclimbing.com',
    allowNavigation: [
      "mg.rockmillclimbing.com",
      "accounts.google.com",
      "*.google.com",
      "*.googleusercontent.com",
      "192.168.1.68",
      "localhost"
    ]
  },
  android: {
    backgroundColor: "#F8FAFC"
  },
  ios: {
    overrideUserAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    contentInset: "always",
    backgroundColor: "#F8FAFC"
  },
};

export default config;
