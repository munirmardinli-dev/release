# @munirmardinli-dev/release 🚀

**Automated Release Workflow Toolkit**

[![npm](https://img.shields.io/npm/v/@munirmardinli-dev/release)](https://github.com/munirmardinli-dev/release/pkgs/npm/release)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/lang-typescript-3178C6.svg)](https://www.typescriptlang.org/)

## Description

`@munirmardinli-dev/release` is a robust toolkit that automates the entire release process for your **Node.js** and **TypeScript** projects. It leverages the power of `semantic-release` and related plugins to manage package versioning, automatically create a **changelog**, and enable integration with **GitHub** and **CI/CD** pipelines.

This package is ideal for teams and individual developers who want to ensure a consistent and reliable deployment workflow without having to manage version numbers manually.

## Key Features

- **Automated Versioning**: Automatically increments major, minor, or patch versions based on your Git commit messages.
- **Changelog Generation**: Creates and updates a `CHANGELOG.md` with the details of each new version.
- **CI/CD Integration**: Pre-configured support for GitHub Actions and other CI environments.
- **Customizable Configuration**: Allows easy modification of branches, plugins, and release rules.
- **Intuitive API**: Provides a simple programming interface for initializing and managing the release process in your scripts.

---

## Installation

Install the package in your project:

```bash
npm install @munirmardinli-dev/release --save-dev
# or
yarn add @munirmardinli-dev/release --dev
```

## Usage

1. Basic Configuration

The package uses a default .releaserc configuration that you can use directly in your project. Simply run a script that initializes the ReleaseAutomation class to load the default configuration.

2. Usage Example

Here's an example of how you can use the ReleaseAutomation class in your own script to control the release process:

```typescript
import { ReleaseAutomation } from "@munirmardinli-dev/release";

async function runRelease() {
  const releaseManager = new ReleaseAutomation();

  // Load the default configuration or an existing .releaserc file
  await releaseManager.initialize();

  // Example: Add an additional release branch
  releaseManager.addBranch({ name: "next", prerelease: true });

  // Example: Change the commit message of the Git plugin
  releaseManager.updatePluginConfig("@semantic-release/git", {
    message: "chore(release): ${nextRelease.version} [skip ci]",
  });

  // Example: Output configuration as JSON
  console.log(
    "Current configuration:",
    JSON.stringify(releaseManager.getConfig(), null, 2),
  );

  // Write the configuration to the .releaserc file
  await releaseManager.writeConfigToFile();
}

runRelease();
```

3. CI/CD Workflow

For use in a CI environment, such as GitHub Actions, you can set up a job that runs the semantic-release command. Your project's package.json already contains the necessary dependencies to support this.

A minimal GitHub Actions workflow could look like this:

```yaml
# .github/workflows/release.yml

name: Release

on:
  push:
    branches:
      - main
      - develop

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Important: History must be complete for semantic-release

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Run semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # Required to authenticate with GitHub
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }} # optional, if you want to publish to npm registry
        run: npx semantic-release
```

## Configuration

By default, the tool is pre-configured with the following branches and plugins:

- Branches: main, develop, feature/\*
- Plugins:
  - `@semantic-release/commit-analyzer` (with conventionalcommits preset and release rules for common commit types like fix, feat, chore, docs, perf, refactor, and test).
  - `@semantic-release/release-notes-generator`
  - `@semantic-release/changelog`
  - `@semantic-release/github`
  - `@semantic-release/git` (commit-assets: `CHANGELOG.md`, `package.json`)

You can customize this configuration by creating a `.releaserc` file in the root directory of your project.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
