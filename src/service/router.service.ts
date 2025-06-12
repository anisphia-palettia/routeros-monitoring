import { RouterModel } from "../model/_index";
import { Router } from "../model/router.model";
import { RouterCreateInput } from "../schema/router.schema";

export const routerosService = {
  get() {
    return RouterModel.find();
  },

  create(data: RouterCreateInput) {
    return RouterModel.create(data);
  },

  findByHost(host: string) {
    return RouterModel.findOne({ host });
  },

  findById(_id: string): Promise<Router | null> {
    return RouterModel.findById(_id);
  },
};
