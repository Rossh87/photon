import React from 'react';
import {
	IImage
} from '../domain/domainTypes';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Avatar from '@material-ui/core/Avatar';
import PhotoOutlinedIcon from '@material-ui/icons/PhotoOutlined';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import { makeStyles } from '@material-ui/core/styles';
import FileUpdateForm from './FileUpdateForm';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { setTimeout } from 'node:timers';

const useSelectedImageStyles = makeStyles({
	root: {
		width: '100%',
	},
	successIcon: {
		fill: '#02b033'
	}
});

interface ISelectedImageProps {
	imageFile: IImage;
	handleRemoval: (fileForRemoval: string) => void;
	handleFileUpdate: (p: string, u: Partial<IImage>) => void;
}

const SelectedImage: React.FunctionComponent<ISelectedImageProps> = ({
	imageFile,
	handleRemoval,
	handleFileUpdate,
}) => {
	// state stuff
	const [isExpanded, setExpanded] = React.useState<boolean>(false);

	const classes = useSelectedImageStyles();

	const hasError = !!(imageFile.error);

	const {status, displayName} = imageFile;

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

	const removeIfSuccess = () => {
		let cancel = () => clearTimeout();

		if(status === 'success'){
			const timerID = setTimeout(() => handleRemoval(displayName), 3000);
			cancel = () => clearTimeout(timerID);
		} 

		return cancel;
	}

	React.useEffect(removeIfSuccess, [status, displayName, handleRemoval]);

	const renderIcon = () => status === 'success' ? 
		<CheckCircleOutlineIcon /> :
		<DeleteIcon className={classes.successIcon}/>


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
						secondary={imageFile.error?.message}
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
							{renderIcon()}
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

export default SelectedImage;