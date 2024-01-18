// @ts-check
import test from "node:test";
import assert from "node:assert";

import { GridPusher } from "./index.mjs";

test("hello", async () => {
  const pusher = new GridPusher("http://localhost:3000", 1);

  assert.deepStrictEqual(pusher.metrics, {});

  pusher.pushMetric("test", 1, { a: "b", c: "d" }, 666);

  assert.deepStrictEqual(pusher.metrics, {
    'test{"a":"b","c":"d"}': {
      name: "test",
      labels: { a: "b", c: "d" },
      values: [1],
      timestampsSec: [666],
    },
  });

  pusher.pushMetric("test", 2, { c: "d", a: "b" }, 667);

  assert.deepStrictEqual(pusher.metrics, {
    'test{"a":"b","c":"d"}': {
      name: "test",
      labels: { a: "b", c: "d" },
      values: [1, 2],
      timestampsSec: [666, 667],
    },
  });

  pusher.pushMetric("test", 3, { foo: "bar" }, 668);

  assert.deepStrictEqual(pusher.metrics, {
    'test{"a":"b","c":"d"}': {
      name: "test",
      labels: { a: "b", c: "d" },
      values: [1, 2],
      timestampsSec: [666, 667],
    },
    'test{"foo":"bar"}': {
      name: "test",
      labels: { foo: "bar" },
      values: [3],
      timestampsSec: [668],
    },
  });

  pusher.pushMetric("new", 4, {}, 669);

  assert.deepStrictEqual(pusher.metrics, {
    "new{}": {
      labels: {},
      name: "new",
      timestampsSec: [669],
      values: [4],
    },
    'test{"a":"b","c":"d"}': {
      labels: {
        a: "b",
        c: "d",
      },
      name: "test",
      timestampsSec: [666, 667],
      values: [1, 2],
    },
    'test{"foo":"bar"}': {
      labels: {
        foo: "bar",
      },
      name: "test",
      timestampsSec: [668],
      values: [3],
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 1100));

  assert.deepStrictEqual(pusher.metrics, {});

  pusher.destroy();
});
