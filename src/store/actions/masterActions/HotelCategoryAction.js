import {
    CHECK_HOTEL_CATEGORY_DUPLICATE,
    GET_ALL_ACTIVE_HOTEL_CATEGORY_DATA,
    GET_ALL_HOTEL_CATEGORY_DATA,
    GET_HOTEL_CATEGORY_DATA_BY_ID,
    GET_LAST_MODIFIED_DATE_TIME_HOTEL_CATEGORY,
    SAVE_HOTEL_CATEGORY_DATA,
    UPDATE_HOTEL_CATEGORY_DATA
} from '../../constant/master/HotelCategoryConstant';

export const saveHotelCategoryData = (data) => {
    return {
        type: SAVE_HOTEL_CATEGORY_DATA,
        data
    };
};

export const getAllHotelCategoryData = () => {
    return {
        type: GET_ALL_HOTEL_CATEGORY_DATA
    };
};

export const getHotelCategoryDataById = (id) => {
    return {
        type: GET_HOTEL_CATEGORY_DATA_BY_ID,
        data: { id }
    };
};

export const updateHotelCategoryData = (data) => {
    return {
        type: UPDATE_HOTEL_CATEGORY_DATA,
        data
    };
};

export const getLatestModifiedDetails = () => {
    return {
        type: GET_LAST_MODIFIED_DATE_TIME_HOTEL_CATEGORY
    };
};

export const checkDuplicateHotelCategoryCode = (code) => {
    console.log('HotelCategory code:' + code);
    return {
        type: CHECK_HOTEL_CATEGORY_DUPLICATE,
        data: { code }
    };
};

export const getAllActiveHotelCategoryData = () => {
    return {
        type: GET_ALL_ACTIVE_HOTEL_CATEGORY_DATA
    };
};
