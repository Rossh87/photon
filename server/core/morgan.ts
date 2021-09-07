import morgan from 'morgan';
import * as fsp from 'fs/promises';
import fs from 'fs';
import path from 'path';
import { RequestHandler } from 'express';

// let the compiler know we'll be monkey-patching
// the Request object
declare module 'http' {
	interface IncomingMessage {
		failureMessage: string;
	}
}

// fallback if this env var isn't set
const logPath = process.env.LOG_PATH
	? process.env.LOG_PATH
	: path.resolve(path.join(process.cwd(), 'logs'));

// intentionally don't catch the error here, since we don't want server to start
// if any of this goes wrong
const getLogPath = (): Promise<string> =>
	fs.existsSync(logPath)
		? Promise.resolve(logPath)
		: fsp
				.mkdir(logPath, { recursive: true })
				.then(() => logPath)
				.catch((e) => {
					throw new Error(
						'failed to resolve or create log directory'
					);
				});

const getWriteStream = (fileName: string) =>
	getLogPath().then((logPath) =>
		fs.createWriteStream(path.join(logPath, `${fileName}.log`), {
			flags: 'a',
		})
	);

export const getLoggers = async () => {
	// this is Apache common log output with custom err message added.
	morgan.token('failureMessage', (req) => req.failureMessage);
	const formatString =
		':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :failureMessage';

	const errStream = await getWriteStream('errors');

	const accessStream = await getWriteStream('access');

	const errLogger = () =>
		morgan(formatString, {
			skip: (req, res) => res.statusCode < 400,
			stream: errStream,
		});

	const accessLogger = () =>
		morgan('common', {
			stream: accessStream,
		});

	const devLogger = () =>
		process.env.NODE_ENV !== 'production'
			? morgan('dev')
			: (((req, res, next) => next()) as RequestHandler);

	return {
		errLogger,
		accessLogger,
		devLogger,
	};
};
