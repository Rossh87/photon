import { fromNullable, fold, Option } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';
import { Lazy } from 'fp-ts/lib/function';

export interface IReadEnv {
	(prop: string): Option<string>;
}

export const makeReadEnv = (context: Record<string, string>): IReadEnv => (
	prop
) => fromNullable(context[prop]);

// break the program if needed env vars are missing
export const getEnvElseThrow = (readEnv: IReadEnv) => (prop: string) =>
	pipe(
		readEnv(prop),
		fold(
			() => {
				throw new Error(`missing variable ${prop} from environment`);
			},
			(s) => s
		)
	);
