import React, { useContext, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { flow, pipe } from 'fp-ts/function';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import {
	ListItemText,
	Typography,
	Snackbar,
	IconButton,
	Paper,
	List,
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { Alert } from '@material-ui/lab';
import { makeStyles, Theme } from '@material-ui/core/styles';
import CloseOutlined from '@material-ui/icons/CloseOutlined';
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
import { synchronizeBreakpoints } from '../useCases/synchronizeBreakpoints';
import SnackbarAction from './Snacktion';
import Snacktion from './Snacktion';

const useStyles = makeStyles((theme: Theme) => ({
	snackBar: {
		backgroundColor: theme.palette.warning.main,
	},

	paper: {
		width: '100vw',
		maxWidth: '1500px',
	},

	dialogTitle: {
		display: 'flex',
		justifyContent: 'space-between',
		width: '100%',
	},

	createNew: {
		padding: '2rem',
		width: '100%',
	},

	submitButton: {
		color: theme.palette.success.main,
		fontWeight: theme.typography.fontWeightBold,
		fontSize: '1rem',
		border: `1px solid ${theme.palette.success.main}`,
	},

	discardButton: {
		color: theme.palette.warning.main,
		fontWeight: theme.typography.fontWeightBold,
		fontSize: theme.typography.fontSize,
	},

	dialogActions: {
		display: 'flex',
		justifyContent: 'space-between',
	},
}));

export const ImageDialog: React.FunctionComponent = () => {
	const styles = useStyles();

	const makeDeps = useContext(dependencyContext);

	const [state, dispatch, actions] = useFPReducer(
		{
			LOAD_BREAKPOINTS: mapBreakpointsToUI,
			SYNC_BREAKPOINTS: synchronizeBreakpoints,
		},
		makeDeps
	)(initialDialogState, imageDialogReducer);

	// we can cast this since dialog will never be open if
	// imageUnderConfiguration is null
	const { publicPathPrefix, availableWidths, displayName, breakpoints, _id } =
		useImageSearchState().imageUnderConfiguration as IDBUpload;

	const imageSearchDispatch = useImageSearchDispatch();

	const handleDiscard = () =>
		imageSearchDispatch({ type: 'CLOSE_IMG_UNDER_CONFIGURATION' });

	const handleSave = () =>
		actions.SYNC_BREAKPOINTS({
			imageID: _id,
			breakpoints: state.breakpoints,
		});

	const handleUnsavedClose = () =>
		dispatch({ type: 'UNSAVED_CLOSE_ATTEMPT' });

	const handleCloseAttempt = () =>
		state.isSynchronizedWithBackend
			? handleDiscard()
			: handleUnsavedClose();

	const resetError = () => dispatch({ type: 'RESET_ERROR' });

	const resetStatus = () => dispatch({ type: 'RESET_STATUS' });

	useEffect(() => {
		actions.LOAD_BREAKPOINTS(breakpoints);
	}, []);

	return (
		<Dialog
			open={true}
			TransitionComponent={Transition}
			onClose={handleCloseAttempt}
			aria-labelledby={`img-dialog-${displayName}`}
			aria-describedby="alert-dialog-slide-description"
			keepMounted={false}
			maxWidth="md"
		>
			<DialogTitle
				disableTypography
				id={`img-dialog-${displayName}`}
				style={{ width: '100%' }}
				className={styles.dialogTitle}
			>
				<Typography variant="h6">
					{`Embed code for ${displayName}`}
				</Typography>
				<IconButton aria-label="close" onClick={handleCloseAttempt}>
					<CloseOutlined />
				</IconButton>
			</DialogTitle>

			<DialogContent dividers>
				<Grid justifyContent="center" container>
					<Grid item xs={4}>
						{createSrcset('element')(state.breakpoints)(
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
									{state.breakpoints.map((bp) => {
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
									createSrcset('string')(state.breakpoints)(
										availableWidths
									)(publicPathPrefix) as string
								}
							</code>
						</Grid>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button
					variant="outlined"
					onClick={handleSave}
					className={styles.submitButton}
				>
					Save
				</Button>
			</DialogActions>
			<Snacktion
				status={state.snackbarStatus}
				handleDiscard={handleDiscard}
				handleSave={handleSave}
				error={state.error}
				resetError={resetError}
				resetStatus={resetStatus}
			/>
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
