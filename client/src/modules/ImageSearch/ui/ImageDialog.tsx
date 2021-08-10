import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import { TFetchedImageData } from '../domain/ImageSearchDomainTypes';
import { Grid } from '@material-ui/core/Grid';

interface IProps extends TFetchedImageData {
    isOpen: boolean;
    setOpen: (a: boolean) => void;
}

export const ImageDialog: React.FunctionComponent<IProps> = ({
    isOpen,
    setOpen,
    displayName,
}) => {
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button
                variant="outlined"
                color="primary"
                onClick={handleClickOpen}
            >
                Slide in alert dialog
            </Button>
            <Dialog
                open={isOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby={`img-dialog-${displayName}`}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">
                    {`Embed code for ${displayName}`}
                </DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={12}></Grid>

                        <Grid item xs={12} m={6}></Grid>
                        <Grid item xs={12} m={6}></Grid>
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
        </div>
    );
};

export default ImageDialog;

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
