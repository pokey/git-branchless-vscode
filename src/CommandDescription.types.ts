import { z } from "zod";

export interface CommandParam<T, U = T> {
  schema: z.ZodType<T>;
  transformer?(raw: T): Promise<U>;
  handleMissing(): Promise<U>;
}

export type ParamMap = Record<string, CommandParam<any, any>>;

export type InferArgType<T> = {
  [P in keyof T]: T[P] extends CommandParam<any, infer V> ? V : never;
};

export interface CommandDescription<T extends ParamMap> {
  id: string;
  params: T;
  run(arg: InferArgType<T>): Promise<unknown>;
}
