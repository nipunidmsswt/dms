import PropTypes from 'prop-types';

// material-ui
import { Button, Dialog, DialogActions, DialogTitle, DialogContent, Box, IconButton, Typography } from '@mui/material';

export default function ErrorAlert({ msg, open, handleClose }) {
    return (
        <Dialog
            open={open}
            onClose={() => handleClose(false)}
            keepMounted
            maxWidth="sm"
            fullWidth
            aria-labelledby="item-delete-title"
            aria-describedby="item-delete-description"
        >
            <DialogTitle> {/* <Typography variant="h4">Action</Typography> */}</DialogTitle>
            <DialogContent>
                <Typography variant="h6">{msg}</Typography>
                {/* <Typography variant="subtitle2">You can't undo this operation</Typography> */}
            </DialogContent>
            <DialogActions>
                <Button variant="contained" className="btnSave" onClick={() => handleClose(true)}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
}

ErrorAlert.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    msg: PropTypes.string
};
