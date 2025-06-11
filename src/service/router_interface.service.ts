import { RouterInterfaceModel, RouterModel } from "../model/_index";
import { IRouterInterface } from "../types/RouterConfig";
import { Types } from "mongoose";

export const routerInterfaceService = {
  async createOrUpdate(routerId: string, data: IRouterInterface) {
    const updated = await RouterInterfaceModel.findOneAndUpdate(
      { interface_id: data.interface_id },
      { $set: { ...data, routerId: new Types.ObjectId(routerId) } },
      { upsert: true, new: true }
    );

    await RouterModel.findByIdAndUpdate(routerId, {
      $addToSet: { interfaces: updated._id },
    });

    return updated;
  },
};
