import React from 'react';
import Alert from '@mui/material/Alert';
import './message.scss';
import Snackbar from '@mui/material/Snackbar';

function SuccessMsg({ openToast, handleToast, mode }) {
    return (
        <div>
            <Snackbar
                open={openToast}
                autoHideDuration={6000}
                onClose={handleToast}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
            >
                <Alert
                    style={{
                        backgroundColor: '#5cb85c',
                        color: 'white'
                    }}
                    onClose={handleToast}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    {mode === 'INSERT' ? 'SUCCESSFULLY ADDED' : ''}
                    {mode === 'VIEW_UPDATE' ? 'SUCCESSFULLY UPDATED' : ''}
                    {mode === 'LOGIN' ? 'SUCCESSFULLY LOGGED' : ''}
                    {mode === 'RESET' ? 'SUCCESSFULLY RESET' : ''}
                    {mode === 'FORGOT' ? 'code is sent' : ''}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default SuccessMsg;
