import PropTypes from 'prop-types';

// material-ui
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';

export default function AlertItemDelete({ title, open, handleClose }) {
    return (
        <Dialog
            open={true}
            onClose={() => handleClose(false)}
            keepMounted
            maxWidth="xs"
            aria-labelledby="item-delete-title"
            aria-describedby="item-delete-description"
        >
            {open && (
                <>
                    <DialogTitle id="item-delete-title">Are you sure you want to delete this item?</DialogTitle>
                    <DialogActions sx={{ mr: 2 }}>
                        <Button onClick={() => handleClose(false)} color="error">
                            Cancel
                        </Button>
                        <Button variant="contained" size="small" onClick={() => handleClose(true)}>
                            OK
                        </Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
}

AlertItemDelete.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    title: PropTypes.string
};
