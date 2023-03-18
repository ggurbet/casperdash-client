const path = require('path');
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const configs = require('../webpack.config');

process.env.NODE_ENV = 'development';
process.env.type = 'extension';
process.env.network = 'mainnet';

const config = configs({ type: 'extension', network: 'mainnet' }, { mode: 'development' }) || {};

for (let entryName in config.entry) {
	if (['background', 'contentScript', 'devtools'].indexOf(entryName) === -1) {
		config.entry[entryName] = [
			'webpack/hot/dev-server',
			`webpack-dev-server/client?hot=true&hostname=localhost&port=${3009}`,
		].concat(config.entry[entryName]);
	}
}

// delete config.notHotReload;

const compiler = webpack(config);

const server = new WebpackDevServer(
	{
		https: false,
		hot: true,
		liveReload: false,
		client: {
			webSocketTransport: 'sockjs',
		},
		webSocketServer: 'sockjs',
		host: 'localhost',
		port: 3009,
		static: {
			directory: path.join(__dirname, '../build_extension'),
		},
		devMiddleware: {
			publicPath: `http://localhost:${3009}/`,
			writeToDisk: true,
		},
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
		allowedHosts: 'all',
	},
	compiler,
);

(async () => {
	await server.start();
})();
