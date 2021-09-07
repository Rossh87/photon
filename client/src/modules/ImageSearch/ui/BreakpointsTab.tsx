import { List, makeStyles } from '@material-ui/core';
import { TabPanel } from '@material-ui/lab';
import { flow } from 'fp-ts/lib/function';
import React, { Dispatch, FunctionComponent } from 'react';
import { TAvailableImageWidths } from '../../../../../sharedTypes/Upload';
import {
	makeDefaultUIBreakpoint,
	makeDefaultUIBreakpoints,
} from '../helpers/makeDefaultUIBreakpoints';
import { IDialogState, TDialogActions } from '../state/imageDialogState';
import BreakPointListItem from './BreakPointListItem';
import NewBreakpointListItem from './NewBreakpointListItem';

interface BreakpointDisplayProps {
	dispatch: Dispatch<TDialogActions>;
	dialogState: IDialogState;
	availableWidths: TAvailableImageWidths;
}

const useStyles = makeStyles((theme) => ({
	list: {
		padding: 0,
		margin: 0,
	},
}));

const BreakpointsTab: FunctionComponent<BreakpointDisplayProps> = ({
	dispatch,
	dialogState,
	availableWidths,
}) => {
	const classes = useStyles();
	return (
		<List className={classes.list}>
			<NewBreakpointListItem dispatch={dispatch} />
			{dialogState.breakpoints.map((bp) => {
				return (
					<BreakPointListItem
						{...bp}
						dispatch={dispatch}
						key={bp._id}
					/>
				);
			})}
			{availableWidths.map(
				flow(makeDefaultUIBreakpoint, (bp) => (
					<BreakPointListItem
						{...bp}
						dispatch={dispatch}
						key={bp._id}
					/>
				))
			)}
		</List>
	);
};

export default BreakpointsTab;
