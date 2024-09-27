import {
    ADD_SUCCESS_USER_DATA,
    ADD_FAILED_USER_DATA,
    SUCCESS_GET_USER_DATA_BY_ID,
    FAILED_GET_USER_DATA_BY_ID,
    UPDATE_SUCCESS_USER_DATA,
    UPDATE_FAILED_USER_DATA,
    SUCCESS_USER_LIST_DATA,
    FAILED_USER_LIST_DATA,
    USER_DUPLICATE,
    SUCCESS_LAST_MODIFIED_DATE_USER,
    FAILED_LAST_MODIFIED_DATE_USER,
    SUCCESS_GET_ACTIVE_USERS,
    FAILED_GET_ACTIVE_USERS,
    SUCCESS_USER_LOGIN_DATA,
    FAILED_USER_LOGIN_DATA,
    SUCCESS_FORGOT_PASSWORD_CREDENTIALS,
    FAILED_FORGOT_PASSWORD_CREDENTIALS,
    SUCCESS_RESET_PASSWORD_CREDENTIALS,
    FAILED_RESET_PASSWORD_CREDENTIALS,
    SUCCESS_GET_ALL_USER_ROLES,
    FAILED_GET_ALL_USER_ROLES,
    SUCCESS_GET_PROFILE_DATA_BY_ID,
    FAILED_GET_PROFILE_DATA_BY_ID,
    SUCCESS_UPDATE_MY_PROFILE,
    FAILED_UPDATE_MY_PROFILE,
    SUCCESS_CLEAR_USER
} from 'store/constant/authentication/UserConstant';

const initialState = {
    user: null,
    users: [],
    userToUpdate: null,
    errorMsg: null,
    duplicateLoction: null,
    lastModifiedDateTime: null,
    activeUsers: [],
    loggedUserData: null,
    forgotPasswordData: null,
    resetPasswordData: null,
    userRole: [],
    profileToUpdate: null,
    myProfileUpdate: null
};

export const userReducer = (state = initialState, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case ADD_SUCCESS_USER_DATA:
            console.warn('ADD_SUCCESS_USER_DATA', action.payload);
            console.log(data.payload[0]);
            return { ...state, user: data };

        case ADD_FAILED_USER_DATA:
            console.warn('ADD_FAILED_User_DATA', action);
            console.log(data);
            return {
                ...state,
                user: null,
                errorMsg: data ? data : 'netwok error'
            };

        case SUCCESS_GET_USER_DATA_BY_ID:
            console.warn('SUCCESS_GET_USER_DATA_BY_ID', action.payload);
            console.log(data.payload[0]);
            return { ...state, userToUpdate: data.payload[0] };

        case FAILED_GET_USER_DATA_BY_ID:
            console.warn('FAILED_GET_USER_DATA_BY_ID', action);
            console.log(data);
            return {
                ...state,
                userToUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case UPDATE_SUCCESS_USER_DATA:
            console.log(data.payload[0]);
            console.warn('UPDATE_SUCCESS_User_DATA', action);
            console.log(data.payload[0]);
            return { ...state, User: data.payload[0] };

        case UPDATE_FAILED_USER_DATA:
            console.warn('UPDATE_FAILED_User_DATA', action);
            console.log(data);
            return {
                ...state,
                User: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_USER_LIST_DATA:
            console.warn('SUCCESS_USER_LIST_DATA', action);

            console.log(data);
            return { ...state, users: data.payload[0] };

        case FAILED_USER_LIST_DATA:
            console.warn('FAILED_USER_LIST_DATA', action);

            console.log(data);
            return { ...state, users: data };

        case USER_DUPLICATE:
            return { ...state, duplicateLoction: data };

        case SUCCESS_LAST_MODIFIED_DATE_USER:
            console.log('reducer:' + data.payload[0]);
            return { ...state, lastModifiedDateTime: data.payload[0].dateTime };

        case FAILED_LAST_MODIFIED_DATE_USER:
            return { ...state, lastModifiedDateTime: data };

        case SUCCESS_GET_ACTIVE_USERS:
            console.log('SUCCESS_GET_ACTIVE_UserS', data);
            return { ...state, activeUsers: data.payload[0] };

        case FAILED_GET_ACTIVE_USERS:
            console.warn('FAILED_USER_LIST_DATA', action);
            return { ...state, activeUsers: data.payload[0] };

        case SUCCESS_USER_LOGIN_DATA:
            console.log('SUCCESS_USER_LOGIN_DATA', data);
            return { ...state, loggedUserData: data.payload[0] };

        case FAILED_USER_LOGIN_DATA:
            console.warn('FAILED_USER_LOGIN_DATA', data);
            return { ...state, loggedUserData: null, errorMsg: data ? data : 'netwok error' };

        case SUCCESS_FORGOT_PASSWORD_CREDENTIALS:
            console.log('SUCCESS_FORGOT_PASSWORD_CREDENTIALS', data);
            return { ...state, forgotPasswordData: data.payload[0] };

        case FAILED_FORGOT_PASSWORD_CREDENTIALS:
            console.warn('FAILED_FORGOT_PASSWORD_CREDENTIALS', data);
            return { ...state, forgotPasswordData: null, errorMsg: data ? data : 'netwok error' };

        case SUCCESS_RESET_PASSWORD_CREDENTIALS:
            console.log('SUCCESS_RESET_PASSWORD_CREDENTIALS', data);
            return { ...state, resetPasswordData: data.payload[0] };

        case FAILED_RESET_PASSWORD_CREDENTIALS:
            console.warn('FAILED_RESET_PASSWORD_CREDENTIALS', data);
            return { ...state, resetPasswordData: null, errorMsg: data ? data : 'netwok error' };
        case SUCCESS_GET_ALL_USER_ROLES:
            console.log('SUCCESS_GET_ALL_USER_ROLES', data);
            return { ...state, userRole: data.payload[0] };

        case FAILED_GET_ALL_USER_ROLES:
            console.warn('FAILED_ALL_USER_ROLES', action);
            return { ...state, userRole: data.payload[0] };

        case SUCCESS_GET_PROFILE_DATA_BY_ID:
            console.warn('SUCCESS_GET_PROFILE_DATA_BY_ID', action.payload);
            console.log(data.payload[0]);
            return { ...state, profileToUpdate: data.payload[0] };

        case FAILED_GET_PROFILE_DATA_BY_ID:
            console.warn('FAILED_GET_PROFILE_DATA_BY_ID', action);
            console.log(data);
            return {
                ...state,
                profileToUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };
        case SUCCESS_UPDATE_MY_PROFILE:
            console.warn('SUCCESS_UPDATE_MY_PROFILE', action.payload);
            console.log(data.payload[0]);
            return { ...state, myProfileUpdate: data.payload[0] };

        case FAILED_UPDATE_MY_PROFILE:
            console.warn('FAILED_UPDATE_MY_PROFILE', action);
            console.log(data);
            return {
                ...state,
                myProfileUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };
        case SUCCESS_CLEAR_USER:
            return { ...state, loggedUserData: null };
        default:
            return state;
    }
};
