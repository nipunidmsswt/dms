import {
    ADD_FAILED_CODE_AND_NAME_DATA,
    ADD_SUCCESS_CODE_AND_NAME_DATA,
    CODE_DUPLICATE,
    CODE_TYPE_DUPLICATE,
    FAILED_ALL_CLUSTER_TYPE_DATA,
    FAILED_ALL_CODE_AND_NAME_DATA,
    FAILED_CODE_LAST_MODIFIED_DATE,
    FAILED_GET_ALL_OPERATOR_DATA,
    FAILED_GET_CODE_NAME_DATA_BY_CODE,
    FAILED_GET_CODE_NAME_DATA_BY_TYPE,
    FAILED_GET_DATA_TO_TABLE_VIEW,
    FAILED_GET_EXISITING_MARKETCODE_FOR_CLUSTER,
    FAILED_GET_EXISITING_OPERATOR_CODE_FOR_MARKET,
    FAILED_SAVE_CLUSTER_MARKET_MAPPING_DATA,
    FAILED_SAVE_MARKET_OPERATOR_MAPPING_DATA,
    SUCCESS_ALL_CLUSTER_TYPE_DATA,
    SUCCESS_ALL_CODE_AND_NAME_DATA,
    SUCCESS_CODE_LAST_MODIFIED_DATE,
    SUCCESS_GET_ALL_OPERATOR_DATA,
    SUCCESS_GET_CODE_NAME_DATA_BY_CODE,
    SUCCESS_GET_CODE_NAME_DATA_BY_TYPE,
    SUCCESS_GET_DATA_TO_TABLE_VIEW,
    SUCCESS_GET_EXISITING_MARKETCODE_FOR_CLUSTER,
    SUCCESS_GET_EXISITING_OPERATOR_CODE_FOR_MARKET,
    SUCCESS_SAVE_CLUSTER_MARKET_MAPPING_DATA,
    SUCCESS_SAVE_MARKET_OPERATOR_MAPPING_DATA,
    UPDATE_FAILED_CODE_AND_NAME_DATA,
    UPDATE_SUCCESS_CODE_AND_NAME_DATA
} from '../../constant/master/CodeAndNameConstant';

const initialState = {
    codeAndName: null,
    codeAndNameList: [],
    codeToUpdate: null,
    errorMsg: null,
    duplicateCodeType: null,
    duplicateCode: null,
    lastModifiedDateTime: null,
    cluterTypesDetails: [],
    operatorTypesDetails: [],
    detailsType: [],
    clusterMarketMappingData: null,
    marketMappingWithCluster: [],
    operatorMappingWithMarket: [],
    dataToTableView: []
};

export const codeAndNameReducer = (state = initialState, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case ADD_SUCCESS_CODE_AND_NAME_DATA:
            console.warn('ADD_SUCCESS_CODE_AND_NAME_DATA', action.payload);
            console.log(data.payload[0]);
            return { ...state, codeAndName: data.payload[0] };

        case ADD_FAILED_CODE_AND_NAME_DATA:
            console.warn('ADD_FAILED_CODE_AND_NAME_DATA', action);
            console.log(data);
            return {
                ...state,
                codeAndName: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_CODE_NAME_DATA_BY_CODE:
            console.warn('SUCCESS_GET_CODE_NAME_DATA_BY_CODE', data.payload[0]);
            return { ...state, codeToUpdate: data.payload[0] };

        case FAILED_GET_CODE_NAME_DATA_BY_CODE:
            return {
                ...state,
                codeToUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_CODE_NAME_DATA_BY_TYPE:
            console.warn('SUCCESS_GET_CODE_NAME_DATA_BY_CODE', data.payload[0]);
            return { ...state, detailsType: data.payload[0] };

        case FAILED_GET_CODE_NAME_DATA_BY_TYPE:
            return {
                ...state,
                detailsType: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case UPDATE_SUCCESS_CODE_AND_NAME_DATA:
            return { ...state, codeAndName: data.payload[0] };

        case UPDATE_FAILED_CODE_AND_NAME_DATA:
            return {
                ...state,
                codeAndName: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_ALL_CODE_AND_NAME_DATA:
            return { ...state, codeAndNameList: data };

        case FAILED_ALL_CODE_AND_NAME_DATA:
            return { ...state, codeAndNameList: data };

        case CODE_TYPE_DUPLICATE:
            return { ...state, duplicateCodeType: data };

        case CODE_DUPLICATE:
            return { ...state, duplicateCode: data };

        case SUCCESS_CODE_LAST_MODIFIED_DATE:
            return { ...state, lastModifiedDateTime: data.payload[0].dateTime };

        case FAILED_CODE_LAST_MODIFIED_DATE:
            return { ...state, lastModifiedDateTime: data };

        case SUCCESS_ALL_CLUSTER_TYPE_DATA:
            console.log(data.payload[0]);
            return { ...state, cluterTypesDetails: data.payload[0] };

        case FAILED_ALL_CLUSTER_TYPE_DATA:
            return { ...state, cluterTypesDetails: data.payload[0] };

        case SUCCESS_GET_ALL_OPERATOR_DATA:
            console.log(data.payload[0]);
            return { ...state, operatorTypesDetails: data.payload[0] };

        case FAILED_GET_ALL_OPERATOR_DATA:
            return { ...state, operatorTypesDetails: data.payload[0] };

        case SUCCESS_SAVE_CLUSTER_MARKET_MAPPING_DATA:
            console.warn('SUCESS_SAVE_CLUSTER_MARKET_MAPPING_DATA :', action.payload);
            console.log(data.payload[0]);
            return { ...state, clusterMarketMappingData: data.payload[0] };

        case FAILED_SAVE_CLUSTER_MARKET_MAPPING_DATA:
            return {
                ...state,
                clusterMarketMappingData: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };
        case SUCCESS_GET_EXISITING_MARKETCODE_FOR_CLUSTER:
            return { ...state, marketMappingWithCluster: data.payload[0] };

        case FAILED_GET_EXISITING_MARKETCODE_FOR_CLUSTER:
            return { ...state, marketMappingWithCluster: data.payload[0] };

        case SUCCESS_SAVE_MARKET_OPERATOR_MAPPING_DATA:
            console.warn('SUCCESS_SAVE_MARKET_OPERATOR_MAPPING_DATA :', action.payload);
            console.log(data.payload[0]);
            return { ...state, marketOperatorMappingData: data.payload[0] };

        case FAILED_SAVE_MARKET_OPERATOR_MAPPING_DATA:
            return {
                ...state,
                marketOperatorMappingData: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };
        case SUCCESS_GET_EXISITING_OPERATOR_CODE_FOR_MARKET:
            return { ...state, operatorMappingWithMarket: data.payload[0] };

        case FAILED_GET_EXISITING_OPERATOR_CODE_FOR_MARKET:
            return { ...state, operatorMappingWithMarket: data.payload[0] };

        case SUCCESS_GET_DATA_TO_TABLE_VIEW:
            return { ...state, dataToTableView: data.payload[0] };

        case FAILED_GET_DATA_TO_TABLE_VIEW:
            return { ...state, dataToTableView: data.payload[0] };
        default:
            return state;
    }
};
