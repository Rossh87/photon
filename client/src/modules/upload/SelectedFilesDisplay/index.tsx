import React from 'react';
import {
	TPreprocessedFiles,
	IPreprocessedFile,
	TPreprocessErrors,
} from '../UploadManager/uploadPreprocessing/uploadPreprocessingTypes';
import { IImageUploadState } from '../UploadManager/uploadState/stateTypes'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import TextField from '@material-ui/core/TextField';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Avatar from '@material-ui/core/Avatar';
import PhotoOutlinedIcon from '@material-ui/icons/PhotoOutlined';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import { makeStyles } from '@material-ui/core/styles';

interface IDisplayProps {
	uploadState: IImageUploadState;
	handleInvalidFileRemoval: (f: string) => void;
	handleValidFileRemoval: (f: string) => void;
	handleUpdate: (p: string, u: Partial<IPreprocessedFile>) => void;
}

// TODO: passing of error message to list item component through a null prop isn't great...
const SelectedFilesDisplay: React.FunctionComponent<IDisplayProps> = ({
	uploadState,
	handleValidFileRemoval,
	handleInvalidFileRemoval,
	handleUpdate,
}) => {
	const generateValidFileItems = (files: TPreprocessedFiles) =>
		files.map((f) => (
			<ValidFileListItem
				file={f}
				handleRemoval={handleValidFileRemoval}
				handleUpdate={handleUpdate}
				key={f.displayName}
			/>
		));

	// TODO: we have to have a null check here because we recycle the ImagePreprocessError structure
	// a lot.  Could be improved.
	const generateInvalidFileItems = (errs: TPreprocessErrors) =>
		errs.map((e) =>
			e.invalidFile ? (
				<InvalidFileListItem
					file={e.invalidFile}
					handleRemoval={handleInvalidFileRemoval}
					key={e.invalidFile.displayName}
					secondaryText={e.message}
				/>
			) : null
		);

	const renderListItems = () => (
		<React.Fragment>
			{generateValidFileItems(
				uploadState.selectedFiles as TPreprocessedFiles
			)}
			{generateInvalidFileItems(uploadState.errors as TPreprocessErrors)}
		</React.Fragment>
	);

	return <List>{renderListItems()}</List>;
};

interface IFileUpdateFormProps {
	handleUpdate: (
		previousName: string,
		updates: Partial<IPreprocessedFile>
	) => void;
	fileName: string;
	closeAccordion: () => void;
}

const FileUpdateForm: React.FunctionComponent<IFileUpdateFormProps> = ({
	handleUpdate,
	fileName,
	closeAccordion,
}) => {
	const [inputState, setInputState] = React.useState<string>('');
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setInputState(e.target.value);

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		handleUpdate(fileName, { displayName: inputState });
		setInputState('');
		closeAccordion();
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

// TODO: TONS of duplication between the valid/invalid variant here--good place for an abstraction
const useValidFileListItemStyles = makeStyles({
	root: {
		width: '100%',
	},
});

interface IValidItemProps {
	file: IPreprocessedFile;
	handleRemoval: (fileForRemoval: string) => void;
	handleUpdate: (p: string, u: Partial<IPreprocessedFile>) => void;
}

const ValidFileListItem: React.FunctionComponent<IValidItemProps> = ({
	file,
	handleRemoval,
	handleUpdate,
}) => {
	const classes = useValidFileListItemStyles();

	const [isExpanded, setExpanded] = React.useState<boolean>(false);

	const closeAccordion = () => setExpanded(false);

	const toggleAccordion = (e: React.MouseEvent) => {
		e.stopPropagation();
		setExpanded(!isExpanded);
	};

	const removeFileListItem = (e: React.MouseEvent) => {
		e.stopPropagation();
		handleRemoval(file.displayName);
	};

	return (
		<ListItem>
			<Accordion expanded={isExpanded} className={classes.root}>
				<AccordionSummary aria-label="Expand" onClick={toggleAccordion}>
					<ListItemAvatar>
						<Avatar>
							<PhotoOutlinedIcon />
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						primary={file.displayName}
						primaryTypographyProps={{
							color: 'primary',
						}}
					/>
					<ListItemSecondaryAction>
						<IconButton
							edge="end"
							aria-label="remove file"
							onClick={removeFileListItem}
						>
							<DeleteIcon />
						</IconButton>
					</ListItemSecondaryAction>
				</AccordionSummary>
				<AccordionDetails>
					<FileUpdateForm
						closeAccordion={closeAccordion}
						handleUpdate={handleUpdate}
						fileName={file.displayName}
					/>
				</AccordionDetails>
			</Accordion>
		</ListItem>
	);
};

interface IInvalidItemProps {
	file: IPreprocessedFile;
	handleRemoval: (fileForRemoval: string) => void;
	secondaryText: string;
}
const InvalidFileListItem: React.FunctionComponent<IInvalidItemProps> = ({
	file,
	handleRemoval,
	secondaryText,
}) => {
	const removeFileListItem = (e: React.MouseEvent) => {
		e.stopPropagation();
		handleRemoval(file.displayName);
	};

	return (
		<ListItem>
			<ListItemAvatar>
				<Avatar>
					<PhotoOutlinedIcon />
				</Avatar>
			</ListItemAvatar>
			<ListItemText
				primary={file.displayName}
				primaryTypographyProps={{
					color: 'error',
				}}
				secondary={secondaryText}
			/>
			<ListItemSecondaryAction>
				<IconButton
					edge="end"
					aria-label="remove file"
					onClick={removeFileListItem}
				>
					<DeleteIcon />
				</IconButton>
			</ListItemSecondaryAction>
		</ListItem>
	);
};

export default SelectedFilesDisplay;
