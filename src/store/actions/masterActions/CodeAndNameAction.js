import {
    CHECK_CODE_DUPLICATE,
    CHECK_CODE_TYPE_DUPLICATE,
    GET_ALL_CLUSTER_DATA,
    GET_ALL_CODE_AND_NAME_DATA,
    GET_ALL_OPERATOR_DATA,
    GET_CODE_LAST_MODIFIED_DATE_TIME,
    GET_CODE_NAME_DATA_BY_CODE,
    GET_CODE_NAME_DATA_BY_TYPE,
    GET_DATA_TO_TABLE_VIEW,
    GET_EXISITING_MARKETCODE_FOR_CLUSTER,
    GET_EXISITING_OPERATOR_CODE_FOR_MARKET,
    SAVE_CLUSTER_MARKET_MAPPING_DATA,
    SAVE_CODE_AND_NAME_DATA,
    SAVE_MARKET_OPERATOR_MAPPING_DATA,
    UPDATE_CODE_AND_NAME_DATA
} from '../../constant/master/CodeAndNameConstant';

export const saveCodeAndNameData = (data) => {
    return {
        type: SAVE_CODE_AND_NAME_DATA,
        data
    };
};

export const saveClusterAndMarketMappingData = (data) => {
    return {
        type: SAVE_CLUSTER_MARKET_MAPPING_DATA,
        data
    };
};

export const saveOperatorAndMarketMappingData = (data) => {
    return {
        type: SAVE_MARKET_OPERATOR_MAPPING_DATA,
        data
    };
};
export const getAllCodeAndNameDetails = () => {
    return {
        type: GET_ALL_CODE_AND_NAME_DATA
    };
};

export const getCodeAndNameDataByCode = (id) => {
    console.log('action:' + id);
    return {
        type: GET_CODE_NAME_DATA_BY_CODE,
        data: { id }
    };
};

export const getCodeAndNameDataByType = (type) => {
    console.log(type);
    return {
        type: GET_CODE_NAME_DATA_BY_TYPE,
        data: { type }
    };
};

export const updateCodeAndNameData = (data) => {
    return {
        type: UPDATE_CODE_AND_NAME_DATA,
        data
    };
};

export const checkDuplicateCodeTypeForCodeAndName = (data) => {
    return {
        type: CHECK_CODE_TYPE_DUPLICATE,
        data: data
    };
};

export const checkDuplicateCodeForCodeAndName = (data) => {
    return {
        type: CHECK_CODE_DUPLICATE,
        data: data
    };
};

export const getLatestModifiedDetails = () => {
    return {
        type: GET_CODE_LAST_MODIFIED_DATE_TIME
    };
};

export const getAllClusterData = () => {
    return {
        type: GET_ALL_CLUSTER_DATA
    };
};

export const getAllActiveOperatorData = () => {
    return {
        type: GET_ALL_OPERATOR_DATA
    };
};

export const getExisitngMarketCodesForCluster = (clusterId) => {
    console.log(clusterId);
    return {
        type: GET_EXISITING_MARKETCODE_FOR_CLUSTER,
        data: { clusterId }
    };
};

export const getExisitngOperatorCodesForMarket = (marketId) => {
    console.log(marketId);
    return {
        type: GET_EXISITING_OPERATOR_CODE_FOR_MARKET,
        data: { marketId }
    };
};

export const getAllMarketAndOperatorForCluster = (clusterId) => {
    return {
        type: GET_DATA_TO_TABLE_VIEW,
        data: { clusterId }
    };
};
