import {
    ADD_SUCCESS_EXCHNAGE_RATE_TYPE_DATA,
    ADD_FAILED_EXCHNAGE_RATE_TYPE_DATA,
    SUCCESS_EXCHNAGE_RATE_TYPE_LIST_DATA,
    FAILED_EXCHNAGE_RATE_TYPE_LIST_DATA,
    FAILED_GET_EXCHNAGE_RATE_TYPE_DATA_BY_ID,
    SUCCESS_GET_EXCHNAGE_RATE_TYPE_DATA_BY_ID,
    UPDATE_SUCCESS_EXCHNAGE_RATE_TYPE_DATA,
    UPDATE_FAILED_EXCHNAGE_RATE_TYPE_DATA,
    SUCCESS_LAST_MODIFIED_DATE_EXCHNAGE_RATE_TYPE,
    FAILED_LAST_MODIFIED_DATE_EXCHNAGE_RATE_TYPE,
    SUCCESS_EXCHNAGE_RATE_TYPE_DATA_BY_CURRENCY_ID,
    FAILED_EXCHNAGE_RATE_TYPE_DATA_BY_CURRENCY_ID,
    SUCCESS_CONVERT_CURRENCY_TO_BASE_CURRENCY,
    FAILED_CONVERT_CURRENCY_TO_BASE_CURRENCY
} from '../../constant/master/ExchangeRateConstant';

const initialState = {
    exchangeRateType: null,
    exchangeRateTypeList: [],
    exchnageRateTypeToUpdate: null,
    errorMsg: null,
    duplicateExchangeRateTypeGroup: null,
    lastModifiedDateTime: null,
    rateListByCurrencyID: [],
    convertCurrencytoBaseCurrency: ''
};

export const exchangeRateTypesReducer = (state = initialState, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case ADD_SUCCESS_EXCHNAGE_RATE_TYPE_DATA:
            console.warn('ADD_SUCCESS_EXCHNAGE_RATE_TYPE_DATA', action.payload);
            console.log(data.payload[0]);
            return { ...state, exchangeRateType: data.payload[0] };

        case ADD_FAILED_EXCHNAGE_RATE_TYPE_DATA:
            console.warn('ADD_FAILED_EXCHNAGE_RATE_TYPE_DATA', action);
            console.log(data);
            return {
                ...state,
                exchangeRateType: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_EXCHNAGE_RATE_TYPE_DATA_BY_ID:
            console.warn('SUCCESS_GET_EXCHNAGE_RATE_TYPE_DATA_BY_ID', action.payload);
            console.log(data.payload[0]);
            return { ...state, exchnageRateTypeToUpdate: data.payload[0] };

        case FAILED_GET_EXCHNAGE_RATE_TYPE_DATA_BY_ID:
            console.warn('FAILED_GET_EXCHNAGE_RATE_TYPE_DATA_BY_ID', action);
            console.log(data);
            return {
                ...state,
                exchnageRateTypeToUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case UPDATE_SUCCESS_EXCHNAGE_RATE_TYPE_DATA:
            console.log(data.payload[0]);
            console.warn('UPDATE_SUCCESS_TAX_GROUP_DATA', action);
            console.log(data.payload[0]);
            return { ...state, exchangeRateType: data.payload[0] };

        case UPDATE_FAILED_EXCHNAGE_RATE_TYPE_DATA:
            console.warn('UPDATE_FAILED_TAX_GROUP_DATA', action);
            console.log(data);
            return {
                ...state,
                exchangeRateType: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_EXCHNAGE_RATE_TYPE_LIST_DATA:
            console.warn('SUCCESS_EXCHNAGE_RATE_TYPE_LIST_DATA', action);

            console.log(data);
            return { ...state, exchangeRateTypeList: data };

        case FAILED_EXCHNAGE_RATE_TYPE_LIST_DATA:
            console.warn('FAILED_EXCHNAGE_RATE_TYPE_LIST_DATA', action);

            console.log(data);
            return { ...state, exchangeRateTypeList: data };

        case SUCCESS_LAST_MODIFIED_DATE_EXCHNAGE_RATE_TYPE:
            return { ...state, lastModifiedDateTime: data.payload[0].dateTime };

        case FAILED_LAST_MODIFIED_DATE_EXCHNAGE_RATE_TYPE:
            return { ...state, lastModifiedDateTime: data };

        case SUCCESS_EXCHNAGE_RATE_TYPE_DATA_BY_CURRENCY_ID:
            return { ...state, rateListByCurrencyID: data.payload[0] };

        case FAILED_EXCHNAGE_RATE_TYPE_DATA_BY_CURRENCY_ID:
            return { ...state, rateListByCurrencyID: data };

        case SUCCESS_CONVERT_CURRENCY_TO_BASE_CURRENCY:
            return { ...state, convertCurrencytoBaseCurrency: data.payload[0] };

        case FAILED_CONVERT_CURRENCY_TO_BASE_CURRENCY:
            return {
                ...state,
                convertCurrencytoBaseCurrency: '',
                errorMsg: data ? data.errorMessages : 'netwok error'
            };
        default:
            return state;
    }
};
