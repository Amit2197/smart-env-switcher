# SmartEnvSwitcher

SmartEnvSwitcher is a lightweight Node.js library for managing environment variables across multiple environments, such as development, staging, and production. It simplifies the process of switching between environments and updating `.env` files programmatically.

## Features
- Load and switch between multiple environment files.
- Add, update, or retrieve environment variables dynamically.
- Automatically save changes to `.env` files.
- List available environments in the project.

## Installation

Install SmartEnvSwitcher via npm:

```bash
npm install smart-env-switcher
```

## Usage

### 1. Setup Environment Files
Create a folder to store your environment files (e.g., `./envs`) and add `.env` files for each environment (e.g., `development.env`, `production.env`).

Example `development.env`:
```
API_KEY=123456
DB_HOST=localhost
```

### 2. Import and Initialize SmartEnvSwitcher

```javascript
const SmartEnvSwitcher = require('smart-env-switcher').default;

// Initialize with the folder containing .env files and the default environment
const envSwitcher = new SmartEnvSwitcher('./envs', 'development');
```

### 3. Get Environment Variables
Retrieve a variable from the currently loaded environment:

```javascript
console.log(envSwitcher.get('API_KEY')); // Output: 123456
```

### 4. Set or Update Environment Variables
Add or update a variable in the current environment:

```javascript
envSwitcher.set('NEW_KEY', 'new_value');
console.log(envSwitcher.get('NEW_KEY')); // Output: new_value
```

### 5. Switch Environments
Switch to a different environment:

```javascript
envSwitcher.switchEnv('production');
console.log(envSwitcher.get('API_KEY')); // Value from production.env
```

### 6. List all loaded environment variables
Get a list of all environment variables in the currently loaded .env file:

```javascript
console.log(envSwitcher.list()); // Output: ['development', 'production']
```


### 7. List All Available Environments
Get a list of all `.env` files:

```javascript
console.log(envSwitcher.listEnvironments()); // Output: ['development', 'production']
```

### 8. Clear Environment Variables
Clear all loaded environment variables and save the changes to the .env file:

```javascript
envSwitcher.clearEnv();
console.log(envSwitcher.list()); // Output: {}
```

### 9. Remove an Environment Variable
Remove a specific environment variable and save the changes:

```javascript
envSwitcher.remove('API_KEY');
console.log(envSwitcher.get('API_KEY')); // Output: null
```


## API Reference

### `new SmartEnvSwitcher(envDir, defaultEnv)`
- `envDir` (string): Path to the directory containing `.env` files.
- `defaultEnv` (string): The default environment to load.

### `envSwitcher.get(key)`
- `key` (string): The environment variable name to retrieve.
- **Returns**: The value of the variable or `null` if not found.

### `envSwitcher.set(key, value)`
- `key` (string): The environment variable name to set.
- `value` (string): The value to assign to the variable.

### `envSwitcher.switchEnv(envName)`
- `envName` (string): The environment name (file name without `.env`) to switch to.

### `envSwitcher.list()`
- **Returns**: A record of all loaded environment variables as key-value pairs.

### `envSwitcher.listEnvironments()`
- **Returns**: An array of available environment names.

### `envSwitcher.clearEnv()`
- Clears all environment variables and saves the changes to the .env file.

### `envSwitcher.listEnvironments()`
- Removes the environment variable from the current environment and saves the changes.


## Example Project Structure

```
project-directory/
├── envs/
│   ├── development.env
│   ├── production.env
├── index.js
```

## Example Code

```javascript
const SmartEnvSwitcher = require('smart-env-switcher');

// Initialize the environment switcher
const envSwitcher = new SmartEnvSwitcher('./envs', 'development');

// Get a variable
console.log(envSwitcher.get('API_KEY'));

// Set a new variable
envSwitcher.set('NEW_VARIABLE', 'value');

// Switch to production
envSwitcher.switchEnv('production');
console.log(envSwitcher.get('API_KEY'));

// List all loaded variables in the current environment
console.log(envSwitcher.list()); // Output: { API_KEY: 'production_key', DB_HOST: 'production_host' }

// List all available environments
console.log(envSwitcher.listEnvironments());

// Clear all environment variables
envSwitcher.clearEnv();
console.log(envSwitcher.list()); // Output: {}

// Remove an environment variable
envSwitcher.remove('API_KEY');
console.log(envSwitcher.get('API_KEY')); // Output: null
```

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests on the [GitHub repository](https://github.com/amit2197/smart-env-switcher).

## License

This project is licensed under the MIT License. See the LICENSE file for details.