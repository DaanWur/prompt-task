export class FailedPromptCreation extends Error {
  constructor(message: string = 'Prompt could not be created') {
    super(message);
    this.name = 'FailedPromptCreation';
  }
}
