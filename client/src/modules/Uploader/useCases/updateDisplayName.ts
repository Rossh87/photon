import { flow, pipe } from 'fp-ts/lib/function';
import { TUpdateDisplayNameArgs } from '../domain/domainTypes';
import { checkOneDupeDisplayName } from '../http/checkOneDupeDisplayName';
import { chain as RTChain, asks as RTAsks } from 'fp-ts/ReaderTask';
import { map as EMap, mapLeft as EMapLeft } from 'fp-ts/Either';
import { fromArray } from 'fp-ts/NonEmptyArray';
import { fold as OFold } from 'fp-ts/Option';

export const updateDisplayName = ([
	toUpdate,
	newName,
]: TUpdateDisplayNameArgs) =>
	pipe(
		newName,
		checkOneDupeDisplayName,
		RTChain((f) =>
			RTAsks((deps) =>
				pipe(
					f,
					EMap(
						flow(
							fromArray,
							OFold(
								() =>
									deps.dispatch({
										type: 'UPLOADER/UPDATE_FILE',
										payload: {
											prevName: toUpdate.displayName,
											updates: {
												displayName: newName,
												isUniqueDisplayName: 'yes',
											},
										},
									}),
								(_) =>
									deps.dispatch({
										type: 'UPLOADER/UPDATE_FILE',
										payload: {
											prevName: toUpdate.displayName,
											updates: {
												displayName: newName,
												isUniqueDisplayName: 'no',
											},
										},
									})
							)
						)
					),
					EMapLeft((e) =>
						deps.dispatch({
							type: 'UPLOADER/UPLOAD_COMPONENT_ERR',
							payload: e,
						})
					)
				)
			)
		)
	);
