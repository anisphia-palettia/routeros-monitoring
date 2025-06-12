import { z } from "zod";

export const routerInterfaceSchema = {
  enableOrDisableMonitoringSchema: z.object({
    interfaceId: z.string().min(1),
  }),
};

export type EnableMonitoringInput = z.infer<
  typeof routerInterfaceSchema.enableOrDisableMonitoringSchema
>;
