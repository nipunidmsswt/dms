import {
    ADD_SUCCESS_ROOM_BUYING_RATE,
    ADD_FAILED_ROOM_BUYING_RATE,
    UPDATE_SUCCESS_ROOM_BUYING_RATE,
    UPDATE_FAILED_ROOM_BUYING_RATE,
    SUCCESS_ROOM_BUYING_RATE_LIST_DATA,
    FAILED_ROOM_BUYING_RATE_LIST_DATA,
    SUCCESS_GET_ROOM_BUYING_RATE_BY_ID,
    FAILED_GET_ROOM_BUYING_RATE_BY_ID,
    ROOM_BUYING_RATE_CODE_DUPLICATE,
    SUCCESS_ROOM_BUYING_RATE_LAST_MODIFIED_DATE,
    FAILED_ROOM_BUYING_RATE_LAST_MODIFIED_DATE,
    SUCCESS_GET_ROOM_BUYING_RATE_LIST_BY_HOTEL,
    FAILED_GET_ROOM_BUYING_RATE_LIST_BY_HOTEL,
    SUCCESS_CLEAR_ROOM_BUYING_RATE
} from 'store/constant/master/RoomBuyingRateConstant';

const initialState = {
    roomBuyingRate: null,
    roomBuyingRates: [],
    roomBuyingRateToUpdate: null,
    errorMsg: null,
    duplicateRoomBuyingRate: null,
    lastModifiedDateTime: null,
    roomBuyingRateByHotel: []
};

export const roomBuyingRateReducer = (state = initialState, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case ADD_SUCCESS_ROOM_BUYING_RATE:
            console.log('roomBuyingRateReducer roomBuyingRateReducer roomBuyingRateReducer');
            console.log(roomBuyingRateReducer);
            return { ...state, roomBuyingRate: data.payload[0] };

        case ADD_FAILED_ROOM_BUYING_RATE:
            return {
                ...state,
                roomBuyingRate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_ROOM_BUYING_RATE_BY_ID:
            return { ...state, roomBuyingRateToUpdate: data.payload[0] };

        case FAILED_GET_ROOM_BUYING_RATE_BY_ID:
            return {
                ...state,
                roomBuyingRateToUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case UPDATE_SUCCESS_ROOM_BUYING_RATE:
            return { ...state, roomBuyingRate: data.payload[0] };

        case UPDATE_FAILED_ROOM_BUYING_RATE:
            return {
                ...state,
                roomBuyingRate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_ROOM_BUYING_RATE_LIST_DATA:
            return { ...state, roomBuyingRates: data };

        case FAILED_ROOM_BUYING_RATE_LIST_DATA:
            return { ...state, roomBuyingRates: data };

        case ROOM_BUYING_RATE_CODE_DUPLICATE:
            return { ...state, duplicateRoomBuyingRate: data };

        case SUCCESS_ROOM_BUYING_RATE_LAST_MODIFIED_DATE:
            return { ...state, lastModifiedDateTime: data.payload[0].dateTime };

        case FAILED_ROOM_BUYING_RATE_LAST_MODIFIED_DATE:
            return { ...state, lastModifiedDateTime: data };

        case SUCCESS_GET_ROOM_BUYING_RATE_LIST_BY_HOTEL:
            return { ...state, roomBuyingRateByHotel: data.payload[0] };

        case FAILED_GET_ROOM_BUYING_RATE_LIST_BY_HOTEL:
            return {
                ...state,
                roomBuyingRateByHotel: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };
        case SUCCESS_CLEAR_ROOM_BUYING_RATE:
            return { ...state, roomBuyingRate: null };

        default:
            return state;
    }
};
