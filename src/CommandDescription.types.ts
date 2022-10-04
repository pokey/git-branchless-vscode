type CommandArgType = "revset" | "commitish";

export interface CommandArgDescription {
  key: string;
  type: CommandArgType;
  flag: string;
  description: string;
}

export interface CommandDescription {
  id: string;
  name: string;
  command: string;
  noLog?: boolean;
  args: CommandArgDescription[];
}
