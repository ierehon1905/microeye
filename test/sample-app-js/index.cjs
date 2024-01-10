const Pusher = require("../../pusher/js");

const pusher = new Pusher("http://localhost:3000");

pusher.pushMetric("test_metric", 1, { foo: "bar" }).then((res) => {
  console.log("done");
});
