// @ts-check

import axios from "axios";

/**
 * @typedef {{
 *    name: string,
 *    labels: Record<string, string | number>,
 *    values: number[],
 *    timestampsSec: number[],
 * }} ManyMetric
 * @typedef {{
 *  name: string,
 * value: number,
 * labels: Record<string, string>,
 * }} Metric
 * @typedef {Array<ManyMetric>} Metrics
 */

class ImmediatePusher {
  /**
   * @param {string} host
   */
  constructor(host) {
    this.host = host;
  }

  /**
   *
   * @param {string} name
   * @param {number} value
   * @param {undefined | Record<string, string | number>} labels
   * @param {undefined | number} timestampSec
   */
  async pushMetric(name, value, labels, timestampSec) {
    await axios.post(`${this.host}/api/push`, {
      name,
      value,
      labels,
      timestampSec,
    });
  }

  /**
   * @param {Metrics} metrics
   */
  async pushMetrics(metrics) {
    await axios.post(`${this.host}/api/push-many`, {
      metrics,
    });
  }
}

class GridPusher {
  /** @type {Record<string, ManyMetric>} */
  metrics = {};
  /** @type {NodeJS.Timeout} */
  intervalId;

  /**
   *
   * @param {string} host
   * @param {undefined | number} intervalSec
   */
  constructor(host, intervalSec = 15) {
    this.host = host;
    this.intervalSec = intervalSec;

    this.intervalId = setInterval(() => {
      const metrics = Object.values(this.metrics);
      this.metrics = {};
      this.#pushMetricsImmediate(metrics);
    }, intervalSec * 1000);
  }

  async #pushMetricsImmediate(
    /** @type {Metrics} */
    metrics
  ) {
    await axios.post(`${this.host}/api/metrics/push-many`, {
      metrics,
    });
  }

  /**
   * @param {Record<string, string | number> | undefined} obj
   */
  JSONstringifyOrder(obj) {
    const allKeys = new Set();
    JSON.stringify(obj, (key, value) => (allKeys.add(key), value));
    return JSON.stringify(obj, Array.from(allKeys).sort());
  }

  /**
   *
   * @param {string} name
   * @param {number} value
   * @param {undefined | Record<string, string | number>} labels
   * @param {undefined | number} timestampSec
   */
  pushMetric(name, value, labels, timestampSec = Date.now() / 1000) {
    const hash = `${name}${this.JSONstringifyOrder(labels)}`;

    if (!this.metrics[hash]) {
      this.metrics[hash] = {
        name,
        labels: labels || {},
        values: [],
        timestampsSec: [],
      };
    }

    this.metrics[hash].values.push(value);
    this.metrics[hash].timestampsSec.push(timestampSec);
  }

  destroy() {
    clearInterval(this.intervalId);
  }
}

export { ImmediatePusher, GridPusher };
