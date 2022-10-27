export class InvalidPreviewError extends Error {
  constructor(props) {
    super(props);
    this.name = "InvalidPreviewError";
  }
}
