import PropTypes from 'prop-types';

// material-ui
import { Button, Dialog, DialogActions, DialogTitle, DialogContent, Box, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

export default function ExitAlert({ title, open, handleClose }) {
    const navigate = useNavigate();
    return (
        <Dialog
            open={true}
            onClose={() => handleClose(false)}
            keepMounted
            maxWidth="sm"
            fullWidth
            aria-labelledby="item-delete-title"
            aria-describedby="item-delete-description"
        >
            <DialogTitle>
                {' '}
                <Typography variant="h4">Action</Typography>
            </DialogTitle>
            <DialogContent>
                <Typography variant="h6">Are you sure you want to Continue this?</Typography>
                {/* <Typography variant="subtitle2">You can't undo this operation</Typography> */}
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={() => {
                        handleClose(false);
                        navigate('/master/hotelview');
                    }}
                    color="error"
                >
                    No
                </Button>
                <Button variant="contained" className="btnSave" onClick={() => handleClose(true)}>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
}

ExitAlert.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    title: PropTypes.string
};
