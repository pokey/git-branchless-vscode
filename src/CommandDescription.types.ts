import { z } from "zod";

export interface ParamHandler<T> {
  schema: z.ZodType<T>;
  handleMissing(): Promise<T>;
}

export interface CommandDescription {
  id: string;
  run(rawArg?: unknown): void;
}
