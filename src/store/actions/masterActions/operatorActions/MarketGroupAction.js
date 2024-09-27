import {
    CHECK_MARKET_GROUP_CODE_DUPLICATE,
    GET_ALL_ACTIVE_MARKET_GROUP_DATA,
    GET_ALL_MARKET_GROUP_DATA,
    GET_ALL_MARKET_GROUP_GROUP_DATA,
    GET_MARKET_GROUP_DETAILS_BY_CODE,
    GET_MARKET_GROUP_LAST_MODIFIED_DATE_TIME,
    SAVE_MARKET_GROUP_DATA,
    UPDATE_MARKET_GROUP_DATA,
    GET_ALL_ACTIVE_OPERATOR_LIST_BY_OPERATOR_GROUP,
    GET_ALL_ACTIVE_OPERATOR_GROUP_DATA
} from '../../../constant/master/MarketGroupConstant';

export const saveMarketGroupData = (data) => {
    return {
        type: SAVE_MARKET_GROUP_DATA,
        data
    };
};
export const getAllMarketGroupData = () => {
    console.log('get');
    return {
        type: GET_ALL_MARKET_GROUP_DATA
    };
};

export const getLatestModifiedDetails = () => {
    return {
        type: GET_MARKET_GROUP_LAST_MODIFIED_DATE_TIME
    };
};

export const getMarketGroupDetailsByCode = (id) => {
    return {
        type: GET_MARKET_GROUP_DETAILS_BY_CODE,
        data: { id }
    };
};

export const updateMarketGroupData = (data) => {
    return {
        type: UPDATE_MARKET_GROUP_DATA,
        data
    };
};

export const checkDuplicateMarketGroupsCode = (data) => {
    return {
        type: CHECK_MARKET_GROUP_CODE_DUPLICATE,
        data: data
    };
};

export const getAllActiveMarketGroupData = () => {
    return {
        type: GET_ALL_ACTIVE_MARKET_GROUP_DATA
    };
};

export const getAllActiveOperatorGroupData = () => {
    return {
        type: GET_ALL_ACTIVE_OPERATOR_GROUP_DATA
    };
};

export const getAllActiveOperatorByOperatorGpId = (id) => {
    return {
        type: GET_ALL_ACTIVE_OPERATOR_LIST_BY_OPERATOR_GROUP,
        id
    };
};
