import { z } from "zod";
import { CommandParam } from "../BaseCommandDescription.types";
import { workspace } from "vscode";

/**
 * A command parameter that defaults to using workspace configuration.
 */
export default class ConfigurationParam<T> implements CommandParam<T> {
  constructor(
    public schema: z.ZodType<T>,
    public name: string,
    public defaultValue: T
  ) {
    this.handleMissing = this.handleMissing.bind(this);
  }

  async handleMissing(): Promise<T> {
    return (
      workspace.getConfiguration("git-branchless").get<T>("branchPrefix") ??
      this.defaultValue
    );
  }
}
