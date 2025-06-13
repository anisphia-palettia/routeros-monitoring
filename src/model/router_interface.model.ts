import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Router } from "./router.model";
import { Types } from "mongoose";

@modelOptions({
  options: { customName: "RouterInterface" },
  schemaOptions: { collection: "router_interfaces" },
})
export class RouterInterface {
  public "_id": Types.ObjectId;

  @prop({ required: true, unique: true })
  public interface_id!: string;

  @prop({ required: true })
  public name!: string;

  @prop({ default: null })
  public default_name?: string;

  @prop({ required: true })
  public type?: string;

  @prop({ default: false })
  public isMonitoring?: boolean;

  @prop({ ref: () => Router, required: true })
  public router_id!: Ref<Router>;
}
