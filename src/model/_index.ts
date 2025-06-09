import { getModelForClass } from "@typegoose/typegoose";
import { Router } from "./router.model";
import { RouterInterface } from "./router_interface.model";

export const RouterModel = getModelForClass(Router);
export const RouterInterfaceModel = getModelForClass(RouterInterface);
