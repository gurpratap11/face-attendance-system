import envDev from "./env.dev";
import envProd from "./env.prod";

export class Env {
  env: Environment;
  constructor(env: Environment) {
    this.env = env;
    this.loadEnvironment();
  }

  loadEnvironment(): EnvironmentVariable {
    switch (this.env) {
      case "dev":
        return envDev;
      case "prod":
        return envProd;
      case "local":
        return envDev;
      default:
        return envDev;
    }
  }
}
