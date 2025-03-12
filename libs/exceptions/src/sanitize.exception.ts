export class SanitizeException extends Error {
  constructor(message: string = 'Sanitization could not be completed') {
    super(message);
    this.name = 'SanitizeException';
  }
}
