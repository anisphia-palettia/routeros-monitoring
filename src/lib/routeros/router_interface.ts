import { getRouterosConn } from "./manage";

export async function getRouterInterface(_id: string) {
  const conn = getRouterosConn("68479a299b94283e05524172");
  if (!conn) {
    console.log("router not found");
    return;
  }
  const response = await conn.write("/interface/print");
  console.log(response);
}
