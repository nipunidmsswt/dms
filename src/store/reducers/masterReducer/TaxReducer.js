import {
    ADD_FAILED_TAX_DATA,
    ADD_SUCCESS_TAX_DATA,
    FAILED_GET_TAX_DATA_BY_ID,
    FAILED_GET_TAX_DATA_BY_UNIQUE_ID,
    FAILED_LAST_MODIFIED_DATE_TAX,
    FAILED_TAX_LIST_DATA,
    SUCCESS_GET_TAX_DATA_BY_ID,
    SUCCESS_GET_TAX_DATA_BY_UNIQUE_ID,
    SUCCESS_LAST_MODIFIED_DATE_TAX,
    SUCCESS_TAX_LIST_DATA,
    TAX_DUPLICATE,
    UPDATE_FAILED_TAX_DATA,
    UPDATE_SUCCESS_TAX_DATA
} from 'store/constant/master/TaxMasterConstant';

const initialState = {
    tax: null,
    taxes: [],
    taxToUpdate: null,
    taxToEdit: null,
    errorMsg: null,
    duplicateTax: null,
    lastModifiedDateTime: null
};

export const taxReducer = (state = initialState, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case ADD_SUCCESS_TAX_DATA:
            console.warn('SUCCESS_TAX_DATA', action.payload);
            console.log(data.payload[0]);
            return { ...state, tax: data.payload[0] };

        case ADD_FAILED_TAX_DATA:
            console.warn('FAILED_TAX_DATA', action);
            console.log(data);
            return {
                ...state,
                tax: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_TAX_DATA_BY_ID:
            console.warn('SUCCESS_GET_TAX_DATA_BY_ID', action.payload);
            console.log(data.payload[0]);
            return { ...state, taxToUpdate: data.payload[0] };

        case FAILED_GET_TAX_DATA_BY_ID:
            console.warn('FAILED_GET_TAX_DATA_BY_ID', action);
            console.log(data);
            return {
                ...state,
                taxToUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_TAX_DATA_BY_UNIQUE_ID:
            console.warn('SUCCESS_GET_TAX_DATA_BY_ID', action.payload);
            console.log(data.payload[0]);
            return { ...state, taxToEdit: data.payload[0] };

        case FAILED_GET_TAX_DATA_BY_UNIQUE_ID:
            console.warn('FAILED_GET_TAX_DATA_BY_UNIQUE_ID', action);
            console.log(data);
            return {
                ...state,
                taxToEdit: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };
        case UPDATE_SUCCESS_TAX_DATA:
            console.log(data.payload[0]);
            console.warn('UPDATE_SUCCESS_TAX_DATA', action);
            console.log(data.payload[0]);
            return { ...state, tax: data.payload[0] };

        case UPDATE_FAILED_TAX_DATA:
            console.warn('UPDATE_FAILED_TAX_DATA', action);
            console.log(data);
            return {
                ...state,
                tax: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_TAX_LIST_DATA:
            console.warn('SUCCESS_TAX_LIST_DATA', action);

            console.log(data.payload[0]);
            return { ...state, taxes: data.payload[0] };

        case FAILED_TAX_LIST_DATA:
            console.warn('FAILED_TAX_LIST_DATA', action);

            console.log(data);
            return { ...state, taxes: data };

        case TAX_DUPLICATE:
            return { ...state, duplicateTax: data };

        case SUCCESS_LAST_MODIFIED_DATE_TAX:
            console.log('reducer:' + data.payload[0]);
            return { ...state, lastModifiedDateTime: data.payload[0].dateTime };

        case FAILED_LAST_MODIFIED_DATE_TAX:
            return { ...state, lastModifiedDateTime: data };

        default:
            return state;
    }
};
