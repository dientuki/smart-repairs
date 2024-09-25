export class GraphQLBusinessError extends Error {
  i18nKey: string;

  constructor(i18nKey: string, message?: string) {
    super(message || i18nKey);
    this.i18nKey = i18nKey;
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, GraphQLBusinessError.prototype);
  }
}
