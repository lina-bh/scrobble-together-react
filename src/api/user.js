import { GET } from "./client";

const getInfo = (user) => {
  const b = await GET("user.getinfo", { user });
  if (b.user) return b.user;
};
