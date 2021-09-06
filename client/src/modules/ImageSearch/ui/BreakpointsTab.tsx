import { List } from '@material-ui/core';
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

const BreakpointsTab: FunctionComponent<BreakpointDisplayProps> = ({
	dispatch,
	dialogState,
	availableWidths,
}) => {
	return (
		<List>
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
