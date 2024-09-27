import {
    ADD_FAILED_MARKET_GROUP_DATA,
    ADD_SUCCESS_MARKET_GROUP_DATA,
    FAILED_GET_ALL_ACTIVE_MARKET_GROUP_DATA,
    FAILED_GET_ALL_MARKET_GROUP_DATA,
    FAILED_GET_MARKET_GROUP_DETAILS_BY_CODE,
    FAILED_GET_MARKET_GROUP_LAST_MODIFIED_DATE_TIME,
    MARKET_GROUP_CODE_DUPLICATE,
    SUCCESS_GET_ALL_ACTIVE_MARKET_GROUP_DATA,
    SUCCESS_GET_ALL_MARKET_GROUP_DATA,
    SUCCESS_GET_MARKET_GROUP_DETAILS_BY_CODE,
    SUCCESS_GET_MARKET_GROUP_LAST_MODIFIED_DATE_TIME,
    UPDATE_FAILED_MARKET_GROUP_DATA,
    UPDATE_SUCCESS_MARKET_GROUP_DATA,
    SUCCESS_GET_ALL_ACTIVE_OPERATOR_GROUP_DATA,
    FAILED_GET_ALL_ACTIVE_OPERATOR_GROUP_DATA,
    SUCCESS_GET_ALL_ACTIVE_OPERATOR_LIST_BY_OPERATOR_GROUP,
    FAILED_GET_ALL_ACTIVE_OPERATOR_LIST_BY_OPERATOR_GROUP
} from '../../constant/master/MarketGroupConstant';

const initialState = {
    marketGroup: null,
    marketList: [],
    marketToUpdate: null,
    errorMsg: null,
    duplicateCodeType: null,
    duplicateCode: null,
    lastModifiedDateTime: null,
    // marketActiveList:[],
    activeOperatorGroupList: [],
    activeOpListPerOpGroup: []
};

export const marketGroupReducer = (state = initialState, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case ADD_SUCCESS_MARKET_GROUP_DATA:
            return { ...state, marketGroup: data.payload[0] };

        case ADD_FAILED_MARKET_GROUP_DATA:
            console.warn('ADD_FAILED_CODE_AND_NAME_DATA', action);
            console.log(data);
            return {
                ...state,
                marketGroup: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_MARKET_GROUP_DETAILS_BY_CODE:
            return { ...state, marketToUpdate: data.payload[0] };

        case FAILED_GET_MARKET_GROUP_DETAILS_BY_CODE:
            return {
                ...state,
                marketToUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case UPDATE_SUCCESS_MARKET_GROUP_DATA:
            return { ...state, marketGroup: data.payload[0] };

        case UPDATE_FAILED_MARKET_GROUP_DATA:
            return {
                ...state,
                marketGroup: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case MARKET_GROUP_CODE_DUPLICATE:
            return { ...state, duplicateCode: data };

        // case SUCCESS_GET_ALL_MARKET_GROUP_DATA:
        //   console.log("Market Group list:" + marketGroupList);
        //   return { ...state, marketGroupList: data };

        case SUCCESS_GET_ALL_MARKET_GROUP_DATA:
            return { ...state, marketList: data };

        case FAILED_GET_ALL_MARKET_GROUP_DATA:
            return { ...state, marketList: data };

        case SUCCESS_GET_MARKET_GROUP_LAST_MODIFIED_DATE_TIME:
            return { ...state, lastModifiedDateTime: data.payload[0].dateTime };

        case FAILED_GET_MARKET_GROUP_LAST_MODIFIED_DATE_TIME:
            return { ...state, lastModifiedDateTime: data };

        case SUCCESS_GET_ALL_ACTIVE_MARKET_GROUP_DATA:
            return { ...state, marketActiveList: data.payload[0] };

        case FAILED_GET_ALL_ACTIVE_MARKET_GROUP_DATA:
            return { ...state, marketActiveList: data.payload[0] };

        case SUCCESS_GET_ALL_ACTIVE_OPERATOR_GROUP_DATA:
            return { ...state, activeOperatorGroupList: data.payload[0] };

        case FAILED_GET_ALL_ACTIVE_OPERATOR_GROUP_DATA:
            return { ...state, activeOperatorGroupList: data.payload[0] };

        case SUCCESS_GET_ALL_ACTIVE_OPERATOR_LIST_BY_OPERATOR_GROUP:
            return { ...state, activeOpListPerOpGroup: data.payload[0] };

        case FAILED_GET_ALL_ACTIVE_OPERATOR_LIST_BY_OPERATOR_GROUP:
            return { ...state, activeOpListPerOpGroup: data.payload[0] };
        default:
            return state;
    }
};
