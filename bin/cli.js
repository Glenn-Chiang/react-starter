#!/usr/bin/env node
/* eslint-disable no-undef */

import path from "path";
import fs from "fs";
import child_process from "child_process";
import ora from "ora";
import { promisify } from "util";

const exec = promisify(child_process.exec);
const rm = promisify(fs.rm);

const packageName = "@glenn_chiang/react-starter";

// Ensure that user chooses a project name via command line argument
if (process.argv.length < 3) {
  console.log("Please provide a name for your project");
  console.log(`e.g. npx ${packageName} my-app`);
  process.exit(1);
}
const projectName = process.argv[2];
const projectPath = path.join(process.cwd(), projectName);
const git_repo = "https://github.com/Glenn-Chiang/react-starter.git";

if (fs.existsSync(projectPath)) {
  console.log(
    `The current directory already contains a subdirectory named ${projectName}`
  );
  console.log("Please choose a different name for your project");
  process.exit(1);
} else {
  fs.mkdirSync(projectPath);
}

async function main() {
  try {
    // Clone git repo
    const gitSpinner = ora("Downloading files...").start();
    await promisify(child_process.exec)(
      `git clone --depth 1 ${git_repo} ${projectPath}`
    );
    gitSpinner.succeed();

    const cleanSpinner = ora("Cleaning up...").start();
    // Remove this CLI script
    await rm(path.join(projectPath, "bin"), { recursive: true, force: true });
    // Remove git history
    await rm(path.join(projectPath, ".git"), { recursive: true, force: true });
    // Remove unnecessary dependencies
    process.chdir(projectPath);
    await exec("npm uninstall ora");
    cleanSpinner.succeed();

    console.log("Your project has been created!");
    console.log("You can now run your app with:")
    console.log(`    cd ${projectName}`)
    console.log('    npm install')
    console.log('    npm run dev')
  } catch (error) {
    // Delete project if failed to build
    fs.rmSync(projectPath, { recursive: true, force: true });
    console.log(error);
    process.exit(1);
  }
}

main();
