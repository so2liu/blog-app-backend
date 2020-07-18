class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

class PropertyRequiredError extends ValidationError {
  property: string;
  constructor(property: string) {
    super("No property: " + property);
    this.name = "PropertyRequiredError";
    this.property = property;
  }
}

class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export default { ValidationError, PropertyRequiredError, NotFoundError };
