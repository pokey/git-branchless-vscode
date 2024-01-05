import slugify from "slugify";
import { z } from "zod";
import { GitCommandDescription } from "../CommandDescription.types";
import { RevsetParam } from "../paramHandlers";
import ConfigurationParam from "../paramHandlers/ConfigurationParam";

const params = {
  revset: new RevsetParam(
    "A revset specifying the commits to add branch names to"
  ),
  prefix: new ConfigurationParam(z.string(), "branchPrefix", ""),
};

const autoBranch: GitCommandDescription<typeof params> = {
  id: "custom.autoBranch",
  params,
  async run({ revset, git, prefix }) {
    const commits = await git.query(`(${revset}) - branches()`);

    for (const { hash, subject, isHead } of commits) {
      const branchName =
        prefix + slugify(subject, { lower: true, strict: true });

      await git.branch(branchName, hash);

      if (isHead) {
        await git.switch(branchName);
      }
    }

    await git.showLog();
  },
};

export default autoBranch;
