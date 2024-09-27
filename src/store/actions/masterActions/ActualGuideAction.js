import {
    SAVE_ACTUAL_GUIDE_DATA,
    CHECK_ACTUAL_GUIDE_CODE_DUPLICATE,
    GET_ALL_ACTIVE_ACTUAL_GUIDE_DATA,
    GET_ALL_ACTUAL_GUIDE_DATA,
    GET_ACTUAL_GUIDE_DETAILS_BY_ID,
    GET_ACTUAL_GUIDE_LAST_MODIFIED_DATE_TIME,
    UPDATE_ACTUAL_GUIDE_DATA
} from 'store/constant/master/ActualGuideConstant';

export const saveActualGuideData = (data) => {
    console.log('saveManagerData action s called', data);
    return {
        type: SAVE_ACTUAL_GUIDE_DATA,
        data
    };
};
export const getAllActualGuideData = () => {
    return {
        type: GET_ALL_ACTUAL_GUIDE_DATA
    };
};

export const getLatestModifiedDetails = () => {
    return {
        type: GET_ACTUAL_GUIDE_LAST_MODIFIED_DATE_TIME
    };
};

export const getActualGuideDetailsById = (id) => {
    return {
        type: GET_ACTUAL_GUIDE_DETAILS_BY_ID,
        data: { id }
    };
};

export const updateActualGuideData = (data) => {
    return {
        type: UPDATE_ACTUAL_GUIDE_DATA,
        data
    };
};

export const checkDuplicateActualGuideCode = (data) => {
    return {
        type: CHECK_ACTUAL_GUIDE_CODE_DUPLICATE,
        data: data
    };
};

export const getAllActiveActualGuide = () => {
    return {
        type: GET_ALL_ACTIVE_ACTUAL_GUIDE_DATA
    };
};
