import {
    ADD_FAILED_TOURTYPE_DATA,
    ADD_SUCCESS_TOURTYPE_DATA,
    FAILED_GET_TOURTYPE_DATA_BY_ID,
    FAILED_TOURTYPE_LAST_MODIFIED_DATE,
    FAILED_TOURTYPE_LIST_DATA,
    SUCCESS_GET_TOURTYPE_DATA_BY_ID,
    SUCCESS_TOURTYPE_LAST_MODIFIED_DATE,
    SUCCESS_TOURTYPE_LIST_DATA,
    TOURTYPE_CODE_DUPLICATE,
    UPDATE_FAILED_TOURTYPE_DATA,
    UPDATE_SUCCESS_TOURTYPE_DATA,
    SUCCESS_ACTIVE_TOURTYPE_LIST_DATA,
    FAILED_ACTIVE_TOURTYPE_LIST_DATA
} from '../../constant/master/TourTypeConstant';

const initialState = {
    tourType: null,
    tourTypeList: [],
    tourTypeToUpdate: null,
    errorMsg: null,
    duplicatetourType: null,
    lastModifiedDateTime: null,
    activeTourTypeList: []
};

export const tourTypeDataReducer = (state = initialState, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case ADD_SUCCESS_TOURTYPE_DATA:
            //console.warn("SUCCESS_TOURTYPE_DATA", action.payload);
            console.log(data.payload[0]);
            return { ...state, tourType: data.payload[0] };

        case ADD_FAILED_TOURTYPE_DATA:
            console.warn('FAILED_TOURTYPE_DATA', action);
            console.log(data);
            return {
                ...state,
                tourType: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_TOURTYPE_DATA_BY_ID:
            //console.warn("SUCCESS_GET_TOURTYPE_DATA_BY_ID", action.payload);
            console.log('reucer log :' + data.payload[0]);
            return { ...state, tourTypeToUpdate: data.payload[0] };

        case FAILED_GET_TOURTYPE_DATA_BY_ID:
            console.warn('FAILED_GET_TOURTYPE_DATA_BY_ID', action);
            console.log(data);
            return {
                ...state,
                tourTypeToUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case UPDATE_SUCCESS_TOURTYPE_DATA:
            return { ...state, tourType: data.payload[0] };

        case UPDATE_FAILED_TOURTYPE_DATA:
            return {
                ...state,
                tourType: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_TOURTYPE_LIST_DATA:
            return { ...state, tourTypeList: data };

        case FAILED_TOURTYPE_LIST_DATA:
            return { ...state, tourTypeList: data };

        case TOURTYPE_CODE_DUPLICATE:
            return { ...state, duplicatetourType: data };

        case SUCCESS_TOURTYPE_LAST_MODIFIED_DATE:
            return { ...state, lastModifiedDateTime: data.payload[0].dateTime };
        case FAILED_TOURTYPE_LAST_MODIFIED_DATE:
            return { ...state, lastModifiedDateTime: data };
        case SUCCESS_ACTIVE_TOURTYPE_LIST_DATA:
            return { ...state, activeTourTypeList: data.payload[0] };

        case FAILED_ACTIVE_TOURTYPE_LIST_DATA:
            return { ...state, activeTourTypeList: data.payload[0] };
        // data.payload[0].dateTime.replace("T"," ")
        default:
            return state;
    }
};
