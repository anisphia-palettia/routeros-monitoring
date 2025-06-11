export interface IRouterosConfig {
  _id: any;
  host: string;
  port: number;
  username: string;
  password: string;
}

export interface IRouterInterface {
  interface_id: string;
  name: string;
  default_name?: string | null;
  type?: string;
  isMonitoring?: boolean;
}
