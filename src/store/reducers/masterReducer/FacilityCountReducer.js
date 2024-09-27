import {
    ADD_FAILED_FACILITYCOUNTER_DATA,
    ADD_SUCCESS_FACILITYCOUNTER_DATA,
    FAILED_FACILITYCOUNTER_LAST_MODIFIED_DATE,
    FAILED_FACILITYCOUNTER_LIST_DATA,
    FAILED_GET_ALL_FACILITY_COUNTER_DATA_HOTEL_WISE,
    SUCCESS_FACILITYCOUNTER_LAST_MODIFIED_DATE,
    SUCCESS_FACILITYCOUNTER_LIST_DATA,
    SUCCESS_GET_ALL_FACILITY_COUNTER_DATA_HOTEL_WISE,
    UPDATE_FAILED_FACILITYCOUNTER_DATA,
    UPDATE_SUCCESS_FACILITYCOUNTER_DATA
} from 'store/constant/master/FacilityCounterConstant';
import {
    ADD_SUCCESS_HOTEL_CATEGORY_DATA,
    ADD_FAILED_HOTEL_CATEGORY_DATA,
    SUCCESS_HOTEL_CATEGORY_LIST_DATA,
    SUCCESS_GET_HOTEL_CATEGORY_DATA_BY_ID,
    FAILED_HOTEL_CATEGORY_LIST_DATA,
    FAILED_GET_HOTEL_CATEGORY_DATA_BY_ID,
    UPDATE_SUCCESS_HOTEL_CATEGORY_DATA,
    UPDATE_FAILED_HOTEL_CATEGORY_DATA,
    HOTEL_CATEGORY_DUPLICATE,
    SUCCESS_LAST_MODIFIED_DATE_HOTEL_CATEGORY,
    FAILED_LAST_MODIFIED_DATE_HOTEL_CATEGORY,
    SUCCESS_ACTIVE_HOTEL_CATEGORY_LIST_DATA,
    FAILED_ACTIVE_HOTEL_CATEGORY_LIST_DATA
} from '../../constant/master/HotelCategoryConstant';

const initialState = {
    facilityCount: null,
    facilityCountList: [],
    facilityCountListHotelWise: [],
    hotelCategoryToUpdate: null,
    errorMsg: null,
    duplicatehotelCategory: null,
    lastModifiedDateTime: null,
    activeHotelCategories: []
};

export const facilityCountReducer = (state = initialState, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case ADD_SUCCESS_FACILITYCOUNTER_DATA:
            console.warn('SUCCESS_HOTEL_CATEGORY_DATA', action.payload);
            console.log(data.payload[0]);
            return { ...state, facilityCount: data.payload[0] };

        case ADD_FAILED_FACILITYCOUNTER_DATA:
            console.warn('ADD_FAILED_HOTEL_CATEGORY_DATA', action);
            console.log(data);
            return {
                ...state,
                facilityCount: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_HOTEL_CATEGORY_DATA_BY_ID:
            console.warn('SUCCESS_GET_HOTEL_CATEGORY_DATA_BY_ID', action.payload);
            console.log(data.payload[0]);
            return { ...state, hotelCategoryToUpdate: data.payload[0] };

        case FAILED_GET_HOTEL_CATEGORY_DATA_BY_ID:
            console.warn('FAILED_GET_HOTEL_CATEGORY_DATA_BY_ID', action);
            console.log(data);
            return {
                ...state,
                hotelCategoryToUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case UPDATE_SUCCESS_FACILITYCOUNTER_DATA:
            return { ...state, facilityCount: data.payload[0] };

        case UPDATE_FAILED_FACILITYCOUNTER_DATA:
            return {
                ...state,
                facilityCount: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_FACILITYCOUNTER_LIST_DATA:
            console.warn('SUCCESS_HOTEL_CATEGORY_LIST_DATA', action);

            console.log(data);
            return { ...state, facilityCountList: data };

        case FAILED_FACILITYCOUNTER_LIST_DATA:
            console.warn('FAILED_HOTEL_CATEGORY_LIST_DATA', action);

            console.log(data);
            return { ...state, facilityCountList: data };

        case SUCCESS_GET_ALL_FACILITY_COUNTER_DATA_HOTEL_WISE:
            console.warn('SUCCESS_HOTEL_CATEGORY_LIST_DATA', action);

            console.log(data);
            return { ...state, facilityCountListHotelWise: data };

        case FAILED_GET_ALL_FACILITY_COUNTER_DATA_HOTEL_WISE:
            console.warn('FAILED_HOTEL_CATEGORY_LIST_DATA', action);

            console.log(data);
            return { ...state, facilityCountListHotelWise: data };

        case HOTEL_CATEGORY_DUPLICATE:
            return { ...state, duplicatehotelCategory: data };

        case SUCCESS_FACILITYCOUNTER_LAST_MODIFIED_DATE:
            return { ...state, lastModifiedDateTime: data.payload[0].dateTime };
        case FAILED_FACILITYCOUNTER_LAST_MODIFIED_DATE:
            return { ...state, lastModifiedDateTime: data };

        case SUCCESS_ACTIVE_HOTEL_CATEGORY_LIST_DATA:
            // console.log(data.payload[0]);
            return { ...state, activeHotelCategories: data.payload[0] };
        case FAILED_ACTIVE_HOTEL_CATEGORY_LIST_DATA:
            return { ...state, activeHotelCategories: data.payload[0] };
        default:
            return state;
    }
};
