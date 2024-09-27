import {
    SAVE_ROOM_BUYING_RATE,
    GET_ALL_ROOM_BUYING_RATE,
    GET_ROOM_BUYING_RATE_BY_ID,
    UPDATE_ROOM_BUYING_RATE,
    CHECK_ROOM_BUYING_RATE_CODE_DUPLICATE,
    GET_ROOM_BUYING_RATE_LAST_MODIFIED_DATE_TIME,
    GET_ROOM_BUYING_RATE_LIST_BY_HOTEL,
    CLEAR_ROOM_BUYING_RATE
} from '../../constant/master/RoomBuyingRateConstant';

export const saveRoomBuyingRateData = (data) => {
    return {
        type: SAVE_ROOM_BUYING_RATE,
        data
    };
};

export const getAllRoomBuyingRateData = () => {
    return {
        type: GET_ALL_ROOM_BUYING_RATE
    };
};

export const getLatestModifiedDetails = () => {
    return {
        type: GET_ROOM_BUYING_RATE_LAST_MODIFIED_DATE_TIME
    };
};

export const getRoomBuyingRateDataById = (id) => {
    return {
        type: GET_ROOM_BUYING_RATE_BY_ID,
        data: { id }
    };
};

export const updateRoomBuyingRateData = (data) => {
    return {
        type: UPDATE_ROOM_BUYING_RATE,
        data
    };
};

export const checkDuplicateRoomBuyingRateCode = (data) => {
    return {
        type: CHECK_ROOM_BUYING_RATE_CODE_DUPLICATE,
        data: { data }
    };
};

export const getRoomBuyingRatesByHotel = (id) => {
    return {
        type: GET_ROOM_BUYING_RATE_LIST_BY_HOTEL,
        data: { id }
    };
};

export const clearRoomBuyingRate = () => {
    return {
        type: CLEAR_ROOM_BUYING_RATE
    };
};
