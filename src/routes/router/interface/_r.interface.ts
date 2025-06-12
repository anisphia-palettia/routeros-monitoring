import { LocalHono } from "../../../types/LocalHono";
import rMonitoring from "./monitoring/_r.monitoring";
import rSync from "./r.sync";

const rInterface = new LocalHono();

rInterface.route("/sync", rSync);
rInterface.route("/monitoring", rMonitoring);

export default rInterface;
