import express from "express";
import fetchMetrics from "./fetch-metrics";
import fetchMetricsNames from "./fetch-metrics-names";
import pushMetric from "./push-metric";
import pushMetrics from "./push-metrics";

const metricsApi = express.Router();

metricsApi.get("/names", ...fetchMetricsNames);
metricsApi.post("/", ...fetchMetrics);
metricsApi.post("/push-many", ...pushMetrics);
metricsApi.post("/push", ...pushMetric);

export default metricsApi;
