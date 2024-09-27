import {
    ADD_SUCCESS_HOTEL_MAIN_DATA,
    ADD_FAILED_HOTEL_MAIN_DATA,
    SUCCESS_HOTEL_MAIN_LIST_DATA,
    SUCCESS_GET_HOTEL_MAIN_DATA_BY_ID,
    FAILED_HOTEL_MAIN_LIST_DATA,
    FAILED_GET_HOTEL_MAIN_DATA_BY_ID,
    UPDATE_SUCCESS_HOTEL_MAIN_DATA,
    UPDATE_FAILED_HOTEL_MAIN_DATA,
    HOTEL_MAIN_DUPLICATE,
    SUCCESS_LAST_MODIFIED_DATE_HOTEL_MAIN,
    FAILED_LAST_MODIFIED_DATE_HOTEL_MAIN,
    SUCCESS_ACTIVE_HOTEL_MAIN_LIST_DATA,
    FAILED_ACTIVE_HOTEL_MAIN_LIST_DATA,
    SUCCESS_GET_HOTELS_BY_LOCATION_CURRENCY_MIN_MAX,
    FAILED_GET_HOTELS_BY_LOCATION_CURRENCY_MIN_MAX
} from 'store/constant/master/HotelMasterConstant';

const initialState = {
    hotelMain: null,
    hotelMainList: [],
    hotelMainToUpdate: null,
    errorMsg: null,
    duplicatehotelMain: null,
    lastModifiedDateTime: null,
    activeHotelCategories: [],
    hotelsByLocationCrrencyMinMax: []
};

export const hotelMainReducer = (state = initialState, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case ADD_SUCCESS_HOTEL_MAIN_DATA:
            console.warn('SUCCESS_HOTEL_MAIN_DATA', action.payload);
            console.log(data.payload[0]);
            return { ...state, hotelMain: data.payload[0] };

        case ADD_FAILED_HOTEL_MAIN_DATA:
            console.warn('ADD_FAILED_HOTEL_MAIN_DATA', action);
            console.log(data);
            return {
                ...state,
                hotelMain: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_HOTEL_MAIN_DATA_BY_ID:
            console.warn('SUCCESS_GET_HOTEL_MAIN_DATA_BY_ID', action.payload);
            console.log(data.payload[0]);
            return { ...state, hotelMainToUpdate: data.payload[0] };

        case FAILED_GET_HOTEL_MAIN_DATA_BY_ID:
            console.warn('FAILED_GET_HOTEL_MAIN_DATA_BY_ID', action);
            console.log(data);
            return {
                ...state,
                hotelMainToUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case UPDATE_SUCCESS_HOTEL_MAIN_DATA:
            console.log(data.payload[0]);
            console.warn('UPDATE_SUCCESS_HOTEL_MAIN_DATA', action);
            console.log(data.payload[0]);
            return { ...state, hotelMain: data.payload[0] };

        case UPDATE_FAILED_HOTEL_MAIN_DATA:
            console.warn('UPDATE_FAILED_HOTEL_MAIN_DATA', action);
            console.log(data);
            return {
                ...state,
                hotelMain: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_HOTEL_MAIN_LIST_DATA:
            console.warn('SUCCESS_HOTEL_MAIN_LIST_DATA', action);

            console.log(data);
            return { ...state, hotelMainList: data };

        case FAILED_HOTEL_MAIN_LIST_DATA:
            console.warn('FAILED_HOTEL_MAIN_LIST_DATA', action);

            console.log(data);
            return { ...state, hotelMainList: data };

        case HOTEL_MAIN_DUPLICATE:
            return { ...state, duplicatehotelMain: data };

        case SUCCESS_LAST_MODIFIED_DATE_HOTEL_MAIN:
            return { ...state, lastModifiedDateTime: data.payload[0].dateTime };
        case FAILED_LAST_MODIFIED_DATE_HOTEL_MAIN:
            return { ...state, lastModifiedDateTime: data };

        case SUCCESS_ACTIVE_HOTEL_MAIN_LIST_DATA:
            // console.log(data.payload[0]);
            return { ...state, activeHotelCategories: data.payload[0] };
        case FAILED_ACTIVE_HOTEL_MAIN_LIST_DATA:
            return { ...state, activeHotelCategories: data.payload[0] };
        case SUCCESS_GET_HOTELS_BY_LOCATION_CURRENCY_MIN_MAX:
            return { ...state, hotelsByLocationCrrencyMinMax: data.payload[0] };

        case FAILED_GET_HOTELS_BY_LOCATION_CURRENCY_MIN_MAX:
            return {
                ...state,
                hotelsByLocationCrrencyMinMax: [],
                errorMsg: data ? data.errorMessages : 'netwok error'
            };
        default:
            return state;
    }
};
