import {
    ADD_SUCCESS_TAX_GROUP_DATA,
    ADD_FAILED_TAX_GROUP_DATA,
    SUCCESS_TAX_GROUP_LIST_DATA,
    SUCCESS_GET_TAX_GROUP_DATA_BY_ID,
    FAILED_TAX_GROUP_LIST_DATA,
    FAILED_GET_TAX_GROUP_DATA_BY_ID,
    UPDATE_SUCCESS_TAX_GROUP_DATA,
    UPDATE_FAILED_TAX_GROUP_DATA,
    TAX_GROUP_DUPLICATE,
    SUCCESS_LAST_MODIFIED_DATE_TAX_GROUP,
    FAILED_LAST_MODIFIED_DATE_TAX_GROUP,
    SUCCESS_GET_ACTIVE_TAX_GROUP_LIST,
    FAILED_GET_ACTIVE_TAX_GROUP_LIST,
    SUCCESS_GET_TAX_GROUP_AND_TAX_LIST,
    FAILED_GET_TAX_GROUP_AND_TAX_LIST
} from '../../constant/master/TaxMasterConstant';

const initialState = {
    taxgroup: null,
    taxgroups: [],
    taxGroupToUpdate: null,
    errorMsg: null,
    duplicateTaxGroup: null,
    lastModifiedDateTime: null,
    activeTaxGrups: [],
    activeTaxGroupandTaxes: []
};

export const taxGroupReducer = (state = initialState, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case ADD_SUCCESS_TAX_GROUP_DATA:
            console.warn('SUCCESS_TAX_GROUP_DATA', action.payload);
            console.log(data.payload[0]);
            return { ...state, taxgroup: data.payload[0] };

        case ADD_FAILED_TAX_GROUP_DATA:
            console.warn('ADD_FAILED_TAX_GROUP_DATA', action);
            console.log(data);
            return {
                ...state,
                taxgroup: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_TAX_GROUP_DATA_BY_ID:
            console.warn('SUCCESS_GET_TAX_GROUP_DATA_BY_ID', action.payload);
            console.log(data.payload[0]);
            return { ...state, taxGroupToUpdate: data.payload[0] };

        case FAILED_GET_TAX_GROUP_DATA_BY_ID:
            console.warn('FAILED_GET_TAX_GROUP_DATA_BY_ID', action);
            console.log(data);
            return {
                ...state,
                taxGroupToUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case UPDATE_SUCCESS_TAX_GROUP_DATA:
            console.log(data.payload[0]);
            console.warn('UPDATE_SUCCESS_TAX_GROUP_DATA', action);
            console.log(data.payload[0]);
            return { ...state, taxgroup: data.payload[0] };

        case UPDATE_FAILED_TAX_GROUP_DATA:
            console.warn('UPDATE_FAILED_TAX_GROUP_DATA', action);
            console.log(data);
            return {
                ...state,
                taxgroup: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_TAX_GROUP_LIST_DATA:
            console.warn('SUCCESS_TAX_GROUP_LIST_DATA', action);

            console.log(data);
            return { ...state, taxgroups: data };

        case FAILED_TAX_GROUP_LIST_DATA:
            console.warn('FAILED_TAX_GROUP_LIST_DATA', action);

            console.log(data);
            return { ...state, taxgroups: data };

        case TAX_GROUP_DUPLICATE:
            return { ...state, duplicateTaxGroup: data };

        case SUCCESS_LAST_MODIFIED_DATE_TAX_GROUP:
            console.log('reducer:' + data.payload[0]);
            return { ...state, lastModifiedDateTime: data.payload[0].dateTime };

        case FAILED_LAST_MODIFIED_DATE_TAX_GROUP:
            return { ...state, lastModifiedDateTime: data };

        case SUCCESS_GET_ACTIVE_TAX_GROUP_LIST:
            return { ...state, activeTaxGrups: data.payload[0] };

        case FAILED_GET_ACTIVE_TAX_GROUP_LIST:
            return { ...state, activeTaxGrups: data.payload[0] };

        case SUCCESS_GET_TAX_GROUP_AND_TAX_LIST:
            return { ...state, activeTaxGroupandTaxes: data.payload[0] };

        case FAILED_GET_TAX_GROUP_AND_TAX_LIST:
            return { ...state, activeTaxGroupandTaxes: data.payload[0] };

        default:
            return state;
    }
};
