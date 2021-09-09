import React, { Dispatch } from 'react';
import {
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
	IconButton,
	AccordionSummary,
	AccordionDetails,
	TextField,
} from '@material-ui/core';
import { ArrowDropDownCircleOutlined } from '@material-ui/icons';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import PhotoOutlinedIcon from '@material-ui/icons/PhotoOutlined';
import Accordion from '@material-ui/core/Accordion';
import { sizeFromBreakpoint } from '../useCases/createSrcset';
import { ChangeEventHandler } from 'react';
import {
	IBreakpointUI,
	TDialogActions,
	TUserBreakpointUI,
} from '../state/imageDialogStateTypes';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

interface INewBreakpointItemProps {
	dispatch: Dispatch<TDialogActions>;
}

const NewBreakpointListItem: React.FunctionComponent<INewBreakpointItemProps> =
	({ dispatch }) => {
		const handleClick: React.MouseEventHandler = (e) => {
			e.preventDefault();
			dispatch({ type: 'CREATE_NEW_BREAKPOINT' });
		};
		return (
			<ListItem onClick={handleClick} dense disableGutters={true}>
				<Accordion style={{ width: '100%' }} expanded={false}>
					<AccordionSummary aria-label="Expand">
						<ListItemAvatar>
							<Avatar>
								<AddCircleOutlineIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary="Create a new query" />
					</AccordionSummary>
					<AccordionDetails></AccordionDetails>
				</Accordion>
			</ListItem>
		);
	};

export default NewBreakpointListItem;
