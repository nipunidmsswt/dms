import {
    CHECK_HOTEL_BASIS_CODE_DUPLICATE,
    GET_ALL_HOTEL_BASIS,
    GET_HOTEL_BASIS_BY_ID,
    GET_HOTEL_BASIS_LAST_MODIFIED_DATE_TIME,
    SAVE_HOTEL_BASIS,
    UPDATE_HOTEL_BASIS,
    GET_ACTIVE_HOTEL_BASIS
} from '../../../constant/master/HotelBasisConstant';

export const saveHotelBasisData = (data) => {
    return {
        type: SAVE_HOTEL_BASIS,
        data
    };
};

export const getAllHotelBasisData = () => {
    return {
        type: GET_ALL_HOTEL_BASIS
    };
};

export const getHotelBasisDataById = (id) => {
    return {
        type: GET_HOTEL_BASIS_BY_ID,
        data: { id }
    };
};

export const updateHotelBasisData = (data) => {
    return {
        type: UPDATE_HOTEL_BASIS,
        data
    };
};

export const getHotelBasisLatestModifiedDetails = () => {
    return {
        type: GET_HOTEL_BASIS_LAST_MODIFIED_DATE_TIME
    };
};

export const checkDuplicateHotelBasisCodee = (hotelBasisCode) => {
    return {
        type: CHECK_HOTEL_BASIS_CODE_DUPLICATE,
        data: { hotelBasisCode }
    };
};

export const getActiveHotelBasisList = () => {
    return {
        type: GET_ACTIVE_HOTEL_BASIS
    };
};
