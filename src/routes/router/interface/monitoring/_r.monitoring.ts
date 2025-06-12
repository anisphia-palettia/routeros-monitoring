import { LocalHono } from "../../../../types/LocalHono";
import rDisable from "./r.disable";
import rEnable from "./r.enable";

const rMonitoring = new LocalHono();

rMonitoring.route("/enable", rEnable);
rMonitoring.route("/disable", rDisable);

export default rMonitoring;
