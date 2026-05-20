export const msalConfig = {
  auth: {
    clientId: "73f42017-aca1-4ee8-92ea-7676e2cff6d9",
    authority: "https://login.microsoftonline.com/380de320-1fbf-4244-87d7-f7ca03b702cc",
    redirectUri: "http://localhost:5173",
  },
};

export const loginRequest = {
  scopes: ["openid", "profile", "email"],
};