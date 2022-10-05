import { mapValues, toPairs } from "lodash";
import * as vscode from "vscode";
import { z } from "zod";
import { CommandDescription, ParamHandler } from "./CommandDescription.types";
import handleCommandArg, { ParamMap } from "./commands/handleCommandArg";
import { DefaultHandler } from "./paramHandlers";

interface BranchlessCommandParam {
  paramHandler: ParamHandler<any>;
  flag: string;
}

interface Options {
  logAfter?: boolean;
  noConfirmation?: boolean;
}

interface CoreArgs {
  noConfirmation: boolean;
}

type ExtraArgs = Record<string, any>;

let terminal: vscode.Terminal | undefined = undefined;

export default class BranchlessCommand implements CommandDescription {
  private fullParams: ParamMap<CoreArgs> & ParamMap<ExtraArgs>;

  constructor(
    public id: string,
    private command: string,
    private params: Record<string, BranchlessCommandParam>,
    private options: Options = {}
  ) {
    this.run = this.run.bind(this);

    const { noConfirmation = false } = this.options;

    const coreParams: ParamMap<CoreArgs> = {
      noConfirmation: new DefaultHandler(z.boolean(), noConfirmation),
    };
    const extraParams: ParamMap<ExtraArgs> = mapValues(
      this.params,
      ({ paramHandler }) => paramHandler
    );

    this.fullParams = {
      ...coreParams,
      ...extraParams,
    };
  }

  async run(rawArg?: unknown) {
    const arg = await handleCommandArg(this.fullParams, rawArg);

    if (arg == null) {
      // User canceled
      return;
    }

    const { noConfirmation, ...commandArgs } = arg;
    const commandArgString = toPairs(this.params)
      .map(([key, { flag }]) => `${flag} '${commandArgs[key]}'`)
      .join(" ");
    if (terminal == null) {
      terminal = vscode.window.createTerminal({
        isTransient: true,
        name: "Git branchless",
      });
    }

    const showLogCommand = this.options.logAfter
      ? " && git-branchless smartlog"
      : "";

    terminal.sendText(
      `git-branchless ${this.command} ${commandArgString}${showLogCommand}`,
      noConfirmation
    );

    terminal.show();
  }
}
