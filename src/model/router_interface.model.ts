import { modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({
  options: { customName: "RouterInterface" },
  schemaOptions: { collection: "router_interfaces" },
})
export class RouterInterface {
  @prop({ required: true, unique: true })
  public interface_id!: string;

  @prop({ required: true })
  public name!: string;

  @prop({ default: null })
  public default_name?: string;

  @prop({ required: true })
  public type?: string;
}
