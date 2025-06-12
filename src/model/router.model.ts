import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Types } from "mongoose";

@modelOptions({
  options: { customName: "Router" },
  schemaOptions: { collection: "routers" },
})
export class Router {
  public "_id": Types.ObjectId;

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
}
