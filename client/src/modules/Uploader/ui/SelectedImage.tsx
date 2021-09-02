import React, { Dispatch } from 'react';
import { TPreprocessingResult } from '../domain/domainTypes';
import { isIImage } from '../domain/guards';
import { TUploaderActions } from '../state/uploadStateTypes';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import PhotoOutlinedIcon from '@material-ui/icons/PhotoOutlined';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import { makeStyles } from '@material-ui/core/styles';
import FileUpdateForm from './FileUpdateForm';
import SelectedImageStatusIcon from './SelectedImageStatusIcon';

const useSelectedImageStyles = makeStyles({
	root: {
		width: '100%',
	},
});

interface ISelectedImageProps {
	imageFile: TPreprocessingResult;
	uploadDispatch: Dispatch<TUploaderActions>;
}

const SelectedImage: React.FunctionComponent<ISelectedImageProps> = ({
	imageFile,
	uploadDispatch,
}) => {
	// state stuff
	const [isExpanded, setExpanded] = React.useState<boolean>(false);

	const classes = useSelectedImageStyles();

	const { status, displayName, isUniqueDisplayName } = imageFile;

	const textColor =
		isIImage(imageFile) && isUniqueDisplayName ? 'primary' : 'error';

	const secondaryMessage = isIImage(imageFile)
		? isUniqueDisplayName === 'no'
			? 'File name is already in use.  Please select a different name'
			: ''
		: imageFile.error.message;

	// handlers
	const closeAccordion = () => setExpanded(false);

	const toggleAccordion = (e: React.MouseEvent) => {
		e.stopPropagation();
		setExpanded(!isExpanded);
	};

	const removeFileListItem = (e: React.MouseEvent) => {
		e.stopPropagation();
		uploadDispatch({ type: 'UNSELECT_FILE', payload: displayName });
	};

	const removeIfSuccess = () => {
		let cancel = () => clearTimeout();

		if (status === 'success') {
			const timerID = setTimeout(
				() =>
					uploadDispatch({
						type: 'UNSELECT_FILE',
						payload: displayName,
					}),
				1000
			);
			cancel = () => clearTimeout(timerID);
		}

		return cancel;
	};

	React.useEffect(removeIfSuccess, [status, displayName, uploadDispatch]);

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
						secondary={secondaryMessage}
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
							<SelectedImageStatusIcon status={status} />
						</IconButton>
					</ListItemSecondaryAction>
				</AccordionSummary>
				<AccordionDetails>
					<FileUpdateForm
						closeAccordion={closeAccordion}
						imageFile={imageFile}
						uploadDispatch={uploadDispatch}
					/>
				</AccordionDetails>
			</Accordion>
		</ListItem>
	);
};

export default SelectedImage;
