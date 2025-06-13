import { RunningInterfaceModel } from "../model/_index";

export const runningInterfaceService = {
  createOrUpdate(interfaceId: string, routerId: string) {
    return RunningInterfaceModel.findOneAndUpdate(
      {
        router_interface_id: interfaceId,
        router_id: routerId,
      },
      {
        $set: {
          router_interface_id: interfaceId,
          router_id: routerId,
        },
      },
      {
        upsert: true, // buat jika tidak ada
        new: true, // kembalikan dokumen yang diupdate atau dibuat
      }
    );
  },
  remove(interfaceId: string, routerId: string) {
    return RunningInterfaceModel.deleteOne({
      router_interface_id: interfaceId,
      router_id: routerId,
    });
  },
  find() {
    return RunningInterfaceModel.find();
  },
};
