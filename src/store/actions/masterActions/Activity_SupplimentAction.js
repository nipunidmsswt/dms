import {
    SAVE_ACTIVITY_SUPPLIMENT_DATA,
    CHECK_ACTIVITY_SUPPLIMENT_CODE_DUPLICATE,
    GET_ALL_ACTIVE_ACTIVITY_SUPPLIMENT_DATA,
    GET_ALL_ACTIVITY_SUPPLIMENT_DATA,
    GET_ACTIVITY_SUPPLIMENT_DETAILS_BY_CODE,
    GET_ACTIVITY_SUPPLIMENT_LAST_MODIFIED_DATE_TIME,
    UPDATE_ACTIVITY_SUPPLIMENT_DATA,
    GET_ALL_ACTIVE_ACT_SUP_MIS_DATA_BY_LOCATION_AND_TYPE
} from 'store/constant/master/Activity_SupplimentConstant';

export const saveActivity_SupplimentData = (data) => {
    console.log('saveManagerData action s called', data);
    return {
        type: SAVE_ACTIVITY_SUPPLIMENT_DATA,
        data
    };
};
export const getAllActivity_SupplimentData = () => {
    return {
        type: GET_ALL_ACTIVITY_SUPPLIMENT_DATA
    };
};

export const getActivity_SupplementLatestModifiedDetails = () => {
    return {
        type: GET_ACTIVITY_SUPPLIMENT_LAST_MODIFIED_DATE_TIME
    };
};

export const getActivity_SupplimentDetailsByCode = (id) => {
    return {
        type: GET_ACTIVITY_SUPPLIMENT_DETAILS_BY_CODE,
        data: { id }
    };
};

export const updateActivity_SupplimentData = (data) => {
    return {
        type: UPDATE_ACTIVITY_SUPPLIMENT_DATA,
        data
    };
};

export const checkDuplicateActivity_SupplimentsCode = (code, type) => {
    console.log('type:' + type);
    return {
        type: CHECK_ACTIVITY_SUPPLIMENT_CODE_DUPLICATE,
        data: { code, type }
    };
};

export const getAllActiveActivity_SupplimentData = () => {
    return {
        type: GET_ALL_ACTIVE_ACTIVITY_SUPPLIMENT_DATA
    };
};

export const getActivitySupMisByLcationandType = (data) => {
    console.log('saveManagerData action s called', data);
    return {
        type: GET_ALL_ACTIVE_ACT_SUP_MIS_DATA_BY_LOCATION_AND_TYPE,
        data
    };
};
