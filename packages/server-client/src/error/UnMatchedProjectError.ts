export class UnMatchedProjectError extends Error {
  constructor(props) {
    super(props);
    this.name = "UnMatchedProjectError";
  }
}
