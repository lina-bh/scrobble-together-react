import SparkMD5 from "spark-md5";

export class LastFmClient {
  constructor(apiKey, secret, base = "https://ws.audioscrobbler.com/2.0/") {
    this.apiKey = apiKey;
    this.secret = secret;
    this.base = base;
  }

  constructUrl(method, params) {
    const url = new URL(this.base);

    url.searchParams.set("api_key", this.apiKey);
    url.searchParams.set("method", method);
    for (const [k, v] in Object.entries(params)) {
      url.searchParams.set(k, v);
    }

    const allParams = Array.from(url.searchParams.entries());
    allParams.sort((a, b) => {
      const k1 = a[0];
      const k2 = b[0];
      if (k1 > k2) return 1;
      if (k2 > k1) return -1;
      return 0;
    });
    const sig =
      allParams.reduce((acc, [k, v]) => acc + k + v, "") + this.secret;
    const hash = SparkMD5.hash(sig);
    url.searchParams.set("api_sig", hash);

    url.searchParams.set("format", "json");

    return url;
  }

  async GET(method, params, authed) {
    const url = this.constructUrl(method, params);
    const resp = await fetch(url.href, {
      headers: { Accept: "application/json" },
    });
    const body = await resp.json();
    return body;
  }
}
