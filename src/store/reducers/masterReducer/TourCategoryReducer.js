import {
    ADD_SUCCESS_TOUR_CATEGORY_DATA,
    ADD_FAILED_TOUR_CATEGORY_DATA,
    SUCCESS_TOUR_CATEGORY_LIST_DATA,
    FAILED_TOUR_CATEGORY_LIST_DATA,
    SUCCESS_GET_TOUR_CATEGORY_DATA_BY_ID,
    FAILED_GET_TOUR_CATEGORY_BY_ID,
    UPDATE_SUCCESS_TOUR_CATEGORY_DATA,
    UPDATE_FAILED_TOUR_CATEGORY_DATA,
    TOUR_CATEGORY_DUPLICATE,
    SUCCESS_LAST_MODIFIED_DATE,
    FAILED_LAST_MODIFIED_DATE,
    SUCCESS_ACTIVE_TOUR_CATEGORY_LIST_DATA,
    FAILED_ACTIVE_TOUR_CATEGORY_LIST_DATA
} from '../../constant/master/TourCategoryMasterConstant';

const initialState = {
    tourCategory: null,
    tourCategories: [],
    tourToUpdate: null,
    errorMsg: null,
    duplicateTourCategory: null,
    lastModifiedDateTime: null,
    activeTourCategories: []
};

export const tourCategoryReducer = (state = initialState, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case ADD_SUCCESS_TOUR_CATEGORY_DATA:
            console.warn('SUCCESS_TOUR_CATEGORY_DATA', action.payload);
            console.log(data.payload[0]);
            return { ...state, tourCategory: data.payload[0] };

        case ADD_FAILED_TOUR_CATEGORY_DATA:
            console.warn('FAILED_TOUR_CATEGORY_DATA', action);
            console.log(data);
            return {
                ...state,
                tourCategory: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_TOUR_CATEGORY_DATA_BY_ID:
            console.warn('SUCCESS_GET_TOUR_CATEGORY_DATA_BY_ID', action.payload);
            console.log(data.payload[0]);
            return { ...state, tourToUpdate: data.payload[0] };

        case FAILED_GET_TOUR_CATEGORY_BY_ID:
            console.warn('FAILED_GET_TOUR_CATEGORY_BY_ID', action);
            console.log(data);
            return {
                ...state,
                tourToUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case UPDATE_SUCCESS_TOUR_CATEGORY_DATA:
            console.log(data.payload[0]);
            console.warn('UPDATE_SUCCESS_TAX_DATA', action);
            console.log(data.payload[0]);
            return { ...state, tourCategory: data.payload[0] };

        case UPDATE_FAILED_TOUR_CATEGORY_DATA:
            console.warn('UPDATE_FAILED_TAX_DATA', action);
            console.log(data);
            return {
                ...state,
                tourCategory: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_TOUR_CATEGORY_LIST_DATA:
            return { ...state, tourCategories: data };

        case FAILED_TOUR_CATEGORY_LIST_DATA:
            return { ...state, tourCategories: data };

        case TOUR_CATEGORY_DUPLICATE:
            return { ...state, duplicateTourCategory: data };

        case SUCCESS_LAST_MODIFIED_DATE:
            console.log('reducer:' + data.payload[0]);
            return { ...state, lastModifiedDateTime: data.payload[0].dateTime };
        case FAILED_LAST_MODIFIED_DATE:
            return { ...state, lastModifiedDateTime: data };

        case SUCCESS_ACTIVE_TOUR_CATEGORY_LIST_DATA:
            return { ...state, activeTourCategories: data.payload[0] };

        case FAILED_ACTIVE_TOUR_CATEGORY_LIST_DATA:
            return { ...state, activeTourCategories: data.payload[0] };
        default:
            return state;
    }
};
