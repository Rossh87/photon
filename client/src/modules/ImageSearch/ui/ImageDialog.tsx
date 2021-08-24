import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { Paper, List, ListItemIcon } from '@material-ui/core';
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
import {
	createSrcset,
	makeDefaultBreakpoint,
} from '../../../core/createSrcset';
import { IDBUpload } from '../../../../../sharedTypes/Upload';
import BreakPointListItem from './BreakPointListItem';

const useStyles = makeStyles((theme: Theme) => ({
	paper: {
		width: '100vw',
		maxWidth: '1500px',
	},
}));

export const ImageDialog: React.FunctionComponent = () => {
	// we can cast this since dialog will never be open if
	// imageUnderConfiguration is null
	const image = useImageSearchState().imageUnderConfiguration as IDBUpload;
	const imageSearchDispatch = useImageSearchDispatch();

	const classes = useStyles();

	const { publicPathPrefix, availableWidths, displayName, breakPoints } =
		image;

	const handleClose = () =>
		imageSearchDispatch({ type: 'CLOSE_IMG_UNDER_CONFIGURATION' });

	const defaults = availableWidths.map(makeDefaultBreakpoint);

	return (
		<Dialog
			open={image === null ? false : true}
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
				<Grid justify="center" container>
					<Grid item xs={4}>
						{createSrcset('element')(breakPoints)(availableWidths)(
							publicPathPrefix
						)}
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
									{defaults.map((bp) => {
										return <BreakPointListItem {...bp} />;
									})}
								</List>
								<Typography variant="h4">Custom</Typography>
							</Paper>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="h4">
								Paste this code directly into your HTML
							</Typography>
							<TextareaAutosize
								defaultValue={
									createSrcset('string')(breakPoints)(
										availableWidths
									)(publicPathPrefix) as string
								}
								style={{ maxWidth: '100%', width: '100%' }}
								autoCorrect="off"
								spellCheck="false"
							></TextareaAutosize>
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
