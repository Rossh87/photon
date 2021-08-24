import React, { useContext, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { flow, pipe } from 'fp-ts/function';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import { ListItemText, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { Paper, List, ListItemIcon, ListItem } from '@material-ui/core';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import PhotoOutlinedIcon from '@material-ui/icons/PhotoOutlined';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { TextareaAutosize } from '@material-ui/core';
import {
	useImageSearchState,
	useImageSearchDispatch,
} from '../state/useImageSearchState';
import { createSrcset } from '../useCases/createSrcset';
import { IDBUpload } from '../../../../../sharedTypes/Upload';
import BreakPointListItem from './BreakPointListItem';
import { mapBreakpointsToUI } from '../useCases/mapBreakpointsToUI';
import { useFPReducer } from 'react-use-fp';
import dependencyContext from '../../../core/dependencyContext';
import {
	initialDialogState,
	imageDialogReducer,
} from '../state/imageDialogState';
import NewBreakpointListItem from './NewBreakpointListItem';
import { makeDefaultUIBreakpoint } from '../helpers/makeDefaultUIBreakpoints';

const useStyles = makeStyles((theme: Theme) => ({
	paper: {
		width: '100vw',
		maxWidth: '1500px',
	},

	createNew: {
		padding: '2rem',
		width: '100%',
	},
}));

export const ImageDialog: React.FunctionComponent = () => {
	const styles = useStyles();

	const makeDeps = useContext(dependencyContext);

	const [state, dispatch, actions] = useFPReducer(
		{ LOAD_BREAKPOINTS: mapBreakpointsToUI },
		makeDeps
	)(initialDialogState, imageDialogReducer);

	// we can cast this since dialog will never be open if
	// imageUnderConfiguration is null
	const { publicPathPrefix, availableWidths, displayName, breakPoints } =
		useImageSearchState().imageUnderConfiguration as IDBUpload;

	const imageSearchDispatch = useImageSearchDispatch();

	const handleClose = () =>
		imageSearchDispatch({ type: 'CLOSE_IMG_UNDER_CONFIGURATION' });

	useEffect(() => {
		actions.LOAD_BREAKPOINTS(breakPoints);
	}, []);

	return (
		<Dialog
			open={true}
			TransitionComponent={Transition}
			onClose={handleClose}
			aria-labelledby={`img-dialog-${displayName}`}
			aria-describedby="alert-dialog-slide-description"
			keepMounted={false}
			maxWidth="md"
		>
			<DialogTitle id={`img-dialog-${displayName}`}>
				{`Embed code for ${displayName}`}
			</DialogTitle>
			<DialogContent>
				<Grid justifyContent="center" container>
					<Grid item xs={4}>
						{createSrcset('element')(state.breakPoints)(
							availableWidths
						)(publicPathPrefix)}
					</Grid>
					<Grid spacing={2} container>
						<Grid item xs={12}>
							<Paper
								elevation={2}
								id={`embed-code-${displayName}`}
								square={true}
								style={{ height: '100%' }}
							>
								<Typography variant="h4">
									Your Breakpoints
								</Typography>
								<Typography variant="h4">Defaults</Typography>
								<List>
									<NewBreakpointListItem
										dispatch={dispatch}
									/>
									{state.breakPoints.map((bp) => {
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
								<Typography variant="h4">Custom</Typography>
							</Paper>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="h4">
								Paste this code directly into your HTML
							</Typography>
							<code
								data-testid="pasteable-HTML-block"
								style={{ maxWidth: '100%', width: '100%' }}
							>
								{
									createSrcset('string')(state.breakPoints)(
										availableWidths
									)(publicPathPrefix) as string
								}
							</code>
						</Grid>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="primary">
					Disagree
				</Button>
				<Button onClick={handleClose} color="primary">
					Agree
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ImageDialog;

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & { children?: React.ReactElement<any, any> },
	ref: React.Ref<unknown>
) {
	return <Slide direction="up" ref={ref} {...props} />;
});
