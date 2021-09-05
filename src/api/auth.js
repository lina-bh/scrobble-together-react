import Client from ".";

export default class Auth {
  constructor(cl) {
    this.client = cl;
  }

  getToken() {
    return this.cl.GET("auth.gettoken", {});
  }
}
