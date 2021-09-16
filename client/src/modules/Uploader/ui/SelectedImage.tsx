import React, { Dispatch } from 'react';
import { TPreprocessingResult } from '../domain/domainTypes';
import { isIImage } from '../domain/guards';
import { TUploaderActions } from '../state/uploadStateTypes';
import ListItem from '@material-ui/core/ListItem';
import { ListItemText, Hidden } from '@material-ui/core';
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
import ExpandMore from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
	},

	listItem: {
		'&:hover': {
			border: `1px solid  ${theme.palette.primary.main}`,
		},
	},

	expandIcon: {
		transform: 'rotate(180deg)',
	},
}));

interface ISelectedImageProps {
	imageFile: TPreprocessingResult;
	dispatch: Dispatch<TUploaderActions>;
}

const SelectedImage: React.FunctionComponent<ISelectedImageProps> = ({
	imageFile,
	dispatch,
}) => {
	// state stuff
	const [isExpanded, setExpanded] = React.useState<boolean>(false);

	const toggleExpanded = () => setExpanded(!isExpanded);

	const classes = useStyles();

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
		dispatch({ type: 'UPLOADER/UNSELECT_FILE', payload: displayName });
	};

	const removeIfSuccess = () => {
		let cancel = () => clearTimeout();

		if (status === 'success') {
			const timerID = setTimeout(
				() =>
					dispatch({
						type: 'UPLOADER/UNSELECT_FILE',
						payload: displayName,
					}),
				1000
			);
			cancel = () => clearTimeout(timerID);
		}

		return cancel;
	};

	React.useEffect(removeIfSuccess, [status, displayName, dispatch]);

	return (
		<ListItem dense>
			<Accordion expanded={isExpanded} className={classes.root}>
				<AccordionSummary aria-label="Expand" onClick={toggleAccordion}>
					<Hidden smDown>
						<ListItemAvatar>
							<Avatar>
								<PhotoOutlinedIcon />
							</Avatar>
						</ListItemAvatar>
					</Hidden>

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
						<IconButton
							edge="end"
							aria-label="remove file"
							onClick={toggleExpanded}
							className={clsx(isExpanded && classes.expandIcon)}
						>
							<ExpandMore />
						</IconButton>
					</ListItemSecondaryAction>
				</AccordionSummary>
				<AccordionDetails>
					<FileUpdateForm
						closeAccordion={closeAccordion}
						imageFile={imageFile}
						dispatch={dispatch}
					/>
				</AccordionDetails>
			</Accordion>
		</ListItem>
	);
};

export default SelectedImage;
