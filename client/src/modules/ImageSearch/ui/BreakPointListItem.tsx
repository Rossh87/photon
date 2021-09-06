import React, { Dispatch } from 'react';
import {
	formatBPPropsForLocal,
	formatBPStateForDispatch,
} from '../helpers/formatBPStateForDispatch';
import {
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
	AccordionSummary,
	AccordionDetails,
	TextField,
	Button,
	makeStyles,
	Theme,
} from '@material-ui/core';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Accordion from '@material-ui/core/Accordion';
import { sizeFromBreakpoint } from '../useCases/createSrcset';
import { ChangeEventHandler } from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import {
	IBreakpointUI,
	ILocalBreakpointUI,
	TDialogActions,
	TUserBreakpointUI,
} from '../state/imageDialogState';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

const useStyles = makeStyles((theme: Theme) => {
	return {
		deleteButton: {
			color: theme.palette.warning.main,
		},

		keepButton: {
			color: theme.palette.success.main,
		},
	};
});

const BreakPointListItem: React.FunctionComponent<
	IBreakpointUI & { dispatch: Dispatch<TDialogActions> }
> = (props) => {
	const classes = useStyles();

	const {
		mediaWidth,
		slotUnit,
		slotWidth,
		queryType,
		editing,
		_id,
		origin,
		dispatch,
	} = props;

	const [isExpanded, setExpanded] = React.useState(false);

	// state to track user's edits
	const [bpState, setBPState] = React.useState<ILocalBreakpointUI>({
		mediaWidth: '10',
		slotUnit: 'px',
		slotWidth: '10',
		queryType: 'max',
		editing: false,
		_id: '1234',
		origin: 'user',
		validationErrs: [null, null, null, null],
	});

	React.useEffect(() => {
		// This essentially serves as a reset whenever we update props by submitting changes
		setBPState(
			formatBPPropsForLocal({
				mediaWidth,
				slotUnit,
				slotWidth,
				queryType,
				editing,
				_id,
				origin,
				validationErrs: [null, null, null, null],
			})
		);
	}, [props]);

	const handleChange =
		(key: keyof typeof bpState): ChangeEventHandler<HTMLInputElement> =>
		(e) =>
			setBPState((prev) => ({
				...bpState,
				editing: prev.editing || prev[key] !== e.target.value,
				[key]: e.target.value,
			}));

	const handleSubmit = () => {
		setExpanded(false);
	};

	const submitEdits = () => {
		setExpanded(false);
		const stateToDispatch = {
			...formatBPStateForDispatch(bpState),
			editing: false,
		};

		dispatch({
			type: 'UPDATE_ONE_BREAKPOINT',
			payload: stateToDispatch as TUserBreakpointUI,
		});

		setBPState(
			formatBPPropsForLocal({
				mediaWidth,
				slotUnit,
				slotWidth,
				queryType,
				editing: false,
				_id,
				origin,
				validationErrs: [null, null, null, null],
			})
		);
	};

	const discardEdits = () => {
		setExpanded(false);
		setBPState(
			formatBPPropsForLocal({
				mediaWidth,
				slotUnit,
				slotWidth,
				queryType,
				editing: false,
				_id,
				origin,
				validationErrs: [null, null, null, null],
			})
		);
	};

	const handleDelete = () =>
		dispatch({ type: 'DELETE_BREAKPOINT', payload: _id });

	const renderControls = () => {
		if (origin === 'default') return null;

		if (!isExpanded && !bpState.editing) {
			return (
				<>
					<Button
						className={classes.deleteButton}
						variant="outlined"
						onClick={handleDelete}
					>
						Delete
					</Button>
					<Button
						variant="outlined"
						onClick={() => setExpanded(true)}
					>
						Edit
					</Button>
				</>
			);
		} else if (isExpanded && !bpState.editing) {
			return (
				<Button
					variant="outlined"
					onClick={() => {
						setExpanded(false);
					}}
				>
					Close
				</Button>
			);
		} else {
			return (
				<>
					<Button
						variant="outlined"
						className={classes.deleteButton}
						onClick={discardEdits}
					>
						Discard
					</Button>
					<Button
						variant="outlined"
						className={classes.keepButton}
						onClick={submitEdits}
					>
						Keep
					</Button>
				</>
			);
		}
	};

	return (
		<ListItem
			data-testid={`breakpoint-item-${origin}`}
			disabled={origin === 'default' ? true : false}
			dense
		>
			<Accordion expanded={bpState.editing || isExpanded}>
				<AccordionSummary aria-label="Expand">
					<ListItemAvatar>
						<Avatar>
							<SettingsIcon />
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						primary={sizeFromBreakpoint(bpState)}
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
							value={bpState.queryType}
							onChange={handleChange('queryType')}
							select
							label="query type"
							id={`queryType-input-${bpState._id}`}
						>
							<option value="min">min-width</option>
							<option value="max">max-width</option>
						</TextField>
						<TextField
							value={bpState.mediaWidth}
							onChange={handleChange('mediaWidth')}
							inputProps={{
								inputMode: 'numeric',
								pattern: '[0-9]*',
								maxLength: '4',
							}}
							label="media width"
							name="mediaWidth"
							id={`mediaWidth-input-${bpState._id}`}
							data-testid={`mediaWidth-input-${bpState._id}`}
						>
							<option value="min">max-width</option>
							<option value="max">min-width</option>
						</TextField>
						<TextField
							value={bpState.slotWidth}
							onChange={handleChange('slotWidth')}
							inputProps={{
								inputMode: 'numeric',
								pattern: '[0-9]*',
								maxLength: '4',
							}}
							label="slot width"
							name="slotWidth"
							id={`slotWidth-input-${bpState._id}`}
						/>
						<TextField
							value={bpState.slotUnit}
							onChange={handleChange('slotUnit')}
							select
							label="slot unit"
							name="slotUnit"
							id={`slotUnit-input-${bpState._id}`}
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
