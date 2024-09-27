import {
    ADD_SUCCESS_BRANCH_DATA,
    ADD_FAILED_BRANCH_DATA,
    SUCCESS_GET_BRANCH_DATA_BY_ID,
    FAILED_GET_BRANCH_DATA_BY_ID,
    SUCCESS_BRANCH_LIST_DATA,
    FAILED_BRANCH_LIST_DATA,
    UPDATE_FAILED_BRANCH_DATA,
    UPDATE_SUCCESS_BRANCH_DATA,
    BRANCH_DUPLICATE,
    FAILED_LAST_MODIFIED_DATE_BRANCH,
    SUCCESS_LAST_MODIFIED_DATE_BRANCH,
    SUCCESS_GET_BRANCHES_BY_BANK_ID,
    FAILED_GET_BRANCHES_BY_BANK_ID
} from '../../constant/master/BankConstant';

const initialState = {
    branch: null,
    branches: [],
    branchToUpdate: null,
    errorMsg: null,
    duplicateBranch: null,
    lastModifiedDateTime: null,
    branchesByBank: []
};

export const branchReducer = (state = initialState, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case ADD_SUCCESS_BRANCH_DATA:
            return { ...state, branch: data.payload[0] };

        case ADD_FAILED_BRANCH_DATA:
            return {
                ...state,
                branch: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_BRANCH_DATA_BY_ID:
            return { ...state, branchToUpdate: data.payload[0].body.payload[0] };

        case FAILED_GET_BRANCH_DATA_BY_ID:
            return {
                ...state,
                branchToUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case UPDATE_SUCCESS_BRANCH_DATA:
            console.log('UPDATE_SUCCESS_BRANCH_DATA UPDATE_SUCCESS_BRANCH_DATAUPDATE_SUCCESS_BRANCH_DATA');
            return { ...state, branch: data.payload[0] };

        case UPDATE_FAILED_BRANCH_DATA:
            return {
                ...state,
                branch: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_BRANCH_LIST_DATA:
            return { ...state, branches: data };

        case FAILED_BRANCH_LIST_DATA:
            return { ...state, branches: data };

        case BRANCH_DUPLICATE:
            return { ...state, duplicateBranch: data };

        case SUCCESS_LAST_MODIFIED_DATE_BRANCH:
            return { ...state, lastModifiedDateTime: data.payload[0].dateTime };

        case FAILED_LAST_MODIFIED_DATE_BRANCH:
            return { ...state, lastModifiedDateTime: data };

        case SUCCESS_GET_BRANCHES_BY_BANK_ID:
            return { ...state, branchesByBank: data.payload[0] };

        case FAILED_GET_BRANCHES_BY_BANK_ID:
            return { ...state, branchesByBank: [] };

        default:
            return state;
    }
};
