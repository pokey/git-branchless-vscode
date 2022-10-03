import { toPairs } from "lodash";
import * as vscode from "vscode";
import { z, ZodError } from "zod";

export function parseOrDisplayError<T>(
  schema: z.ZodType<T>,
  value: unknown
): T {
  try {
    return schema.parse(value);
  } catch (e) {
    const error = e as ZodError;

    const { formErrors, fieldErrors } = error.flatten();

    formErrors.forEach((message) => {
      vscode.window.showErrorMessage(message);
    });

    toPairs(fieldErrors).forEach(([key, messages]) => {
      if (messages == null) {
        return;
      }

      messages.forEach((message) => {
        vscode.window.showErrorMessage(`Error on key '${key}': ${message}`);
      });
    });
    throw error;
  }
}
