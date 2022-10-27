export class UnMatchedProjectEnvDeployError extends Error {
  constructor(props) {
    super(props);
    this.name = "UnMatchedProjectEnvDeployError";
  }
}
