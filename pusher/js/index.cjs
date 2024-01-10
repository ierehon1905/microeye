const axios = require("axios");

class Pusher {
  constructor(host) {
    this.host = host;
  }

  async pushMetric(name, value, labels) {
    await axios.post(`${this.host}/push`, {
      name,
      value,
      labels,
    });
  }
}

module.exports = Pusher;
