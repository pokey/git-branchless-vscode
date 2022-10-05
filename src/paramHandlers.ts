import * as vscode from "vscode";
import { z } from "zod";
import { ParamHandler } from "./CommandDescription.types";

export class UserCanceledError extends Error {
  constructor() {
    super("User canceled input");
  }
}

export class RevsetHandler implements ParamHandler<string> {
  schema = z.string();

  constructor(private message: string) {
    this.handleMissing = this.handleMissing.bind(this);
  }

  async handleMissing(): Promise<string> {
    const value = await vscode.window.showInputBox({ prompt: this.message });

    if (value == null) {
      throw new UserCanceledError();
    }

    return value;
  }
}

export class CommitishHandler implements ParamHandler<string> {
  schema = z.string();

  constructor(private message: string) {
    this.handleMissing = this.handleMissing.bind(this);
  }

  async handleMissing(): Promise<string> {
    const value = await vscode.window.showInputBox({ prompt: this.message });

    if (value == null) {
      throw new UserCanceledError();
    }

    return value;
  }
}

export class DefaultHandler<T> implements ParamHandler<T> {
  constructor(public schema: z.ZodType<T>, public defaultValue: T) {
    this.handleMissing = this.handleMissing.bind(this);
  }

  async handleMissing(): Promise<T> {
    return this.defaultValue;
  }
}
