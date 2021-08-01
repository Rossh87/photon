import React, { Dispatch } from 'react';
import { TUploaderActions } from '../state/uploadStateTypes';
import TextField from '@material-ui/core/TextField';
import { fromPredicate, map } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';

interface IFileUpdateFormProps {
	uploadDispatch: Dispatch<TUploaderActions>;
	fileName: string;
	closeAccordion: () => void;
}

const FileUpdateForm: React.FunctionComponent<IFileUpdateFormProps> = ({
	fileName,
	closeAccordion,
	uploadDispatch,
}) => {
	const [inputState, setInputState] = React.useState<string>('');

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setInputState(e.target.value);

	const setNewDisplayName = () =>
		uploadDispatch({
			type: 'UPDATE_FILE',
			previousName: fileName,
			payload: { displayName: inputState },
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
