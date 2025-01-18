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
const mockEnvDir = path.join(__dirname, 'mock-envs');
describe('SmartEnvSwitcher', () => {
    let envSwitcher;
    beforeEach(() => {
        // Clean and reset mock environment files
        const developmentEnvPath = path.join(mockEnvDir, 'development.env');
        const productionEnvPath = path.join(mockEnvDir, 'production.env');
        fs.writeFileSync(developmentEnvPath, 'API_KEY=dev123\nDB_HOST=localhost\nDEBUG=true\n', 'utf8');
        fs.writeFileSync(productionEnvPath, 'API_KEY=prod456\nDB_HOST=prod-db.example.com\nDEBUG=false\n', 'utf8');
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
        expect(() => envSwitcher.switchEnv('nonexistent')).toThrow(`Environment file '${path.join(mockEnvDir, 'nonexistent.env')}' not found.`);
    });
    test('should treat environment variable names as case-sensitive', () => {
        envSwitcher.set('api_key', 'value1');
        envSwitcher.set('API_KEY', 'value2');
        expect(envSwitcher.get('api_key')).toBe('value1');
        expect(envSwitcher.get('API_KEY')).toBe('value2');
    });
    test('should overwrite the value of an existing environment variable', () => {
        envSwitcher.set('API_KEY', 'new_value');
        expect(envSwitcher.get('API_KEY')).toBe('new_value');
    });
    test('should switch back to the original environment', () => {
        envSwitcher.switchEnv('production');
        expect(envSwitcher.get('API_KEY')).toBe('prod456');
        envSwitcher.switchEnv('development');
        expect(envSwitcher.get('API_KEY')).toBe('dev123');
    });
    test('should handle malformed environment files gracefully', () => {
        fs.writeFileSync(path.join(mockEnvDir, 'malformed.env'), `
        API_KEY
        DB_HOST=localhost=
        =DEBUG=true
      `, 'utf8');
        expect(() => envSwitcher.switchEnv('malformed')).toThrow();
    });
    test('should handle empty .env files', () => {
        fs.writeFileSync(path.join(mockEnvDir, 'empty.env'), '', 'utf8');
        envSwitcher.switchEnv('empty');
        expect(envSwitcher.list()).toEqual({});
    });
    test('should persist only changed variables', () => {
        envSwitcher.set('NEW_VAR', 'new_value');
        const envContent = fs.readFileSync(path.join(mockEnvDir, 'development.env'), 'utf8');
        expect(envContent).toContain('NEW_VAR=new_value');
        expect(envContent).toContain('API_KEY=dev123');
        expect(envContent).toContain('DB_HOST=localhost');
    });
    test('should load variables with special characters', () => {
        fs.writeFileSync(path.join(mockEnvDir, 'special.env'), `
        PASSWORD=pa$$w0rd!
        DB_CONN=postgres://user:pass@localhost:5432/dbname
      `, 'utf8');
        envSwitcher.switchEnv('special');
        expect(envSwitcher.get('PASSWORD')).toBe('pa$$w0rd!');
        expect(envSwitcher.get('DB_CONN')).toBe('postgres://user:pass@localhost:5432/dbname');
    });
    test('should handle switching to an environment with no variables', () => {
        fs.writeFileSync(path.join(mockEnvDir, 'empty-vars.env'), '', 'utf8');
        envSwitcher.switchEnv('empty-vars');
        expect(envSwitcher.list()).toEqual({});
    });
    test('should remove an environment variable', () => {
        envSwitcher.set('TO_BE_REMOVED', 'value');
        expect(envSwitcher.get('TO_BE_REMOVED')).toBe('value');
        envSwitcher.remove('TO_BE_REMOVED');
        expect(envSwitcher.get('TO_BE_REMOVED')).toBeNull();
        const envContent = fs.readFileSync(path.join(mockEnvDir, 'development.env'), 'utf8');
        expect(envContent).not.toContain('TO_BE_REMOVED');
    });
});
