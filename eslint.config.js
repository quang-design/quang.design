import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		rules: {
			// Allow unused vars prefixed with _ (convention for intentionally ignored)
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_'
				}
			],
			// Allow any in specific cases
			'@typescript-eslint/no-explicit-any': 'warn'
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		},
		rules: {
			// Disable custom element warning - we're not building custom elements
			'svelte/valid-compile': ['error', { ignoreWarnings: true }],
			// Allow @html for structured data (JSON-LD) - used carefully
			'svelte/no-at-html-tags': 'warn'
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/', '.vercel/', 'node_modules/']
	}
);
