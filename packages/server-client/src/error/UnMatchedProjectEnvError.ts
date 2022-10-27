export class UnMatchedProjectEnvError extends Error {
  constructor(props) {
    super(props);
    this.name = "UnMatchedProjectEnvError";
  }
}
