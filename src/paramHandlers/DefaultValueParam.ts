import { z } from "zod";
import { CommandParam } from "../BaseCommandDescription.types";

export default class DefaultValueParam<T> implements CommandParam<T> {
  constructor(public schema: z.ZodType<T>, public defaultValue: T) {
    this.handleMissing = this.handleMissing.bind(this);
  }

  async handleMissing(): Promise<T> {
    return this.defaultValue;
  }
}
