import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {
	Paper,
	List,
	ListItemIcon,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
	IconButton,
	AccordionSummary,
	AccordionDetails,
} from '@material-ui/core';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import PhotoOutlinedIcon from '@material-ui/icons/PhotoOutlined';
import Accordion from '@material-ui/core/Accordion';
import { sizeFromBreakpoint } from '../../../core/createSrcset';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { TextareaAutosize } from '@material-ui/core';
import {
	useImageSearchState,
	useImageSearchDispatch,
} from '../state/useImageSearchState';
import {
	createSrcset,
	makeDefaultBreakpoint,
} from '../../../core/createSrcset';
import { IDBUpload } from 'sharedTypes/Upload';
import { IBreakpoint } from 'sharedTypes/Breakpoint';

const BreakPointListItem: React.FunctionComponent<IBreakpoint> = (props) => {
	const [isExpanded, setExpanded] = React.useState(false);

	const toggleAccordion = () => setExpanded(!isExpanded);
	const closeAccordion = () => setExpanded(false);

	return (
		<ListItem onClick={toggleAccordion}>
			<Accordion expanded={isExpanded}>
				<AccordionSummary aria-label="Expand" onClick={toggleAccordion}>
					<ListItemAvatar>
						<Avatar>
							<PhotoOutlinedIcon />
						</Avatar>
					</ListItemAvatar>
					<ListItemText primary={sizeFromBreakpoint(props)} />
					<ListItemSecondaryAction>
						<IconButton
							edge="end"
							aria-label="remove file"
						></IconButton>
					</ListItemSecondaryAction>
				</AccordionSummary>
				<AccordionDetails>
					{/* <FileUpdateForm
						closeAccordion={closeAccordion}
						imageFile={imageFile}
						uploadDispatch={uploadDispatch}
					/> */}
				</AccordionDetails>
			</Accordion>
		</ListItem>
	);
};

export default BreakPointListItem;
