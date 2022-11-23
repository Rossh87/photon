import React, { Dispatch } from 'react';
import {
	ListItem,
	ListItemText,
	AccordionSummary,
	AccordionDetails,
} from '@mui/material';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Accordion from '@mui/material/Accordion';
import { TImageConfigurationActions } from '../state/imageConfigurationStateTypes';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useAppDispatch } from '../../appState/useAppState';

interface INewBreakpointItemProps {
	dispatch: Dispatch<TImageConfigurationActions>;
}

const NewBreakpointListItem: React.FunctionComponent<
	INewBreakpointItemProps
> = () => {
	const dispatch = useAppDispatch();

	const handleClick: React.MouseEventHandler = (e) => {
		e.preventDefault();
		dispatch({ type: 'IMAGE_CONFIG/CREATE_NEW_BREAKPOINT' });
	};
	return (
		<ListItem button onClick={handleClick} dense disableGutters={true}>
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
