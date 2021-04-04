import React from 'react';
import {
	TPreprocessErrors,
	TPreprocessingResults,
	IPreprocessingResult,
	IPreprocessedFile
} from '../../../core/imageReducer/preprocessImages/imagePreprocessingTypes';
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
import {fromPredicate, map} from 'fp-ts/lib/Option';
import {pipe} from 'fp-ts/lib/function'

interface IDisplayProps {
	uploadState: IImageUploadState;
	handleFileRemoval: (f: string) => void;
	handleFileUpdate: (p: string, u: Partial<IPreprocessedFile>) => void;
}

// TODO: passing of error message to list item component through a null prop isn't great...
const SelectedImagesDisplay: React.FunctionComponent<IDisplayProps> = ({
	uploadState,
	handleFileRemoval,
	handleFileUpdate,
}) => {
	const {selectedFiles} = uploadState;

	const generateSelectedImageItems = (imageFiles: TPreprocessingResults) =>
		imageFiles.map((f) => (
			<SelectedImage
				image={f}
				handleRemoval={handleFileRemoval}
				handleFileUpdate={handleFileUpdate}
				key={f.imageFile.displayName}
			/>
		));

	return selectedFiles.length? <List>{generateSelectedImageItems(selectedFiles as TPreprocessingResults)}</List> : null;
};

interface IFileUpdateFormProps {
	handleFileUpdate: (
		previousName: string,
		updates: Partial<IPreprocessedFile>
	) => void;
	fileName: string;
	closeAccordion: () => void;
}

const FileUpdateForm: React.FunctionComponent<IFileUpdateFormProps> = ({
	handleFileUpdate,
	fileName,
	closeAccordion,
}) => {
	const [inputState, setInputState] = React.useState<string>('');
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setInputState(e.target.value);

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		pipe(
			inputState,
			fromPredicate<string>((s) => s.length > 0),
			map(x => {
				handleFileUpdate(fileName, { displayName: inputState });
				return x;
			}),
			map(x => {
				setInputState('');
				return x
			})
		)
		
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

const useSelectedImageStyles = makeStyles({
	root: {
		width: '100%',
	},
});

interface ISelectedImageProps {
	image: IPreprocessingResult;
	handleRemoval: (fileForRemoval: string) => void;
	handleFileUpdate: (p: string, u: Partial<IPreprocessedFile>) => void;
}

const SelectedImage: React.FunctionComponent<ISelectedImageProps> = ({
	image,
	handleRemoval,
	handleFileUpdate,
}) => {
	// state stuff
	const [isExpanded, setExpanded] = React.useState<boolean>(false);

	const classes = useSelectedImageStyles();

	const hasError = !!(image.error);

	const displayName = image.error ? image.error.invalidFile.displayName : image.imageFile.displayName;

	const textColor = hasError ? 'error' : 'primary';

	// handlers
	const closeAccordion = () => setExpanded(false);

	const toggleAccordion = (e: React.MouseEvent) => {
		e.stopPropagation();
		setExpanded(!isExpanded);
	};

	const removeFileListItem = (e: React.MouseEvent) => {
		e.stopPropagation();
		handleRemoval(displayName);
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
						primary={displayName}
						primaryTypographyProps={{
							color: textColor,
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
						handleFileUpdate={handleFileUpdate}
						fileName={displayName}
					/>
				</AccordionDetails>
			</Accordion>
		</ListItem>
	);
};

export default SelectedImagesDisplay;
