export const AGG_FUNCTIONS = ["avg", "min", "max", "count", "sum"];
export const NODE_ENV: "development" | "production" = (process.env.NODE_ENV ||
    "production") as "development" | "production";
export const MICROEYE_MUST_START_FRONT =
    process.env.MICROEYE_MUST_START_FRONT === "true";
export const MICROEYE_FAKE_DATA = process.env.MICROEYE_FAKE_DATA === "true";
export const MICROEYE_DB_NAME = process.env.MICROEYE_DB_NAME || "microeye";
export const MICROEYE_FRONT_HANDLER_PATH =
    process.env.MICROEYE_FRONT_HANDLER_PATH;
export const MICROEYE_ADMIN_PASSWORD =
    process.env.MICROEYE_ADMIN_PASSWORD || "microeye";
export const MICROEYE_DISABLE_AUTH =
    process.env.MICROEYE_DISABLE_AUTH === "true";
