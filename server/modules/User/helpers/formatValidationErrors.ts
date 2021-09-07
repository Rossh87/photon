import { TProfileErrorsTransportObject } from '../../../../sharedTypes/User';
import { Errors } from 'io-ts';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';

export const formatValidationErrs = (
	errs: Errors
): TProfileErrorsTransportObject =>
	errs.reduce(
		(output, err) =>
			pipe(
				err.message,
				O.fromNullable,
				O.map((msg) => msg.split(':').map((s) => s.trim())),
				O.fold(
					() => output,
					(msg) => ({ ...output, [msg[0]]: msg[1] })
				)
			),
		{} as TProfileErrorsTransportObject
	);
