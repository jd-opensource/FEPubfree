export interface IAppConfig {
  orm: IOrmConfig;
}

export interface IOrmConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}
