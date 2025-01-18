import * as fs from "fs";
import * as path from "path";

/**
 * SmartEnvSwitcher Class
 * A lightweight library for managing environment files in Node.js.
 */
class SmartEnvSwitcher {
  private envDir: string;
  private currentEnv: string;
  private envVariables: Record<string, string>;

  /**
   * Initialize the environment switcher
   * @param envDir - Path to the directory containing environment files
   * @param defaultEnv - The default environment to load
   */
  constructor(envDir: string, defaultEnv: string) {
    if (!fs.existsSync(envDir)) {
      throw new Error(`Directory '${envDir}' does not exist.`);
    }
    this.envDir = envDir;
    this.currentEnv = defaultEnv;
    this.envVariables = {};
    this.loadEnv(defaultEnv);
  }

  /**
   * Load and parse the specified environment file
   * @param envName - Name of the environment (without `.env`)
   */
  private loadEnv(envName: string): void {
    const envFilePath = path.join(this.envDir, `${envName}.env`);
    if (!fs.existsSync(envFilePath)) {
      throw new Error(`Environment file '${envFilePath}' not found.`);
    }

    const envContent = fs.readFileSync(envFilePath, "utf8");
    this.envVariables = this.parseEnvContent(envContent);
  }

  /**
   * Parse environment file content into key-value pairs
   * @param content - Raw content of the environment file
   * @returns Record of key-value pairs
   */
  private parseEnvContent(content: string): Record<string, string> {
    const variables: Record<string, string> = {};
    content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.trim() && !line.startsWith("#"))
      .forEach((line) => {
        const [key, value] = line.split("=");
        console.log(key, value);
        if (!key || value === undefined) {
          
          throw new Error(`Malformed line in environment file: "${line}"`);
        }
        variables[key.trim()] = value.trim();
      });
    return variables;
  }

  /**
   * Get the value of an environment variable
   * @param key - Name of the variable
   * @returns The value or `null` if not found
   */
  public get(key: string): string | null {
    return this.envVariables[key] || null;
  }

  /**
   * Set or update an environment variable
   * @param key - Name of the variable
   * @param value - Value to assign to the variable
   */
  public set(key: string, value: string): void {
    this.envVariables[key] = value;
    this.saveEnv();
  }

  /**
   * Persist the environment variables to the current environment file
   */
  private saveEnv(): void {
    const envFilePath = path.join(this.envDir, `${this.currentEnv}.env`);
    const content = Object.entries(this.envVariables)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    fs.writeFileSync(envFilePath, content, "utf8");
  }

  /**
   * Switch to a different environment
   * @param envName - Name of the environment (without `.env`)
   */
  public switchEnv(envName: string): void {
    this.loadEnv(envName);
    this.currentEnv = envName;
  }

  /**
   * List all loaded environment variables
   * @returns Record of all variables in the current environment
   */
  public list(): Record<string, string> {
    return this.envVariables;
  }


  /**
   * Clear all environment variables and persist the changes
   */
  public clearEnv(): void {
    this.envVariables = {}; // Clear all variables
    this.saveEnv(); // Save changes to the current environment file
  }

  /**
 * Remove an environment variable
 * @param key - Name of the variable to remove
 */
  public remove(key: string): void {
    if (this.envVariables[key]) {
      delete this.envVariables[key];
      this.saveEnv();
    } else {
      throw new Error(`Variable '${key}' does not exist.`);
    }
  }

  /**
   * List all available environments
   * @returns {Array} An array of available environment names.
   */
  public listEnvironments(): string[] {
    try {
      const files = fs.readdirSync(this.envDir);
      return files
        .filter((file) => file.endsWith('.env'))  // Filter only .env files
        .map((file) => path.basename(file, '.env'));  // Remove the .env extension
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to list environment files: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred while listing environment files');
      }
    }
  }
  
  
}

export default SmartEnvSwitcher;
