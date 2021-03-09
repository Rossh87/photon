import { NonEmptyArray, foldMap } from 'fp-ts/lib/NonEmptyArray';
import { MonoidAny, fold } from 'fp-ts/lib/boolean';
import { pipe } from 'fp-ts/lib/function';

export type TRequiredEnvVars = NonEmptyArray<string>;

export interface IReadEnv {
	(prop: string): string;
}

const isNonNull = (v: unknown) => v !== undefined && v !== null;

export const makeReadEnv = (
	required: TRequiredEnvVars,
	context: any
): IReadEnv | never => {
	const envReader = (p: TRequiredEnvVars[number]) => context[p];

	return pipe(
		required,
		foldMap(MonoidAny)(isNonNull),
		fold<IReadEnv | never>(
			() => {
				throw new Error('required env vars are missing');
			},
			() => envReader
		)
	);
};
