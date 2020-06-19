import svelte from 'rollup-plugin-svelte';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
//import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'docs/assets/js/main.min.js'
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			legacy: true,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('docs/assets/css/main.min.css');
			}
		}),
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		babel({
			extensions: ['.js', '.mjs', '.html', '.svelte'],
			babelHelpers: 'runtime',
			exclude: ['node_modules/@babel/**'],
			presets: [
				['@babel/preset-env', {
					targets: {
						ie: '11'
					},
				}]
			],
			plugins: [
				'@babel/plugin-syntax-dynamic-import',
				['@babel/plugin-transform-runtime', {
					useESModules: true
				}]
			]
		}),
		!production && serve(),
		//!production && livereload('docs'),
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}