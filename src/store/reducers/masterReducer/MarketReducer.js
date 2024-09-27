import {
    ADD_FAILED_MARKET_DATA,
    ADD_SUCCESS_MARKET_DATA,
    FAILED_GET_ALL_ACTIVE_MARKET_DATA,
    FAILED_GET_ALL_MARKET_DATA,
    FAILED_GET_MARKET_DETAILS_BY_CODE,
    FAILED_GET_MARKET_LAST_MODIFIED_DATE_TIME,
    MARKET_CODE_DUPLICATE,
    SUCCESS_GET_ALL_ACTIVE_MARKET_DATA,
    SUCCESS_GET_ALL_MARKET_DATA,
    SUCCESS_GET_MARKET_DETAILS_BY_CODE,
    SUCCESS_GET_MARKET_LAST_MODIFIED_DATE_TIME,
    UPDATE_FAILED_MARKET_DATA,
    UPDATE_SUCCESS_MARKET_DATA
} from '../../constant/master/MarketConstant';

const initialState = {
    market: null,
    marketList: [],
    marketToUpdate: null,
    errorMsg: null,
    duplicateCodeType: null,
    duplicateCode: null,
    lastModifiedDateTime: null,
    cluterTypesDetails: [],
    marketActiveList: []
};

export const marketReducer = (state = initialState, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case ADD_SUCCESS_MARKET_DATA:
            console.warn('ADD_SUCCESS_CODE_AND_NAME_DATA', action.payload);
            console.log(data.payload[0]);
            return { ...state, market: data.payload[0] };

        case ADD_FAILED_MARKET_DATA:
            console.warn('ADD_FAILED_CODE_AND_NAME_DATA', action);
            console.log(data);
            return {
                ...state,
                market: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_MARKET_DETAILS_BY_CODE:
            return { ...state, marketToUpdate: data.payload[0] };

        case FAILED_GET_MARKET_DETAILS_BY_CODE:
            return {
                ...state,
                marketToUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case UPDATE_SUCCESS_MARKET_DATA:
            return { ...state, market: data.payload[0] };

        case UPDATE_FAILED_MARKET_DATA:
            return {
                ...state,
                market: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_ALL_MARKET_DATA:
            return { ...state, marketList: data };

        case FAILED_GET_ALL_MARKET_DATA:
            return { ...state, marketList: data };

        case MARKET_CODE_DUPLICATE:
            return { ...state, duplicateCode: data };

        case SUCCESS_GET_MARKET_LAST_MODIFIED_DATE_TIME:
            return { ...state, lastModifiedDateTime: data.payload[0].dateTime };

        case FAILED_GET_MARKET_LAST_MODIFIED_DATE_TIME:
            return { ...state, lastModifiedDateTime: data };

        case SUCCESS_GET_ALL_ACTIVE_MARKET_DATA:
            console.log(data.payload[0]);
            return { ...state, marketActiveList: data.payload[0] };

        case FAILED_GET_ALL_ACTIVE_MARKET_DATA:
            return { ...state, marketActiveList: data.payload[0] };

        default:
            return state;
    }
};
