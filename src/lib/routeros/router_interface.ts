import { RouterOSAPI } from "node-routeros-v2";

export async function getRouterInterface(_id: string, conn: RouterOSAPI) {
  const response = await conn.write("/interface", "print");
  console.log(response);
}
