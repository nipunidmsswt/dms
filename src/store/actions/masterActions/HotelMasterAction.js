import {
    CHECK_HOTEL_MAIN_DUPLICATE,
    GET_ALL_ACTIVE_HOTEL_MAIN_DATA,
    GET_ALL_HOTEL_MAIN_DATA,
    GET_HOTEL_MAIN_DATA_BY_ID,
    GET_LAST_MODIFIED_DATE_TIME_HOTEL_MAIN,
    SAVE_HOTEL_MAIN_DATA,
    UPDATE_HOTEL_MAIN_DATA,
    GET_HOTELS_BY_LOCATION_CURRENCY_MIN_MAX
} from 'store/constant/master/HotelMasterConstant';

export const saveHotelMainData = (data) => {
    return {
        type: SAVE_HOTEL_MAIN_DATA,
        data
    };
};

export const getAllHotelMainData = () => {
    return {
        type: GET_ALL_HOTEL_MAIN_DATA
    };
};

export const getHotelMainDataById = (id) => {
    return {
        type: GET_HOTEL_MAIN_DATA_BY_ID,
        data: { id }
    };
};

export const updateHotelMainData = (data) => {
    return {
        type: UPDATE_HOTEL_MAIN_DATA,
        data
    };
};

export const getHotelLatestModifiedDetails = () => {
    return {
        type: GET_LAST_MODIFIED_DATE_TIME_HOTEL_MAIN
    };
};

export const checkDuplicateHotelMainCode = (code) => {
    console.log('HotelMain code:' + code);
    return {
        type: CHECK_HOTEL_MAIN_DUPLICATE,
        data: { code }
    };
};

export const getAllActiveHotelMainData = () => {
    return {
        type: GET_HOTELS_BY_LOCATION_CURRENCY_MIN_MAX
    };
};

export const getHotelsByLocationCurrencyMinMax = (data) => {
    return {
        type: GET_HOTELS_BY_LOCATION_CURRENCY_MIN_MAX,
        data: data
    };
};
