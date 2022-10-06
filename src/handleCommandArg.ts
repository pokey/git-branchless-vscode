import { toPairs } from "lodash";
import { z } from "zod";
import {
  CommandParam,
  InferArgType,
  ParamMap,
} from "./CommandDescription.types";
import { UserCanceledError } from "./paramHandlers";
import { parseOrDisplayError } from "./parseOrDisplayError";

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

export default async function handleCommandArg<T extends ParamMap>(
  params: T,
  rawArg: unknown
): Promise<InferArgType<T> | undefined> {
  const schema = constructParamSchema(params);
  const parsed = parseOrDisplayError(schema, rawArg) ?? {};

  const ret: Partial<InferArgType<T>> = {};

  try {
    for (const [key, { handleMissing, transformer }] of toPairs(params)) {
      const parsedValue = parsed[key];
      ret[key as keyof T] =
        parsedValue == null
          ? await handleMissing()
          : transformer == null
          ? parsedValue
          : await transformer(parsedValue);
    }
  } catch (err) {
    if (err instanceof UserCanceledError) {
      return undefined;
    }

    throw err;
  }

  return ret as InferArgType<T>;
}
