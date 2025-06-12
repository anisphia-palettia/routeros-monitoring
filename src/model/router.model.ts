import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { RouterInterface } from "./router_interface.model";

@modelOptions({
  options: { customName: "Router" },
  schemaOptions: { collection: "routers" },
})
export class Router {
  @prop({ type: () => String, required: true })
  public name!: string;

  @prop({ type: () => String, required: true, unique: true })
  public host!: string;

  @prop({ type: () => Number, required: true })
  public port!: number;

  @prop({ type: () => String, required: true })
  public username!: string;

  @prop({ type: () => String, required: true })
  public password!: string;

  @prop({ ref: () => RouterInterface, default: [] })
  public interfaces!: Ref<RouterInterface>[];
}