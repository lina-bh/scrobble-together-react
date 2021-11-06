import { GET } from ".."

export interface UserInfo {
  name: string
  avatarHref: string | null
  "#raw": any
}

export async function userGetInfo(username: string) {
  const { user } = await GET("user.getinfo", { user: username })
  const avatarHref = user.image[0]["#text"]
  return { name: user.name, avatarHref: avatarHref || null, "#raw": user }
}
