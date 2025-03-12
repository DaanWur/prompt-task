export class RegistrationException extends Error {
  constructor(message: string = 'The following user could not be registered') {
    super(message);
    this.name = 'RegistrationException';
  }
}
