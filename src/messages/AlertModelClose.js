import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
// material-ui
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';

// used to close main popup
export default function AlertModelClose({ title, open, handleCloseModel }) {
    return (
        <Dialog
            open={true}
            onClose={() => handleCloseModel(false)}
            keepMounted
            maxWidth="xs"
            aria-labelledby="item-delete-title"
            aria-describedby="item-delete-description"
        >
            {open && (
                <>
                    <Alert variant="filled" severity="warning">
                        Would you like to exit without saving the details?
                        {/* <DialogTitle id="item-delete-title"></DialogTitle> */}
                        <DialogActions sx={{ mr: 2 }}>
                            <Button variant="contained" size="small" onClick={() => handleCloseModel(true)}>
                                Yes
                            </Button>
                            <Button onClick={() => handleCloseModel(false)} color="error">
                                No
                            </Button>
                        </DialogActions>
                    </Alert>
                </>
            )}
        </Dialog>
    );
}

AlertModelClose.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    title: PropTypes.string
};
