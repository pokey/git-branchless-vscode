import Git from "./Git";

export default async function processBranchParam(git: Git, raw: string) {
  switch (raw) {
    case ".":
      return git.getCurrentBranch();
    case "main()":
      return git.getMainBranch();
    default:
      return raw;
  }
}
