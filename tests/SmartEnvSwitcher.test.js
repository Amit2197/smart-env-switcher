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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const SmartEnvSwitcher_1 = __importDefault(require("../src/SmartEnvSwitcher"));
// Define the path to mock environment files
const mockEnvDir = path.join(__dirname, 'mock-envs');
describe('SmartEnvSwitcher', () => {
    let envSwitcher;
    beforeEach(() => {
        // Initialize SmartEnvSwitcher with mock environment directory
        envSwitcher = new SmartEnvSwitcher_1.default(mockEnvDir, 'development');
    });
    test('should load environment variables from the default environment', () => {
        expect(envSwitcher.get('API_KEY')).toBe('dev123');
        expect(envSwitcher.get('DB_HOST')).toBe('localhost');
        expect(envSwitcher.get('DEBUG')).toBe('true');
    });
    test('should switch to another environment and load variables', () => {
        envSwitcher.switchEnv('production');
        expect(envSwitcher.get('API_KEY')).toBe('prod456');
        expect(envSwitcher.get('DB_HOST')).toBe('prod-db.example.com');
        expect(envSwitcher.get('DEBUG')).toBe('false');
    });
    test('should set a new environment variable and persist it', () => {
        envSwitcher.set('NEW_VARIABLE', 'new_value');
        expect(envSwitcher.get('NEW_VARIABLE')).toBe('new_value');
        // Verify the change is persisted in the environment file
        const envContent = fs.readFileSync(path.join(mockEnvDir, 'development.env'), 'utf8');
        expect(envContent).toContain('NEW_VARIABLE=new_value');
    });
    test('should list all loaded environment variables', () => {
        const vars = envSwitcher.list();
        expect(vars).toEqual({
            API_KEY: 'dev123',
            DB_HOST: 'localhost',
            DEBUG: 'true',
        });
    });
    test('should throw an error if the environment file is missing', () => {
        expect(() => envSwitcher.switchEnv('nonexistent')).toThrow("Environment file 'tests/mock-envs/nonexistent.env' not found.");
    });
});
