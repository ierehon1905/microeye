# Microeye

> A simple custom metrics storage and visualization tool.

![Microeye](./docs/thumbnail.jpg)

To run with basic auth use the following command

```bash
docker run -p 3000:3000 -e MICROEYE_ADMIN_PASSWORD=my_super_secret_password ierehon1905/microeye:latest
```

or the following to disable auth run

```bash
docker run -p 3000:3000 -e MICROEYE_DISABLE_AUTH=true ierehon1905/microeye:latest
```

Open the browser to see ui.

To push metrics run

```bash
curl -X POST -H "Content-Type: application/json" -d '{"name":"cpu","labels":{"a":"b"},"value":1}' http://localhost:3000/push
```

or use example pushers from `./pusher` directory.

To push metrics from js use or make your own pusher

```js
import axios from "axios";

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

export default Pusher;
```

## Docker compose

```yaml
services:
  # ...
  monitoring:
    image: ierehon1905/microeye:latest
    ports:
      - "3000:3000"
    volumes:
      - monitoring_data:/var/lib/postgresql/data

volumes:
  # ...
  monitoring_data:
```

And then use `http://monitoring:3000` as host to push metrics.
