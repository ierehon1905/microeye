import express from "express";
import fetchDashboard from "./fetch-dashboard";
import updateDashboard from "./update-dashboard";
import deleteDashboard from "./delete-dashboard";
import fetchDashboards from "./fetch-dashboards";
import createDashboard from "./create-dashboard";

const dashboardApi = express.Router();

dashboardApi.get("/dashboards/:id", ...fetchDashboard);
dashboardApi.post("/dashboards/:id", ...updateDashboard);
dashboardApi.delete("/dashboards/:id", ...deleteDashboard);
dashboardApi.post("/dashboards", ...createDashboard);
dashboardApi.get("/dashboards", ...fetchDashboards);

export default dashboardApi;
