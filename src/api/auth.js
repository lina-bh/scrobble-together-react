import { GET } from "./client";

export async function getToken(config) {
  const b = await GET("auth.gettoken", {}, config);
  if (b.token) {
    return b.token;
  }
}

export async function getSession(token, config) {
  const b = await GET("auth.getsession", { token }, config);
  if (b.session) {
    return b.session;
  }
}
