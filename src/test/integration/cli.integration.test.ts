/**
 * CLI Integration Tests
 * Tests the complete CLI workflows end-to-end
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

describe("CLI Integration Tests", () => {
  let testDir: string;

  beforeEach(() => {
    // Create temporary test directory
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), "sda-cli-test-"));
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe("analyze command", () => {
    it("should analyze a simple project with dependencies", () => {
      // Create a test package.json
      const packageJson = {
        name: "test-project",
        version: "1.0.0",
        dependencies: {
          lodash: "4.17.21",
        },
      };

      fs.writeFileSync(
        path.join(testDir, "package.json"),
        JSON.stringify(packageJson, null, 2),
      );

      // Run analyze command
      const output = execSync(
        `node dist/cli/index.js analyze ${testDir} --output json --silent`,
        { encoding: "utf-8", cwd: process.cwd() },
      );

      expect(output).toBeTruthy();

      // Filter out log lines and parse JSON output
      // Logger output is structured JSON, actual result is also JSON
      // Find the last complete JSON object (starts with { and contains "packages")
      const lines = output.split("\n").filter((line) => line.trim());
      const jsonLine = lines.find(
        (line) => line.trim().startsWith("{") && line.includes('"packages"'),
      );
      expect(jsonLine).toBeTruthy();
      const result = JSON.parse(jsonLine!);

      expect(result).toHaveProperty("packages");
      expect(result).toHaveProperty("vulnerabilities");
      expect(result.packages.length).toBeGreaterThan(0);
    }, 30000);

    it("should handle projects with no dependencies", () => {
      // Create a test package.json with no dependencies
      const packageJson = {
        name: "empty-project",
        version: "1.0.0",
      };

      fs.writeFileSync(
        path.join(testDir, "package.json"),
        JSON.stringify(packageJson, null, 2),
      );

      // Run analyze command
      const output = execSync(
        `node dist/cli/index.js analyze ${testDir} --output json --silent`,
        { encoding: "utf-8", cwd: process.cwd() },
      );

      // Filter out log lines and parse JSON output
      const lines = output.split("\n").filter((line) => line.trim());
      const jsonLine = lines.find(
        (line) => line.trim().startsWith("{") && line.includes('"packages"'),
      );
      expect(jsonLine).toBeTruthy();
      const result = JSON.parse(jsonLine!);

      expect(result).toHaveProperty("packages");
      expect(result.packages.length).toBe(1); // Just the project itself
    }, 30000);

    it("should support --include-dev flag", () => {
      const packageJson = {
        name: "dev-test-project",
        version: "1.0.0",
        dependencies: {
          lodash: "4.17.21",
        },
        devDependencies: {
          jest: "29.0.0",
        },
      };

      fs.writeFileSync(
        path.join(testDir, "package.json"),
        JSON.stringify(packageJson, null, 2),
      );

      const output = execSync(
        `node dist/cli/index.js analyze ${testDir} --include-dev --output json --silent`,
        { encoding: "utf-8", cwd: process.cwd() },
      );

      // Filter out log lines and parse JSON output
      const lines = output.split("\n").filter((line) => line.trim());
      const jsonLine = lines.find(
        (line) => line.trim().startsWith("{") && line.includes('"packages"'),
      );
      expect(jsonLine).toBeTruthy();
      const result = JSON.parse(jsonLine!);

      expect(result.packages.length).toBeGreaterThan(1);
    }, 30000);

    it("should save results to file when --save is used", () => {
      const packageJson = {
        name: "save-test",
        version: "1.0.0",
        dependencies: {
          lodash: "4.17.21",
        },
      };

      fs.writeFileSync(
        path.join(testDir, "package.json"),
        JSON.stringify(packageJson, null, 2),
      );

      const outputFile = path.join(testDir, "results.json");

      execSync(
        `node dist/cli/index.js analyze ${testDir} --save ${outputFile} --silent`,
        { cwd: process.cwd() },
      );

      expect(fs.existsSync(outputFile)).toBe(true);

      const savedResults = JSON.parse(fs.readFileSync(outputFile, "utf-8"));
      expect(savedResults).toHaveProperty("packages");
    }, 30000);

    it("should handle invalid project paths gracefully", () => {
      const nonExistentPath = path.join(testDir, "does-not-exist");

      try {
        execSync(`node dist/cli/index.js analyze ${nonExistentPath} --silent`, {
          encoding: "utf-8",
          cwd: process.cwd(),
        });
        fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.status).not.toBe(0);
      }
    }, 30000);
  });

  describe("license command", () => {
    it("should generate license report in text format", () => {
      const packageJson = {
        name: "license-test",
        version: "1.0.0",
        license: "MIT",
        dependencies: {
          lodash: "4.17.21",
        },
      };

      fs.writeFileSync(
        path.join(testDir, "package.json"),
        JSON.stringify(packageJson, null, 2),
      );

      const output = execSync(
        `node dist/cli/index.js license ${testDir} --format text --silent`,
        { encoding: "utf-8", cwd: process.cwd() },
      );

      expect(output).toContain("License");
      expect(output).toBeTruthy();
    }, 30000);

    it("should generate license report in JSON format", () => {
      const packageJson = {
        name: "license-json-test",
        version: "1.0.0",
        license: "MIT",
        dependencies: {
          lodash: "4.17.21",
        },
      };

      fs.writeFileSync(
        path.join(testDir, "package.json"),
        JSON.stringify(packageJson, null, 2),
      );

      const output = execSync(
        `node dist/cli/index.js license ${testDir} --format json --silent`,
        { encoding: "utf-8", cwd: process.cwd() },
      );

      // Filter out log lines and parse JSON output
      const lines = output.split("\n").filter((line) => line.trim());
      const jsonLine = lines.find(
        (line) => line.trim().startsWith("{") && line.includes('"licenses"'),
      );
      expect(jsonLine).toBeTruthy();
      const result = JSON.parse(jsonLine!);
      expect(result).toHaveProperty("licenses");
    }, 30000);

    it("should save license report to file", () => {
      const packageJson = {
        name: "license-save-test",
        version: "1.0.0",
        license: "MIT",
        dependencies: {
          lodash: "4.17.21",
        },
      };

      fs.writeFileSync(
        path.join(testDir, "package.json"),
        JSON.stringify(packageJson, null, 2),
      );

      const outputFile = path.join(testDir, "licenses.txt");

      execSync(
        `node dist/cli/index.js license ${testDir} --format text --output ${outputFile} --silent`,
        { cwd: process.cwd() },
      );

      expect(fs.existsSync(outputFile)).toBe(true);
      const content = fs.readFileSync(outputFile, "utf-8");
      expect(content).toBeTruthy();
    }, 30000);
  });

  describe("error handling", () => {
    it("should display help when no command is provided", () => {
      const output = execSync("node dist/cli/index.js --help", {
        encoding: "utf-8",
        cwd: process.cwd(),
      });

      expect(output).toContain("Usage:");
      expect(output).toContain("analyze");
      expect(output).toContain("license");
    });

    it("should handle invalid command gracefully", () => {
      try {
        execSync("node dist/cli/index.js invalid-command", {
          encoding: "utf-8",
          cwd: process.cwd(),
        });
        fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.status).not.toBe(0);
      }
    });

    it("should validate output format option", () => {
      const packageJson = {
        name: "validation-test",
        version: "1.0.0",
      };

      fs.writeFileSync(
        path.join(testDir, "package.json"),
        JSON.stringify(packageJson, null, 2),
      );

      try {
        execSync(
          `node dist/cli/index.js analyze ${testDir} --output invalid-format`,
          { encoding: "utf-8", cwd: process.cwd() },
        );
        fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.status).not.toBe(0);
      }
    });
  });
});
