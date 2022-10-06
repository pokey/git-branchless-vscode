import { z } from "zod";

export interface CommandParam<T> {
  schema: z.ZodType<T>;
  handleMissing(): Promise<T>;
}

type ParamMap<T extends Record<string, any>> = {
  [P in keyof T]: CommandParam<T[P]>;
};

export type InferArgType<T> = {
  [P in keyof T]: T[P] extends CommandParam<infer V> ? V : never;
};

export interface CommandDescription<T extends Record<string, any>> {
  id: string;
  params: ParamMap<T>;
  run(arg: T): Promise<unknown>;
}
