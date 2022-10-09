export interface CommitInfo {
  hash: string;
  authorName: string;
  date: Date;
  subject: string;
  refNames: string[];
}

export default class Commit {
  constructor(private info: CommitInfo) {}

  get hash(): string {
    return this.info.hash;
  }

  get authorName(): string {
    return this.info.authorName;
  }

  get date(): Date {
    return this.info.date;
  }

  get subject(): string {
    return this.info.subject;
  }

  get refNames(): string[] {
    return this.info.refNames;
  }

  /**
   * `true` if this commit is currently checked out
   */
  get isHead(): boolean {
    return this.info.refNames.includes("HEAD");
  }
}
