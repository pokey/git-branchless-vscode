import BranchlessCommand from "../BranchlessCommand";

const branchlessSubmit = new BranchlessCommand(
  "submit",
  "submit",
  {},
  { logAfter: false, noConfirmation: true }
);

export default branchlessSubmit;
