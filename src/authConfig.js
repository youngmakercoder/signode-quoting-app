export const msalConfig = {
  auth: {
    clientId: "39cca72b-9679-41ee-87c4-67f52518e41b",
    authority: "https://login.microsoftonline.com/380de320-1fbf-4244-87d7-f7ca03b702cc",
    redirectUri: "http://localhost:5173",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["openid", "profile", "email"],
};