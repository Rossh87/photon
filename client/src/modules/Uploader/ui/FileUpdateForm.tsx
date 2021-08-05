import React, { Dispatch } from 'react';
import { TUploaderActions } from '../state/uploadStateTypes';
import TextField from '@material-ui/core/TextField';
import { fromPredicate, map } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';
import { TPreprocessingResult } from '../domain/domainTypes';

interface IFileUpdateFormProps {
	uploadDispatch: Dispatch<TUploaderActions>;
	closeAccordion: () => void;
	imageFile: TPreprocessingResult
}

const FileUpdateForm: React.FunctionComponent<IFileUpdateFormProps> = ({
	closeAccordion,
	uploadDispatch,
	imageFile
}) => {
	const [inputState, setInputState] = React.useState<string>('');

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setInputState(e.target.value);

	const setNewDisplayName = () =>
		uploadDispatch({
			type: 'INIT_NAME_UPDATE',
			payload: [imageFile, inputState]
		});

	const resetFileNameInput = () => setInputState('');

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		pipe(
			inputState,
			fromPredicate<string>((s) => s.length > 0),
			map(setNewDisplayName),
			map(resetFileNameInput),
			map(closeAccordion)
		);
	};

	return (
		<form onSubmit={onSubmit} noValidate autoComplete="off">
			<TextField
				id="outlined-basic"
				label="Update name"
				variant="outlined"
				onChange={onChange}
				value={inputState}
			/>
		</form>
	);
};

export default FileUpdateForm;
