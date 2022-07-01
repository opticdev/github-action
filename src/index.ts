import * as core from "@actions/core";
import * as exec from "@actions/exec";

const token = core.getInput("token");
const base = core.getInput("base");

async function execCommand(
  ...args: Parameters<typeof exec.exec>
): Promise<boolean> {
  try {
    await exec.exec(...args);
    return true;
  } catch (e) {
    if (e instanceof Error) {
      core.error(e);
    }

    return false;
  }
}

async function runAction(): Promise<void> {
  const valid = await verifyInput();
  if (!valid) {
    return process.exit(1);
  }

  const installed = await install();
  if (!installed) {
    return process.exit(1);
  }
  if (!(await checkoutBaseBranch())) {
    return process.exit(1);
  }

  const contextCreated = await createContext();

  if (!contextCreated) {
    return process.exit(1);
  }

  const comparisonRun = await runComparison();

  if (!comparisonRun) {
    return process.exit(1);
  }
}

async function verifyInput(): Promise<boolean> {
  if (!token) {
    core.error(
      "No token was provided. You can generate a token through our app at https://app.useoptic.com"
    );
    return false;
  }

  return true;
}

async function checkoutBaseBranch(): Promise<boolean> {
  const baseBranch = base;
  // Fetch the base branch
  if (
    !(await execCommand(`git fetch --no-tags --depth=1 origin ${baseBranch}`))
  ) {
    return false;
  }
  // create branch if not created locally
  // if this fails, we've already got a base branch, so we can ignore the failure
  try {
    await exec.exec(`git branch ${baseBranch}`);
    // eslint-disable-next-line no-empty
  } catch (e) {}

  return true;
}

async function install() {
  core.info("Installing optic-ci");
  return execCommand("npm", [
    "install",
    "--location=global",
    "@useoptic/optic-ci",
  ]);
}

async function createContext(): Promise<boolean> {
  core.info("Generating context file");
  return execCommand("optic-ci", [
    "create-github-context",
    "--provider=github",
  ]);
}

async function runComparison(): Promise<boolean> {
  core.info("Running Optic compare");

  return execCommand("optic-ci", ["run", `--base=${base}`], {
    env: {
      ...process.env,
      OPTIC_TOKEN: token,
    },
  });
}

runAction()
  .then(() => {
    return process.exit(0);
  })
  .catch(() => {
    return process.exit(1);
  });
