import { List } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FunctionComponent } from 'react';
import { TAvailableImageWidths } from '../../../../../sharedTypes/Upload';
import { useAppDispatch } from '../../appState/useAppState';
import { IImageConfigurationState } from '../state/imageConfigurationStateTypes';
import BreakPointListItem from './BreakPointListItem';
import NewBreakpointListItem from './NewBreakpointListItem';

interface BreakpointDisplayProps {
	dialogState: IImageConfigurationState;
	availableWidths: TAvailableImageWidths;
}

const useStyles = makeStyles(() => ({
	list: {
		padding: 0,
		margin: 0,
	},
}));

const BreakpointsTab: FunctionComponent<BreakpointDisplayProps> = ({
	dialogState,
}) => {
	const dispatch = useAppDispatch();

	const classes = useStyles();
	return (
		<List className={classes.list}>
			<NewBreakpointListItem dispatch={dispatch} />
			{dialogState.breakpoints.map((bp, i) => {
				return <BreakPointListItem {...bp} key={bp._id} position={i} />;
			})}
		</List>
	);
};

export default BreakpointsTab;
