import { RouterModel } from "../model/_index";
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

  findById(_id: string) {
    return RouterModel.findById(_id);
  },
};
