import React, { useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import TextField from '@material-ui/core/TextField';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Accordion from '@material-ui/core/Accordion';
import { sizeFromBreakpoint } from '../useCases/createSrcset';
import { ChangeEventHandler } from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import { TBreakpointUI } from '../state/imageConfigurationStateTypes';
import { useAppDispatch } from '../../appState/useAppState';
import {
	breakpointToBreakpointUI,
	breakpointUIToBreakpoint,
} from '../helpers/breakpointMappers';
import { ISavedBreakpoint } from '../../../../../sharedTypes/Breakpoint';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { Close } from '@material-ui/icons';
import RestoreIcon from '@material-ui/icons/Restore';

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
					>
						<DeleteIcon />
					</IconButton>
					<IconButton
						onClick={() => setExpanded(true)}
						data-testid="bp-edit"
						className={classes.editButton}
						aria-label={`edit-breakpoint-${position}`}
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
						aria-label={`discard-breakpoint-edits-${position}`}
					>
						<RestoreIcon />
					</IconButton>
					<IconButton
						onClick={submitEdits}
						className={classes.keepButton}
						data-testid="bp-keep"
						aria-label={`keep-breakpoint-edits-${position}`}
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
			<Accordion expanded={isExpanded || formState.editing}>
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
							<option value="min">min-width</option>
							<option value="max">max-width</option>
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
						>
							<option value="min">max-width</option>
							<option value="max">min-width</option>
						</TextField>
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
							<option value="vw">vw</option>
							<option value="px">px</option>
							<option value="em">em</option>
						</TextField>
					</form>
				</AccordionDetails>
			</Accordion>
		</ListItem>
	);
};

export default BreakPointListItem;
