export default class UserCanceledError extends Error {
  constructor() {
    super("User canceled input");
  }
}
