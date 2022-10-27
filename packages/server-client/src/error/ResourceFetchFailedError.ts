export class ResourceFetchFailedError extends Error {
  constructor(props) {
    super(props);
    this.name = "ResourceFetchFailedError";
  }
}
