import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { RouterInterface } from "./router_interface.model";
import { Router } from "./router.model";

@modelOptions({
  options: { customName: "RunningInterface" },
  schemaOptions: { collection: "running_interface" },
})
export class RunningInterface {
  @prop({ required: true, ref: () => RouterInterface })
  public router_interface_id!: string;

  @prop({ required: true, ref: () => Router })
  public router_id!: Ref<Router>;
}
