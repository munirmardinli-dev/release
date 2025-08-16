import fs from "node:fs/promises";
import path from "node:path";

import type { Release } from "./types.js";

export class ReleaseAutomation {
  private defaultConfig: Release.Config = {
    branches: ["main", "develop", { name: "feature/*" }],
    plugins: [
      [
        "@semantic-release/commit-analyzer",
        {
          preset: "conventionalcommits",
          releaseRules: [
            { type: "chore", release: "patch" },
            { type: "docs", release: "patch" },
            { type: "perf", release: "patch" },
            { type: "refactor", release: "patch" },
            { type: "fix", release: "patch" },
            { type: "test", release: "patch" },
          ],
          parserOpts: {
            noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES"],
          },
        },
      ],
      "@semantic-release/release-notes-generator",
      "@semantic-release/changelog",
      "@semantic-release/github",
      [
        "@semantic-release/git",
        {
          assets: ["CHANGELOG.md", "package.json"],
          message:
            "chore(release): v${nextRelease.version} [skip ci]\n\n[skip ci]",
        },
      ],
    ],
  };

  private config: Release.Config;
  private options: Release.Options;

public setOptions(options: Partial<Release.Options>): void {
    this.options = { ...this.options, ...options };
  }
  constructor(options: Release.Options = {}) {
    this.options = options;
    this.config = options.config || { ...this.defaultConfig };
  }

  public async initialize(): Promise<void> {
    if (!this.options.config) {
      await this.loadConfigFromFile();
    }
  }

  private async loadConfigFromFile(): Promise<void> {
    try {
      const configPath = path.join(process.cwd(), ".releaserc");
      const configData = await fs.readFile(configPath, "utf-8");
      this.config = JSON.parse(configData);
    } catch (error) {
      console.warn("No .releaserc file found, using default configuration");
    }
  }

  public getConfig(): Release.Config {
    return this.config;
  }

  public updatePluginConfig(pluginName: string, newConfig: object): void {
    this.config.plugins = this.config.plugins.map((plugin) => {
      if (Array.isArray(plugin) && plugin[0] === pluginName) {
        return [pluginName, { ...(plugin[1] as object), ...newConfig }];
      }
      return plugin;
    });
  }

  public addBranch(branch: Release.Branch): void {
    const exists = this.config.branches.some((b) => {
      if (typeof b === "string" && typeof branch === "string") {
        return b === branch;
      }
      if (typeof b === "object" && typeof branch === "object") {
        return b.name === branch.name;
      }
      return false;
    });

    if (!exists) {
      this.config.branches = [...this.config.branches, branch];
    }
  }

  public removeBranch(branchName: string): void {
    this.config.branches = this.config.branches.filter((b) => {
      if (typeof b === "string") {
        return b !== branchName;
      }
      return b.name !== branchName;
    });
  }

  public async writeConfigToFile(): Promise<void> {
    const configPath = path.join(process.cwd(), ".releaserc");
    await fs.writeFile(configPath, JSON.stringify(this.config, null, 2));
  }

  public async setupReleaseProcess(): Promise<void> {
    await this.writeConfigToFile();
    console.log("Release configuration has been set up successfully.");
  }

  public getCommand(): string {
    const flags = [];
    if (this.options.ci) flags.push("--ci");
    if (this.options.dryRun) flags.push("--dry-run");
    return `semantic-release ${flags.join(" ")}`.trim();
  }
}
