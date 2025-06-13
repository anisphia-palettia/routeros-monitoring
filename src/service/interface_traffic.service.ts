import { InterfaceTrafficModel } from "../model/_index";
import { InterfaceTraffic } from "../model/interface-traffic";

export const interfaceTrafficService = {
  create(data: InterfaceTraffic) {
    return InterfaceTrafficModel.create(data);
  },
};
