import {
    ADD_FAILED_HOTEL_BASIS,
    ADD_SUCCESS_HOTEL_BASIS,
    FAILED_GET_HOTEL_BASIS_BY_ID,
    FAILED_HOTEL_BASIS_LAST_MODIFIED_DATE,
    FAILED_HOTEL_BASIS_LIST_DATA,
    HOTEL_BASIS_CODE_DUPLICATE,
    SUCCESS_GET_HOTEL_BASIS_BY_ID,
    SUCCESS_HOTEL_BASIS_LAST_MODIFIED_DATE,
    SUCCESS_HOTEL_BASIS_LIST_DATA,
    UPDATE_FAILED_HOTEL_BASIS,
    UPDATE_SUCCESS_HOTEL_BASIS,
    SUCCESS_ACTIVE_HOTEL_BASIS_LIST_DATA,
    FAILED_ACTIVE_HOTEL_BASIS_LIST_DATA
} from '../../constant/master/HotelBasisConstant';

const initialState = {
    hotelBasis: null,
    hotelBasisList: [],
    hotelBasisToUpdate: null,
    errorMsg: null,
    duplicatehotelBasis: null,
    lastModifiedDateTime: null,
    activeHotelBasisList: null
};

export const hotelBasisReducer = (state = initialState, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case ADD_SUCCESS_HOTEL_BASIS:
            console.warn('SUCCESS_HOTEL_CATEGORY_DATA', action.payload);
            console.log(data.payload[0]);
            return { ...state, hotelBasis: data.payload[0] };

        case ADD_FAILED_HOTEL_BASIS:
            console.warn('ADD_FAILED_HOTEL_CATEGORY_DATA', action);
            console.log(data);
            return {
                ...state,
                hotelBasis: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_HOTEL_BASIS_BY_ID:
            console.warn('SUCCESS_GET_HOTEL_BASIS_BY_ID', action.payload);
            console.log(data.payload[0]);
            return { ...state, hotelBasisToUpdate: data.payload[0].body.payload[0].hotelBasis };

        case FAILED_GET_HOTEL_BASIS_BY_ID:
            console.warn('FAILED_GET_HOTEL_BASIS_BY_ID', action);
            console.log(data);
            return {
                ...state,
                hotelBasisToUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case UPDATE_SUCCESS_HOTEL_BASIS:
            console.log(data.payload[0]);
            console.warn('UPDATE_SUCCESS_HOTEL_BASIS', action);
            console.log(data.payload[0]);
            return { ...state, hotelBasis: data.payload[0] };

        case UPDATE_FAILED_HOTEL_BASIS:
            console.warn('UPDATE_FAILED_HOTEL_BASIS', action);
            console.log(data);
            return {
                ...state,
                hotelBasis: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_HOTEL_BASIS_LIST_DATA:
            console.warn('SUCCESS_HOTEL_BASIS_LIST_DATA', action);

            console.log(data);
            return { ...state, hotelBasisList: data };

        case FAILED_HOTEL_BASIS_LIST_DATA:
            return { ...state, hotelBasisList: data };

        case HOTEL_BASIS_CODE_DUPLICATE:
            return { ...state, duplicatehotelBasis: data };

        case SUCCESS_HOTEL_BASIS_LAST_MODIFIED_DATE:
            return { ...state, lastModifiedDateTime: data.payload[0].dateTime };

        case FAILED_HOTEL_BASIS_LAST_MODIFIED_DATE:
            return { ...state, lastModifiedDateTime: data };

        case SUCCESS_ACTIVE_HOTEL_BASIS_LIST_DATA:
            console.log('activeHotelBasisList activeHotelBasisList activeHotelBasisList');
            console.log(data.payload[0]);
            return { ...state, activeHotelBasisList: data.payload[0] };

        case FAILED_ACTIVE_HOTEL_BASIS_LIST_DATA:
            return { ...state, activeHotelBasisList: data.payload[0] };
        default:
            return state;
    }
};
