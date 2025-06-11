import { LocalHono } from "../../../types/LocalHono";
import rSync from "./r.sync";

const rInterface = new LocalHono();

rInterface.route("/sync", rSync);

export default rInterface;
