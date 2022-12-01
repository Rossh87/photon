import React, { useState } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import TextField from '@mui/material/TextField';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Accordion from '@mui/material/Accordion';
import { sizeFromBreakpoint } from '../useCases/createSrcset';
import { ChangeEventHandler } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import { TBreakpointUI } from '../state/imageConfigurationStateTypes';
import { useAppDispatch } from '../../appState/useAppState';
import {
	breakpointToBreakpointUI,
	breakpointUIToBreakpoint,
} from '../helpers/breakpointMappers';
import { ISavedBreakpoint } from '../../../../../sharedTypes/Breakpoint';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Close } from '@mui/icons-material';
import RestoreIcon from '@mui/icons-material/Restore';
import MenuItem from '@mui/material/MenuItem';

const useStyles = makeStyles((theme: Theme) => {
	return {
		deleteButton: {
			color: theme.palette.warning.main,
		},

		keepButton: {
			color: theme.palette.success.main,
		},

		successButton: {
			color: theme.palette.success.main,
		},

		clearButton: {
			color: theme.palette.error.main,
		},

		editButton: {
			color: theme.palette.primary.main,
		},

		closeButton: {
			color: theme.palette.common.black,
		},
	};
});

interface Props {
	// use this to distinguish controls in aria labels
	position: number;
}

const BreakPointListItem: React.FunctionComponent<ISavedBreakpoint & Props> = ({
	position,
	...savedBP
}) => {
	const classes = useStyles();

	// INCOMING props.  These are what render initial UI, and will be sync'ed
	// every render
	const propState = breakpointToBreakpointUI(savedBP);

	// LOCAL component state.  These are what track form fields.
	const [formState, setFormState] = useState<TBreakpointUI>({ ...propState });

	const dispatch = useAppDispatch();

	const [isExpanded, setExpanded] = React.useState(false);

	const handleChange =
		(key: keyof typeof propState): ChangeEventHandler<HTMLInputElement> =>
		(e) => {
			setFormState((prev) => ({
				...prev,
				editing: prev.editing || prev[key] !== e.target.value,
				[key]: e.target.value,
			}));
		};

	const handleSubmit = () => {
		setExpanded(false);
	};

	const submitEdits = () => {
		setExpanded(false);
		setFormState({ ...formState, editing: false });
		dispatch({
			type: 'IMAGE_CONFIG/UPDATE_ONE_BREAKPOINT',
			payload: breakpointUIToBreakpoint(formState),
		});
	};

	const discardEdits = () => {
		setExpanded(false);
		setFormState(propState);
	};

	const handleDelete = () =>
		dispatch({
			type: 'IMAGE_CONFIG/DELETE_BREAKPOINT',
			payload: propState._id,
		});

	const renderControls = () => {
		if (origin === 'default') {
			return null;
		}

		if (!isExpanded && !formState.editing) {
			return (
				<>
					<IconButton
						onClick={handleDelete}
						data-testid="bp-delete"
						aria-label={`delete-breakpoint-${position}`}
						size="large"
					>
						<DeleteIcon />
					</IconButton>
					<IconButton
						onClick={() => setExpanded(true)}
						data-testid="bp-edit"
						className={classes.editButton}
						aria-label={`edit-breakpoint-${position}`}
						size="large"
					>
						<EditIcon />
					</IconButton>
				</>
			);
		} else if (isExpanded && !formState.editing) {
			return (
				<IconButton
					onClick={() => {
						setExpanded(false);
					}}
					data-testid="bp-close"
					className={classes.closeButton}
					aria-label={`close-breakpoint-${position}`}
					size="large"
				>
					<Close />
				</IconButton>
			);
		} else {
			return (
				<>
					<IconButton
						onClick={discardEdits}
						data-testid="bp-discard"
						// className={classes.clearButton}
						aria-label={`discard breakpoint edits`}
						size="large"
					>
						<RestoreIcon />
					</IconButton>
					<IconButton
						onClick={submitEdits}
						className={classes.keepButton}
						data-testid="bp-keep"
						aria-label={`keep edits`}
						size="large"
					>
						<CheckIcon />
					</IconButton>
				</>
			);
		}
	};

	return (
		<ListItem
			data-testid={`breakpoint-item-${origin}`}
			disabled={origin === 'default' ? true : false}
			dense
			disableGutters={true}
		>
			<Accordion
				expanded={isExpanded || formState.editing}
				sx={{ width: '100%' }}
			>
				<AccordionSummary>
					<ListItemAvatar>
						<Avatar>
							<SettingsIcon />
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						primary={sizeFromBreakpoint(
							breakpointUIToBreakpoint(formState)
						)}
						secondary={
							origin === 'default' ? 'Generated by default' : null
						}
					/>
					<ListItemSecondaryAction>
						{renderControls()}
					</ListItemSecondaryAction>
				</AccordionSummary>
				<AccordionDetails>
					{/* Careful here--need to be grabbing property names from controlled component state, not
					from React props of same name
					 */}
					<form onSubmit={handleSubmit}>
						<TextField
							value={formState.queryType}
							onChange={handleChange('queryType')}
							select
							label="query type"
							id={`queryType-input-${formState._id}`}
						>
							<MenuItem value={'min'}>min-width</MenuItem>
							<MenuItem value={'max'}>max-width</MenuItem>
						</TextField>
						<TextField
							value={formState.mediaWidth}
							onChange={handleChange('mediaWidth')}
							inputProps={{
								inputMode: 'numeric',
								pattern: '[0-9]*',
								maxLength: '4',
							}}
							label="media width"
							name="mediaWidth"
							id={`mediaWidth-input-${formState._id}`}
							data-testid={`mediaWidth-input-${formState._id}`}
						/>
						<TextField
							value={formState.slotWidth}
							onChange={handleChange('slotWidth')}
							inputProps={{
								inputMode: 'numeric',
								pattern: '[0-9]*',
								maxLength: '4',
							}}
							label="slot width"
							name="slotWidth"
							id={`slotWidth-input-${formState._id}`}
						/>
						<TextField
							value={formState.slotUnit}
							onChange={handleChange('slotUnit')}
							select
							label="slot unit"
							name="slotUnit"
							id={`slotUnit-input-${formState._id}`}
						>
							<MenuItem value={'vw'}>vw</MenuItem>
							<MenuItem value={'px'}>px</MenuItem>
							<MenuItem value={'em'}>em</MenuItem>
						</TextField>
					</form>
				</AccordionDetails>
			</Accordion>
		</ListItem>
	);
};

export default BreakPointListItem;
