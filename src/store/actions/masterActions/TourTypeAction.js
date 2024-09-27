import {
    CHECK_TOURTYPE_CODE_DUPLICATE,
    GET_ALL_TOURTYPE_DATA,
    GET_TOURTYPE_DATA_BY_ID,
    GET_TOURTYPE_LAST_MODIFIED_DATE_TIME,
    SAVE_TOURTYPE_DATA,
    UPDATE_TOURTYPE_DATA,
    GET_ACTIVE_TOURTYPE_DATA
} from '../../constant/master/TourTypeConstant';

export const saveTourTypeData = (data) => {
    return {
        type: SAVE_TOURTYPE_DATA,
        data
    };
};

export const getAllTourTypeData = () => {
    return {
        type: GET_ALL_TOURTYPE_DATA
    };
};

export const getTourTypeDataById = (id) => {
    return {
        type: GET_TOURTYPE_DATA_BY_ID,
        data: { id }
    };
};

export const updateTourTypeData = (data) => {
    return {
        type: UPDATE_TOURTYPE_DATA,
        data
    };
};

export const getLatestModifiedDetails = () => {
    return {
        type: GET_TOURTYPE_LAST_MODIFIED_DATE_TIME
    };
};

export const checkDuplicateTourTypeCode = (code) => {
    console.log('code:' + code);
    return {
        type: CHECK_TOURTYPE_CODE_DUPLICATE,
        data: { code }
    };
};

export const getActiveTourTypes = () => {
    return {
        type: GET_ACTIVE_TOURTYPE_DATA
    };
};
