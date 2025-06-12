import { getModelForClass } from "@typegoose/typegoose";
import { Router } from "./router.model";
import { RouterInterface } from "./router_interface.model";
import { RunningInterface } from "./running_interface";
import { InterfaceTraffic } from "./interface-traffic";

export const RouterModel = getModelForClass(Router);
export const RouterInterfaceModel = getModelForClass(RouterInterface);
export const InterfaceTrafficModel = getModelForClass(InterfaceTraffic);
export const RunningTrafficModel = getModelForClass(RunningInterface);
