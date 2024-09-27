import {
    SAVE_GUIDE_CLASS_DATA,
    CHECK_GUIDE_CLASS_CODE_DUPLICATE,
    GET_ALL_ACTIVE_GUIDE_CLASS_DATA,
    GET_ALL_GUIDE_CLASS_DATA,
    GET_GUIDE_CLASS_DETAILS_BY_CODE,
    GET_GUIDE_CLASS_LAST_MODIFIED_DATE_TIME,
    UPDATE_GUIDE_CLASS_DATA
} from 'store/constant/master/GuideClassConstant';

export const saveGuideClassData = (data) => {
    console.log('saveManagerData action s called', data);
    return {
        type: SAVE_GUIDE_CLASS_DATA,
        data
    };
};
export const getAllGuideClassData = () => {
    return {
        type: GET_ALL_GUIDE_CLASS_DATA
    };
};

export const getLatestModifiedDetails = () => {
    return {
        type: GET_GUIDE_CLASS_LAST_MODIFIED_DATE_TIME
    };
};

export const getGuideClassDetailsByCode = (id) => {
    return {
        type: GET_GUIDE_CLASS_DETAILS_BY_CODE,
        data: { id }
    };
};

export const updateGuideClassData = (data) => {
    return {
        type: UPDATE_GUIDE_CLASS_DATA,
        data
    };
};

export const checkDuplicateGuideClasssCode = (data) => {
    return {
        type: CHECK_GUIDE_CLASS_CODE_DUPLICATE,
        data: data
    };
};

export const getAllActiveGuideClassData = () => {
    return {
        type: GET_ALL_ACTIVE_GUIDE_CLASS_DATA
    };
};
