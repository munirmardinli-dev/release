// Base interfaces
export interface ReleaseRule {
  type: string;
  release: "major" | "minor" | "patch" | false;
}

export interface ParserOpts {
  noteKeywords?: string[];
}

// Plugin-specific interfaces
export namespace PluginConfigs {
  export interface CommitAnalyzer {
    preset?: string;
    releaseRules?: ReleaseRule[];
    parserOpts?: ParserOpts;
  }

  export interface Git {
    assets?: string[];
    message?: string;
  }
}

// Main configuration interfaces
export namespace Release {
  export type Branch = string | { name: string };
  export type Plugin = string | [string, object];

  export interface Config {
    branches: Branch[];
    plugins: Plugin[];
  }

  export interface Options {
    config?: Config;
    ci?: boolean;
    dryRun?: boolean;
  }
}
