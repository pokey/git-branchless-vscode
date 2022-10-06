import { toPairs } from "lodash";
import { z } from "zod";
import { CommandParam } from "../CommandDescription.types";
import { UserCanceledError } from "../paramHandlers";
import { parseOrDisplayError } from "../parseOrDisplayError";

function constructParamSchema(params: Record<string, CommandParam<any>>) {
  return z
    .object(
      Object.fromEntries(
        toPairs(params).map(([key, { schema }]) => [key, schema.optional()])
      )
    )
    .strict()
    .optional();
}

export type ParamMap<T extends Record<string, any>> = {
  [P in keyof T]: CommandParam<T[P]>;
};

export default async function handleCommandArg<T extends Record<string, any>>(
  params: ParamMap<T>,
  rawArg: unknown
): Promise<T | undefined> {
  const schema = constructParamSchema(params);
  const parsed = parseOrDisplayError(schema, rawArg) ?? {};

  const ret: Partial<T> = {};

  try {
    for (const [key, { handleMissing }] of toPairs(params)) {
      ret[key as keyof T] = parsed[key] ?? (await handleMissing());
    }
  } catch (err) {
    if (err instanceof UserCanceledError) {
      return undefined;
    }

    throw err;
  }

  return ret as T;
}
