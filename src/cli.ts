#!/usr/bin/env node
import { ReleaseAutomation } from "./index.js";
import process from "node:process";

const release = new ReleaseAutomation();
const args = process.argv.slice(2);

async function main() {
  const command = args[0];
  const options = {
    ci: args.includes("--ci"),
    dryRun: args.includes("--dry-run"),
  };

  switch (command) {
    case "init":
      await release.setupReleaseProcess();
      console.log("Release configuration initialized");
      break;

    case "run":
      release.setOptions(options);
      console.log(`Executing: ${release.getCommand()}`);
      await import("semantic-release").then(({ default: semanticRelease }) => {
        return semanticRelease({
          ...release.getConfig(),
          ci: options.ci,
          dryRun: options.dryRun,
        });
      });
      break;

    case "add-branch":
      if (!args[1]) {
        console.error("Error: Branch name is required");
        process.exit(1);
      }
      release.addBranch(args[1]);
      await release.writeConfigToFile();
      console.log(`Added branch: ${args[1]}`);
      break;

    case "remove-branch":
      if (!args[1]) {
        console.error("Error: Branch name is required");
        process.exit(1);
      }
      release.removeBranch(args[1]);
      await release.writeConfigToFile();
      console.log(`Removed branch: ${args[1]}`);
      break;

    case "--help":
    case "-h":
      printHelp();
      break;

    case "--version":
    case "-v":
      console.log("munir-release v0.0.7");
      break;

    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      process.exit(1);
  }
}

function printHelp() {
  console.log(`
Usage: munir-release <command> [options]

Commands:
  init               Initialize release configuration
  run                Run the release process
  add-branch <name>  Add a branch to release configuration
  remove-branch <name> Remove a branch from release configuration

Options:
  --ci               Run in CI mode
  --dry-run          Run in dry-run mode
  -h, --help         Show help
  -v, --version      Show version
`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
