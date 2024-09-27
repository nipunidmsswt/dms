import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
// import useAuth from 'hooks/useAuth';

// ==============================|| AUTH GUARD ||============================== //

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */
const AuthGuard = ({ children }) => {
    // const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    useEffect(() => {
        if (token == null || token == 'null') {
            navigate('/', { replace: true });
        }
    }, [token, navigate]);

    return children;
};

AuthGuard.propTypes = {
    children: PropTypes.node
};

export default AuthGuard;
