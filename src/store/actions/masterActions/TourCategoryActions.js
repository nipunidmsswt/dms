import {
    SAVE_TOUR_CATEGORY_DATA,
    GET_ALL_TOUR_CATEGORY_DATA,
    GET_TOUR_CATEGORY_DATA_BY_ID,
    UPDATE_TOUR_CATEGORY_DATA,
    CHECK_TOUR_CATEGORY_CODE_DUPLICATE,
    GET_LAST_MODIFIED_DATE_TIME,
    GET_ACTIVE_TOUR_CATEGORY_DATA
} from '../../constant/master/TourCategoryMasterConstant';

export const saveTourCategoryData = (data) => {
    return {
        type: SAVE_TOUR_CATEGORY_DATA,
        data
    };
};

export const getAllTourCategoryData = () => {
    return {
        type: GET_ALL_TOUR_CATEGORY_DATA
    };
};

export const getTourCategoryLatestModifiedDetails = () => {
    return {
        type: GET_LAST_MODIFIED_DATE_TIME
    };
};

export const getTourCategoryDataById = (id) => {
    return {
        type: GET_TOUR_CATEGORY_DATA_BY_ID,
        data: { id }
    };
};

export const updateTourCategoryData = (data) => {
    return {
        type: UPDATE_TOUR_CATEGORY_DATA,
        data
    };
};

export const checkDuplicateTourCategoryCode = (tourCategoryCode) => {
    return {
        type: CHECK_TOUR_CATEGORY_CODE_DUPLICATE,
        data: { tourCategoryCode }
    };
};

export const getActiveTourCategoryData = () => {
    return {
        type: GET_ACTIVE_TOUR_CATEGORY_DATA
    };
};
