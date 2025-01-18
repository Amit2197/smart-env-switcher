"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * SmartEnvSwitcher Class
 * A lightweight library for managing environment files in Node.js.
 */
class SmartEnvSwitcher {
    envDir;
    currentEnv;
    envVariables;
    /**
     * Initialize the environment switcher
     * @param envDir - Path to the directory containing environment files
     * @param defaultEnv - The default environment to load
     */
    constructor(envDir, defaultEnv) {
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
    loadEnv(envName) {
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
    parseEnvContent(content) {
        const variables = {};
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
    get(key) {
        return this.envVariables[key] || null;
    }
    /**
     * Set or update an environment variable
     * @param key - Name of the variable
     * @param value - Value to assign to the variable
     */
    set(key, value) {
        this.envVariables[key] = value;
        this.saveEnv();
    }
    /**
     * Persist the environment variables to the current environment file
     */
    saveEnv() {
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
    switchEnv(envName) {
        this.loadEnv(envName);
        this.currentEnv = envName;
    }
    /**
     * List all loaded environment variables
     * @returns Record of all variables in the current environment
     */
    list() {
        return this.envVariables;
    }
    /**
     * Clear all environment variables and persist the changes
     */
    clearEnv() {
        this.envVariables = {}; // Clear all variables
        this.saveEnv(); // Save changes to the current environment file
    }
    /**
   * Remove an environment variable
   * @param key - Name of the variable to remove
   */
    remove(key) {
        if (this.envVariables[key]) {
            delete this.envVariables[key];
            this.saveEnv();
        }
        else {
            throw new Error(`Variable '${key}' does not exist.`);
        }
    }
    /**
     * List all available environments
     * @returns {Array} An array of available environment names.
     */
    listEnvironments() {
        try {
            const files = fs.readdirSync(this.envDir);
            return files
                .filter((file) => file.endsWith('.env')) // Filter only .env files
                .map((file) => path.basename(file, '.env')); // Remove the .env extension
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to list environment files: ${error.message}`);
            }
            else {
                throw new Error('An unknown error occurred while listing environment files');
            }
        }
    }
}
exports.default = SmartEnvSwitcher;
