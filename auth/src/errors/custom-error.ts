export default abstract class CustomError extends Error {
  // In TS, you have to add the abstract keyword
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
    // Only because we are extending a builtin class
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  // This is how we define abstract methods in TS, the signature
  // looks gross because TS, but it's pretty straightforward
  abstract serializeErrors(): { message: string; field?: string }[];
}
