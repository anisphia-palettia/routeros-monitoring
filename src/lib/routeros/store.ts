import { RStream } from "node-routeros-v2";

export const routerChan = new Map<string, RStream>();

export function getRouterChan(key: string) {
  return routerChan.get(key);
}

export function removeRouterChan(key: string) {
  return routerChan.delete(key);
}

export function setRouterChan(key: string, chan: RStream) {
  return routerChan.set(key, chan);
}

export function genKey(routerId: string, interfaceId: string) {
  return `${routerId}:${interfaceId}`;
}
