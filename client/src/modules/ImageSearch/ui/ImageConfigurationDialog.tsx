import React, { Dispatch, useContext, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { pipe } from 'fp-ts/function';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Theme } from '@material-ui/core/styles';
import CloseOutlined from '@material-ui/icons/CloseOutlined';
import { createSrcset } from '../useCases/createSrcset';
import { tabA11yProps } from '../helpers/tabA11yProps';
import BreakpointsTab from './BreakpointsTab';
import PasteableCodeTab from './PasteableCodeTab';
import Tabpanel from './Tabpanel';
import { TTabPanelType } from '../state/imageSearchStateTypes';
import { useTabItemStyles, useTabStyles } from '../styles/tabItemStyles';
import { IConfigurableImage } from '../state/imageConfigurationStateTypes';
import { formatJoinDate } from '../../../core/date';
import {
	useAppActions,
	useAppDispatch,
	useAppState,
} from '../../appState/useAppState';

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

	deleteButton: {
		backgroundColor: theme.palette.error.main,
		fontWeight: theme.typography.fontWeightBold,
		fontSize: theme.typography.fontSize,
	},
}));

export const ImageConfigurationDialog: React.FunctionComponent = () => {
	// Needed state
	const styles = useStyles();
	const tabStyles = useTabStyles();
	const tabItemStyles = useTabItemStyles();

	const appDispatch = useAppDispatch();
	const { user, images, imageUnderConfiguration } = useAppState();
	const actions = useAppActions();

	// Aight to cast here since this won't be open if IUC is null
	const {
		publicPathPrefix,
		availableWidths,
		displayName,
		breakpoints,
		_id,
		addedOn,
		isSynchronizedWithBackend,
		open,
	} = imageUnderConfiguration as IConfigurableImage;

	const [tabValue, setTabValue] = React.useState<TTabPanelType>('code');

	// updates client app state if there have been any
	// updates persisted to database since dialog was opened
	const handleDiscard = () =>
		appDispatch({ type: 'IMAGE_CONFIG/CLOSE_IMAGE_UNDER_CONFIGURATION' });

	const handleBreakpointSave = () =>
		isSynchronizedWithBackend
			? null
			: actions.SYNC_BREAKPOINTS({
					imageID: _id,
					breakpoints: breakpoints,
			  });

	const handleUnsavedClose = () =>
		appDispatch({
			type: 'META/ADD_APP_MESSAGE',
			payload: {
				messageKind: 'repeat',
				eventName: 'unsaved Dialog close attempt',
				displayMessage:
					'Are you sure you want to discard without saving?',
				severity: 'warning',
				action: {
					kind: 'advanced',
					proceed: {
						buttonText: 'discard',
						handler: function () {
							handleDiscard();
							appDispatch({ type: 'META/REMOVE_APP_MESSAGE' });
						},
					},
					abort: {
						buttonText: 'save',
						handler: handleBreakpointSave,
					},
				},
				timeout: 10000,
			},
		});

	const handleCloseAttempt = () =>
		isSynchronizedWithBackend ? handleDiscard() : handleUnsavedClose();

	const handleDeleteAttempt = () =>
		appDispatch({
			type: 'META/ADD_APP_MESSAGE',
			payload: {
				messageKind: 'repeat',
				eventName: 'upload deletion attempt',
				displayMessage: 'This action is irreversible--please be sure.',
				severity: 'error',
				action: {
					kind: 'advanced',
					proceed: {
						buttonText: 'delete',
						handler: () =>
							actions.INIT_UPLOAD_DELETION({
								updatedImageCount:
									(user?.imageCount as number) - 1,
								idToDelete: _id,
							}),
					},
					abort: {
						buttonText: 'go back',
						handler: () =>
							appDispatch({ type: 'META/REMOVE_APP_MESSAGE' }),
					},
				},
			},
		});

	const handleTabChange = (
		e: React.ChangeEvent<{}>,
		newVal: TTabPanelType
	) => {
		setTabValue(newVal);
	};

	return (
		<Dialog
			open={open}
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
				<IconButton
					aria-label="close-dialog"
					onClick={handleCloseAttempt}
				>
					<CloseOutlined />
				</IconButton>
			</DialogTitle>

			<DialogContent>
				<Grid container spacing={4}>
					<Grid item xs={5} sm={3}>
						{createSrcset('element')(breakpoints)(availableWidths)(
							publicPathPrefix
						)}
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
							<ListItemText
								primary={
									<span>
										<strong>Added On: </strong>
										{formatJoinDate(addedOn)}
									</span>
								}
							/>
						</List>
						<Button
							color="primary"
							variant="contained"
							onClick={handleDeleteAttempt}
							className={styles.deleteButton}
						>
							Delete
						</Button>
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
							dialogState={
								imageUnderConfiguration as IConfigurableImage
							}
							availableWidths={availableWidths}
						/>
					</Tabpanel>
					<Tabpanel identifier="code" activeValue={tabValue}>
						<PasteableCodeTab
							publicPathPrefix={publicPathPrefix}
							availableWidths={availableWidths}
							breakpoints={breakpoints}
						/>
					</Tabpanel>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button
					color="primary"
					size="large"
					onClick={handleBreakpointSave}
					disabled={isSynchronizedWithBackend}
				>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ImageConfigurationDialog;

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & { children?: React.ReactElement<any, any> },
	ref: React.Ref<unknown>
) {
	return <Slide direction="up" ref={ref} {...props} />;
});
