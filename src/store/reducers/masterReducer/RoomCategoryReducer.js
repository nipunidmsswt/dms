import {
    ADD_FAILED_ROOM_CATEGORY,
    ADD_SUCCESS_ROOM_CATEGORY,
    FAILED_GET_ROOM_CATEGORY_BY_ID,
    FAILED_ROOM_CATEGORY_LAST_MODIFIED_DATE,
    FAILED_ROOM_CATEGORY_LIST_DATA,
    ROOM_CATEGORY_CODE_DUPLICATE,
    SUCCESS_GET_ROOM_CATEGORY_BY_ID,
    SUCCESS_ROOM_CATEGORY_LAST_MODIFIED_DATE,
    SUCCESS_ROOM_CATEGORY_LIST_DATA,
    UPDATE_FAILED_ROOM_CATEGORY,
    UPDATE_SUCCESS_ROOM_CATEGORY,
    SUCCESS_ACTIVE_ROOM_CATEGORY_LIST_DATA,
    FAILED_ACTIVE_ROOM_CATEGORY_LIST_DATA
} from '../../constant/master/RoomCategoryConstant';

const initialState = {
    hotelChildrenFacility: null,
    hotelChildrenFacilityList: [],
    hotelChildrenFacilityToUpdate: null,
    errorMsg: null,
    duplicateRoomCategoryCode: null,
    lastModifiedDateTime: null,
    activeHotelChildrenFacilityList: []
};

export const roomCategoryReducer = (state = initialState, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case ADD_SUCCESS_ROOM_CATEGORY:
            return { ...state, hotelChildrenFacility: data.payload[0] };

        case ADD_FAILED_ROOM_CATEGORY:
            return {
                ...state,
                hotelChildrenFacility: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_ROOM_CATEGORY_BY_ID:
            console.warn('SUCCESS_GET_ROOM_CATEGORY_BY_ID', data.payload[0].RoomCategory);
            console.log(data.payload[0].RoomCategory);
            return {
                ...state,
                hotelChildrenFacilityToUpdate: data.payload[0].body.payload[0].RoomCategory
            };

        case FAILED_GET_ROOM_CATEGORY_BY_ID:
            console.warn('FAILED_GET_ROOM_CATEGORY_BY_ID', action);
            console.log(data);
            return {
                ...state,
                hotelChildrenFacilityToUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case UPDATE_SUCCESS_ROOM_CATEGORY:
            console.log(data.payload[0]);
            console.warn('UPDATE_FAILED_ROOM_CATEGORY', action);
            console.log(data.payload[0]);
            return { ...state, hotelChildrenFacility: data.payload[0] };

        case UPDATE_FAILED_ROOM_CATEGORY:
            console.warn('UPDATE_FAILED_ROOM_CATEGORY', action);
            console.log(data);
            return {
                ...state,
                hotelChildrenFacility: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_ROOM_CATEGORY_LIST_DATA:
            console.warn('SUCCESS_ROOM_CATEGORY_LIST_DATA', action);

            console.log(data);
            return { ...state, hotelChildrenFacilityList: data };

        case FAILED_ROOM_CATEGORY_LIST_DATA:
            return { ...state, hotelChildrenFacilityList: data };

        case ROOM_CATEGORY_CODE_DUPLICATE:
            return { ...state, duplicateRoomCategoryCode: data };

        case SUCCESS_ROOM_CATEGORY_LAST_MODIFIED_DATE:
            return { ...state, lastModifiedDateTime: data.payload[0].dateTime };

        case FAILED_ROOM_CATEGORY_LAST_MODIFIED_DATE:
            return { ...state, lastModifiedDateTime: data };

        case SUCCESS_ACTIVE_ROOM_CATEGORY_LIST_DATA:
            return { ...state, activeHotelChildrenFacilityList: data.payload[0] };

        case FAILED_ACTIVE_ROOM_CATEGORY_LIST_DATA:
            return { ...state, activeHotelChildrenFacilityList: data.payload[0] };
        default:
            return state;
    }
};
