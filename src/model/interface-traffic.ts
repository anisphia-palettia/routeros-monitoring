import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { RouterInterface } from "./router_interface.model";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

@modelOptions({
  options: { customName: "InterfaceTraffic" },
  schemaOptions: { collection: "interface_traffic" },
})
export class InterfaceTraffic extends TimeStamps {
  @prop({ required: true, ref: () => RouterInterface })
  public router_interface_id!: Ref<RouterInterface>;

  @prop({ required: true })
  public rx!: number;

  @prop({ required: true })
  public tx!: number;
}
