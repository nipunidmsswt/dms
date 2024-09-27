import {
    ADD_SUCCESS_MANAGING_COMAPANY_DATA,
    ADD_FAILED_MANAGING_COMAPANY_DATA,
    SUCCESS_MANAGING_COMAPANY_LIST_DATA,
    SUCCESS_GET_MANAGING_COMAPANY_DATA_BY_ID,
    FAILED_MANAGING_COMAPANY_LIST_DATA,
    FAILED_GET_MANAGING_COMAPANY_DATA_BY_ID,
    UPDATE_SUCCESS_MANAGING_COMAPANY_DATA,
    UPDATE_FAILED_MANAGING_COMAPANY_DATA,
    MANAGING_COMAPANY_DUPLICATE,
    SUCCESS_LAST_MODIFIED_DATE_MANAGING_COMAPANY,
    FAILED_LAST_MODIFIED_DATE_MANAGING_COMAPANY,
    SUCCESS_MANAGING_COMAPANY_ACTIVE_LIST_DATA,
    FAILED_MANAGING_COMAPANY_ACTIVE_LIST_DATA
} from '../../constant/master/ManagingCompanyConstant';

const initialState = {
    managingCompany: null,
    managingCompanies: [],
    managingCompanyToUpdate: null,
    errorMsg: null,
    duplicateManagingCompany: null,
    lastModifiedDateTime: null,
    activeManagingCompanies: []
};

export const ManagingCompanyReducer = (state = initialState, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case ADD_SUCCESS_MANAGING_COMAPANY_DATA:
            return { ...state, managingCompany: data.payload[0] };

        case ADD_FAILED_MANAGING_COMAPANY_DATA:
            return {
                ...state,
                managingCompany: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_MANAGING_COMAPANY_DATA_BY_ID:
            return { ...state, managingCompanyToUpdate: data.payload[0] };

        case FAILED_GET_MANAGING_COMAPANY_DATA_BY_ID:
            return {
                ...state,
                managingCompanyToUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case UPDATE_SUCCESS_MANAGING_COMAPANY_DATA:
            return { ...state, managingCompany: data.payload[0] };

        case UPDATE_FAILED_MANAGING_COMAPANY_DATA:
            return {
                ...state,
                managingCompany: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_MANAGING_COMAPANY_LIST_DATA:
            return { ...state, managingCompanies: data };

        case FAILED_MANAGING_COMAPANY_LIST_DATA:
            return { ...state, managingCompanies: data };

        case SUCCESS_MANAGING_COMAPANY_ACTIVE_LIST_DATA:
            return { ...state, activeManagingCompanies: data };

        case FAILED_MANAGING_COMAPANY_ACTIVE_LIST_DATA:
            return { ...state, activeManagingCompanies: data };

        case MANAGING_COMAPANY_DUPLICATE:
            return { ...state, duplicateManagingCompany: data };

        case SUCCESS_LAST_MODIFIED_DATE_MANAGING_COMAPANY:
            return { ...state, lastModifiedDateTime: data.payload[0].dateTime };

        case FAILED_LAST_MODIFIED_DATE_MANAGING_COMAPANY:
            return { ...state, lastModifiedDateTime: data };

        default:
            return state;
    }
};
