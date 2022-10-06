import { mapValues, toPairs } from "lodash";
import * as vscode from "vscode";
import { z } from "zod";
import { CommandDescription, CommandParam } from "./CommandDescription.types";
import { ParamMap } from "./commands/handleCommandArg";
import { DefaultValueParam } from "./paramHandlers";

interface BranchlessCommandParam {
  paramHandler: CommandParam<any>;
  flag: string;
}

interface Options {
  logAfter?: boolean;
  noConfirmation?: boolean;
}

interface CoreArgs {
  noConfirmation: boolean;
}
type BranchlessArgs = Record<string, any>;

type ArgType = CoreArgs & BranchlessArgs;
type ParamType = ParamMap<ArgType>;

let terminal: vscode.Terminal | undefined = undefined;

export default class BranchlessCommand implements CommandDescription<ArgType> {
  public params: ParamType;

  constructor(
    public id: string,
    private command: string,
    private branchlessParams: Record<string, BranchlessCommandParam>,
    private options: Options = {}
  ) {
    this.run = this.run.bind(this);

    const { noConfirmation = false } = this.options;

    const coreParams: ParamMap<CoreArgs> = {
      noConfirmation: new DefaultValueParam(z.boolean(), noConfirmation),
    };
    const branchlessParamMap: ParamMap<BranchlessArgs> = mapValues(
      this.branchlessParams,
      ({ paramHandler }) => paramHandler
    );

    this.params = {
      ...coreParams,
      ...branchlessParamMap,
    };
  }

  async run({ noConfirmation, ...commandArgs }: ArgType) {
    const commandArgString = toPairs(this.branchlessParams)
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
