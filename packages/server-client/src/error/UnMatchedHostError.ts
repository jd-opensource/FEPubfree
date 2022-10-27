export class UnMatchedHostError extends Error {
  constructor(props) {
    super(props);
    this.name = "UnMatchedHostError";
  }
}
