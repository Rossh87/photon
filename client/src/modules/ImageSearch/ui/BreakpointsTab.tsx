import { List, makeStyles } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { TAvailableImageWidths } from '../../../../../sharedTypes/Upload';
import { useAppDispatch } from '../../appState/useAppState';
import { IImageConfigurationState } from '../state/imageConfigurationStateTypes';
import BreakPointListItem from './BreakPointListItem';
import NewBreakpointListItem from './NewBreakpointListItem';

interface BreakpointDisplayProps {
	dialogState: IImageConfigurationState;
	availableWidths: TAvailableImageWidths;
}

const useStyles = makeStyles((theme) => ({
	list: {
		padding: 0,
		margin: 0,
	},
}));

const BreakpointsTab: FunctionComponent<BreakpointDisplayProps> = ({
	dialogState,
	availableWidths,
}) => {
	const dispatch = useAppDispatch();

	const classes = useStyles();
	return (
		<List className={classes.list}>
			<NewBreakpointListItem dispatch={dispatch} />
			{dialogState.breakpoints.map((bp) => {
				return <BreakPointListItem {...bp} key={bp._id} />;
			})}
		</List>
	);
};

export default BreakpointsTab;
