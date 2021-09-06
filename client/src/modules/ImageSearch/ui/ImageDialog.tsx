import React, { useContext, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { pipe } from 'fp-ts/function';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import {
	ListItemText,
	Typography,
	IconButton,
	List,
	Tabs,
	AppBar,
	Tab,
	Box,
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Theme } from '@material-ui/core/styles';
import CloseOutlined from '@material-ui/icons/CloseOutlined';
import {
	useImageSearchState,
	useImageSearchDispatch,
} from '../state/useImageSearchState';
import { createSrcset } from '../useCases/createSrcset';
import { IDBUpload } from 'sharedTypes/Upload';
import { mapBreakpointsToUI } from '../useCases/mapBreakpointsToUI';
import { useFPReducer } from 'react-use-fp';
import dependencyContext from '../../../core/dependencyContext';
import {
	initialDialogState,
	imageDialogReducer,
} from '../state/imageDialogState';
import { synchronizeBreakpoints } from '../useCases/synchronizeBreakpoints';
import Snacktion from './Snacktion';
import { breakpointUIToBreakpoint } from '../helpers/breakpointMappers';
import { map as ArrMap } from 'fp-ts/Array';
import { tabA11yProps } from '../helpers/tabA11yProps';
import BreakpointsTab from './BreakpointsTab';
import PasteableCodeTab from './PasteableCodeTab';
import Tabpanel from './Tabpanel';
import { TTabPanelType } from '../state/imageSearchStateTypes';
import { useTabItemStyles, useTabStyles } from '../styles/tabItemStyles';

const useStyles = makeStyles((theme: Theme) => ({
	dialogPaper: {
		height: '90vh',
		overflow: 'auto',
	},

	dialogTitle: {
		display: 'flex',
		justifyContent: 'space-between',
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
}));

export const ImageDialog: React.FunctionComponent = () => {
	// Needed state
	const styles = useStyles();
	const tabStyles = useTabStyles();
	const tabItemStyles = useTabItemStyles();

	const makeDeps = useContext(dependencyContext);

	const [state, dispatch, actions] = useFPReducer(
		{
			LOAD_BREAKPOINTS: mapBreakpointsToUI,
			SYNC_BREAKPOINTS: synchronizeBreakpoints,
		},
		makeDeps
	)(initialDialogState, imageDialogReducer);

	const [tabValue, setTabValue] = React.useState<TTabPanelType>('code');

	// we can cast this since dialog will never be open if
	// imageUnderConfiguration is null
	const { publicPathPrefix, availableWidths, displayName, breakpoints, _id } =
		useImageSearchState().imageUnderConfiguration as IDBUpload;

	const imageSearchDispatch = useImageSearchDispatch();

	// Begin handlers

	// Dispatch a payload if updates needed, otherwise
	// no payload. Notice we convert UIbreakpoints
	// saved locally to their 'sparse' format for the IMageSearch parent
	// component.
	const handleDiscard = () => {
		if (state.hasUpdated) {
			const saveableBPs = pipe(
				state.breakpoints,
				ArrMap(breakpointUIToBreakpoint)
			);

			imageSearchDispatch({
				type: 'CLOSE_IMG_UNDER_CONFIGURATION',
				payload: { imageID: _id, breakpoints: saveableBPs },
			});
		} else {
			imageSearchDispatch({
				type: 'CLOSE_IMG_UNDER_CONFIGURATION',
			});
		}
	};

	const handleSave = () =>
		state.isSynchronizedWithBackend
			? null
			: actions.SYNC_BREAKPOINTS({
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

	const handleTabChange = (
		e: React.ChangeEvent<{}>,
		newVal: TTabPanelType
	) => {
		setTabValue(newVal);
	};

	// Begin effects
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
			keepMounted={true}
			maxWidth="md"
			classes={{ paper: styles.dialogPaper }}
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

			<DialogContent>
				<Grid container spacing={4}>
					<Grid item xs={5} sm={3}>
						{createSrcset('element')(state.breakpoints)(
							availableWidths
						)(publicPathPrefix)}
					</Grid>
					<Grid item xs={7} sm={9}>
						<List>
							<ListItemText
								primary={
									<span>
										<strong>Title: </strong>
										{displayName}
									</span>
								}
							/>
							<ListItemText
								primary={
									<span>
										<strong>Available Widths: </strong>
										{availableWidths
											.map((w) => `${w}px`)
											.join(', ')}
									</span>
								}
							/>
						</List>
					</Grid>
				</Grid>
				<Box mt={2}>
					{/* <AppBar position="static"> */}
					<Tabs
						value={tabValue}
						onChange={handleTabChange}
						aria-label="simple tabs example"
						classes={tabStyles}
					>
						<Tab
							label="code"
							{...tabA11yProps(0)}
							value="code"
							classes={tabItemStyles}
						/>
						<Tab
							label="breakpoint"
							{...tabA11yProps(1)}
							value="breakpoint"
							classes={tabItemStyles}
						/>
					</Tabs>
					<Tabpanel identifier="breakpoint" activeValue={tabValue}>
						<BreakpointsTab
							dispatch={dispatch}
							dialogState={state}
							availableWidths={availableWidths}
						/>
					</Tabpanel>
					<Tabpanel identifier="code" activeValue={tabValue}>
						<PasteableCodeTab
							breakpoints={state.breakpoints}
							publicPathPrefix={publicPathPrefix}
							availableWidths={availableWidths}
						/>
					</Tabpanel>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button
					variant="outlined"
					onClick={handleSave}
					className={styles.submitButton}
					disabled={state.isSynchronizedWithBackend}
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
