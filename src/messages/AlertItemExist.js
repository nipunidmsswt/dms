import PropTypes from 'prop-types';

// material-ui
import { Button, Dialog, DialogActions, DialogTitle, Box, IconButton, Typography, DialogContent } from '@mui/material';

export default function AlertItemExist({ title, open, handleClose }) {
    return (
        <Dialog
            open={true}
            onClose={() => handleClose(false)}
            keepMounted
            maxWidth="xs"
            fullWidth
            aria-labelledby="item-delete-title"
            aria-describedby="item-delete-description"
        >
            {open && (
                <>
                    <DialogTitle>
                        {' '}
                        <Typography variant="h4">Action</Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="h6"> {title}</Typography>
                        {/* <Typography variant="subtitle2">You can't undo this operation</Typography> */}
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" className="btnSave" onClick={() => handleClose(true)}>
                            Yes
                        </Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
}

AlertItemExist.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    title: PropTypes.string
};
