import express from "express";
import fetchDashboard from "./fetch-dashboard";
import updateDashboard from "./update-dashboard";
import deleteDashboard from "./delete-dashboard";
import fetchDashboards from "./fetch-dashboards";
import createDashboard from "./create-dashboard";

const dashboardApi = express.Router();

dashboardApi.get("/:id", ...fetchDashboard);
dashboardApi.post("/:id", ...updateDashboard);
dashboardApi.delete("/:id", ...deleteDashboard);
dashboardApi.post("/", ...createDashboard);
dashboardApi.get("/", ...fetchDashboards);

export default dashboardApi;
