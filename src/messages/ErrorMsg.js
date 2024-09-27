import React from 'react';
import Alert from '@mui/material/Alert';
import './message.scss';
import Snackbar from '@mui/material/Snackbar';

function Error({ openToast, handleToast, mode, messages }) {
    return (
        <div>
            <Snackbar
                open={openToast}
                autoHideDuration={4000}
                onClose={handleToast}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
            >
                <Alert onClose={handleToast} severity="error" sx={{ width: '100%' }}>
                    {mode === 'INSERT' ? 'INSERT UNSUCCESSFULL' : ''}
                    {mode === 'VIEW_UPDATE' ? 'UPDATE UNSUCCESSFULLL' : ''}
                    {mode === 'LOGIN' || mode === 'RESET' || mode === 'FORGOT' ? messages : ''}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Error;
