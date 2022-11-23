import React, { createRef, Dispatch, useRef } from 'react';
import { TPreprocessingResult } from '../domain/domainTypes';
import { isIImage } from '../domain/guards';
import { TUploaderActions } from '../state/uploadStateTypes';
import ListItem from '@mui/material/ListItem';
import { ListItemText, Hidden } from '@mui/material';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { makeStyles } from '@mui/styles';
import FileUpdateForm from './FileUpdateForm';
import SelectedImageStatusIcon from './SelectedImageStatusIcon';
import ExpandMore from '@mui/icons-material/ExpandMore';
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

	const inputRef = useRef<any>();

	const classes = useStyles();

	const { status, displayName, isUniqueDisplayName, type } = imageFile;

	const textColor =
		isIImage(imageFile) && isUniqueDisplayName ? 'primary' : 'error';

	const secondaryMessage = isIImage(imageFile)
		? isUniqueDisplayName === 'no'
			? 'File name is already in use.  Please select a different name'
			: ''
		: imageFile.error.message;

	// handlers
	const closeAccordion = () => {
		setExpanded(false);
	};

	const toggleAccordion = (e: React.MouseEvent) => {
		e.stopPropagation();

		if (inputRef.current && document.activeElement === inputRef.current)
			return;

		setExpanded(!isExpanded);
	};

	const removeFileListItem = (e: React.MouseEvent) => {
		e.stopPropagation();
		dispatch({ type: 'UPLOADER/UNSELECT_FILE', payload: displayName });
	};

	const removeIfSuccess = () => {
		let cancel = () => clearTimeout(undefined);

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

	const getTypeSuffixFromMIMEType = (type: string) => type.split('/')[1];

	React.useEffect(removeIfSuccess, [status, displayName, dispatch]);

	return (
		<ListItem dense>
			<Accordion expanded={isExpanded} className={classes.root}>
				<AccordionSummary aria-label="Expand" onClick={toggleAccordion}>
					<Hidden mdDown>
						<ListItemAvatar>
							<Avatar>
								<PhotoOutlinedIcon />
							</Avatar>
						</ListItemAvatar>
					</Hidden>

					<ListItemText
						primary={`${displayName}.${getTypeSuffixFromMIMEType(
							type
						)}`}
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
							size="large"
						>
							<SelectedImageStatusIcon status={status} />
						</IconButton>
						<IconButton
							edge="end"
							aria-label="remove file"
							onClick={toggleAccordion}
							className={clsx(isExpanded && classes.expandIcon)}
							size="large"
						>
							<ExpandMore />
						</IconButton>
					</ListItemSecondaryAction>
				</AccordionSummary>
				<AccordionDetails>
					<FileUpdateForm
						ref={inputRef}
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
