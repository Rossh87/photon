import React, { Dispatch } from 'react';
import {
	TUploaderActions,
	TSelectedFilesState,
} from '../state/uploadStateTypes';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import { InputLabel } from '@material-ui/core';
import { pipe } from 'fp-ts/lib/function';
import {
	Option,
	map,
	fromNullable,
	sequence,
	traverseArray,
	Apply as OApply,
} from 'fp-ts/lib/Option';
import { map as arrMap } from 'fp-ts/lib/Array';
import { sequenceT } from 'fp-ts/lib/Apply';
import { ap } from 'fp-ts/lib/Identity';

interface IProps {
	uploadDispatch: Dispatch<TUploaderActions>;
	acceptedExtensions: Array<string>;
	submitIsDisabled: boolean;
	ownerID: string | undefined;
	selectedFiles: TSelectedFilesState;
}

const UploadForm: React.FunctionComponent<IProps> = ({
	ownerID,
	acceptedExtensions,
	submitIsDisabled,
	uploadDispatch,
	selectedFiles,
}) => {
	// does nothing if ownerID or FileList is nullable
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		pipe(
			sequenceT(OApply)(
				fromNullable(e.target.files),
				fromNullable(ownerID)
			),
			map((fileListArgs) =>
				uploadDispatch({ type: 'FILES_CHANGED', payload: fileListArgs })
			),
			map(() => (e.target.value = ''))
		);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		uploadDispatch({
			type: 'PROCESS_FILES',
			payload: selectedFiles,
		});
	};
	// if (files && ownerID) {
	// 	pipe(
	// 		preprocessImages({ ownerID })(files),
	// 		fold(
	// 			() =>
	// 				uploadDispatch({ type: 'UNSELECT_ALL', payload: null }),
	// 			(images) =>
	// 				uploadDispatch({
	// 					type: 'FILES_SELECTED',
	// 					payload: images,
	// 				})
	// 		)
	// 	);

	// 	// reset file input
	// 	e.target.value = '';
	// } else {
	// 	return;
	// }

	const inputProps = {
		accept: acceptedExtensions.join(','),
		multiple: true,
	};

	return (
		<form onSubmit={handleSubmit}>
			<InputLabel htmlFor="fileSelectionButton">Choose Files</InputLabel>
			<Input
				id="fileSelectionButton"
				name="select images"
				onChange={handleFileChange}
				type="file"
				inputProps={inputProps}
			></Input>
			<Button disabled={submitIsDisabled} type="submit">
				Submit!
			</Button>
		</form>
	);
};

export default UploadForm;
