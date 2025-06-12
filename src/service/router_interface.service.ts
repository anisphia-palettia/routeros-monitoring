import { RouterInterfaceModel, RouterModel } from "../model/_index";
import { RouterInterface } from "../model/router_interface.model";
import { IRouterInterface } from "../types/RouterConfig";

export const routerInterfaceService = {
  async createOrUpdate(routerId: string, data: IRouterInterface) {
    const updated = await RouterInterfaceModel.findOneAndUpdate(
      { interface_id: data.interface_id, router_id: routerId },
      { $set: { ...data } },
      { upsert: true, new: true }
    );

    return updated;
  },

  async findByInterfaceId(
    interfaceId: string
  ): Promise<RouterInterface | null> {
    return RouterInterfaceModel.findOne({ interface_id: interfaceId });
  },

  async updateMonitoringStatus(
    routerId: string,
    interfaceId: string,
    status: boolean
  ) {
    return RouterInterfaceModel.findOneAndUpdate(
      {
        router_id: routerId,
        interface_id: interfaceId,
      },
      { isMonitoring: status }
    );
  },
};
