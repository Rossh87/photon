import React, { Dispatch } from 'react';
import {
	TUploaderActions,
	TSelectedFilesState,
} from '../state/uploadStateTypes';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import { InputLabel } from '@material-ui/core';
import { pipe } from 'fp-ts/lib/function';
import { map, fromNullable, Applicative, fold } from 'fp-ts/lib/Option';
import { sequenceT } from 'fp-ts/lib/Apply';
import { makeStyles } from '@material-ui/styles';
import theme from '../../theme';
import { TUserState } from '../../Auth/domain/authDomainTypes';

const useStyles = makeStyles({
	fileForm: {
		display: 'flex',
		justifyContent: 'space-around',
		margin: theme.spacing(2),
	},

	hiddenInput: {
		opacity: '0',
		width: '0.1px',
		height: '0.1px',
		position: 'absolute',
	},

	submitButton: {
		width: '20%',
	},

	label: {
		fontFamily: theme.typography.fontFamily,
		fontSize: theme.typography.fontSize,
		alignContent: 'center',
		backgroundColor: 'red',
		borderRadius: theme.shape.borderRadius,
		textAlign: 'center',
		paddingTop: theme.spacing(1),
		paddingBottom: theme.spacing(1),
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
		color: 'white',
		width: '20%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		cursor: 'pointer',
	},
});

interface IProps {
	uploadDispatch: Dispatch<TUploaderActions>;
	acceptedExtensions: Array<string>;
	submitIsDisabled: boolean;
	user: TUserState;
	selectedFiles: TSelectedFilesState;
}

const UploadForm: React.FunctionComponent<IProps> = ({
	user,
	acceptedExtensions,
	submitIsDisabled,
	uploadDispatch,
	selectedFiles,
}) => {
	const classes = useStyles();

	// does nothing if ownerID or FileList is nullable
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const reset = () => {
			e.target.files = null;
			e.target.value = '';
		};
		console.log('changed!!');
		pipe(
			sequenceT(Applicative)(
				fromNullable(e.target.files),
				fromNullable(user)
			),
			map((fileListArgs) =>
				uploadDispatch({ type: 'FILES_CHANGED', payload: fileListArgs })
			),
			// We reset the native file input after every change, whether
			// it passes pre-processing or not.
			// This keeps the native file input from getting out-of-sync
			// with application state--we don't ever want files from previous
			// change events to end up in the pre-processing flow a second time.
			fold(reset, reset)
		);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		uploadDispatch({
			type: 'PROCESS_FILES',
			payload: selectedFiles,
		});
	};

	const inputProps = {
		accept: acceptedExtensions.join(','),
		multiple: true,
	};

	return (
		<form onSubmit={handleSubmit} className={classes.fileForm}>
			<InputLabel
				htmlFor="fileSelectionInput"
				color="primary"
				className={classes.label}
			>
				Select Files
			</InputLabel>

			<Button
				variant="contained"
				color="primary"
				disabled={submitIsDisabled}
				type="submit"
			>
				Submit!
			</Button>

			<Input
				className={classes.hiddenInput}
				id="fileSelectionInput"
				name="select images"
				onChange={handleFileChange}
				type="file"
				inputProps={inputProps}
				color="primary"
				disableUnderline={true}
			></Input>
		</form>

		// <div>
		// 	<input
		// 		accept="image/*"
		// 		// className={classes.input}
		// 		id="raised-button-file"
		// 		multiple
		// 		type="file"
		// 		hidden={true}
		// 	/>
		// 	<label htmlFor="raised-button-file">
		// 		<Button
		// 			component="span"
		// 			variant="contained"
		// 			color="primary"
		// 			// className={classes.button}
		// 		>
		// 			Upload
		// 		</Button>
		// 	</label>
		// </div>
	);
};

export default UploadForm;
