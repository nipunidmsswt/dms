import {
    ADD_SUCCESS_LOCATION_DATA,
    ADD_FAILED_LOCATION_DATA,
    SUCCESS_GET_LOCATION_DATA_BY_ID,
    FAILED_GET_LOCATION_DATA_BY_ID,
    UPDATE_SUCCESS_LOCATION_DATA,
    UPDATE_FAILED_LOCATION_DATA,
    SUCCESS_LOCATION_LIST_DATA,
    FAILED_LOCATION_LIST_DATA,
    LOCATION_DUPLICATE,
    SUCCESS_LAST_MODIFIED_DATE_LOCATION,
    FAILED_LAST_MODIFIED_DATE_LOCATION,
    SUCCESS_GET_ACTIVE_LOCATIONS,
    FAILED_GET_ACTIVE_LOCATIONS
} from '../../constant/master/LocationConstant';

const initialState = {
    location: null,
    locations: [],
    locationToUpdate: null,
    errorMsg: null,
    duplicateLoction: null,
    lastModifiedDateTime: null,
    activeLocations: []
};

export const locationReducer = (state = initialState, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case ADD_SUCCESS_LOCATION_DATA:
            console.warn('ADD_SUCCESS_LOCATION_DATA', action.payload);
            // console.log(data.payload[0]);
            return { ...state, location: data };

        case ADD_FAILED_LOCATION_DATA:
            console.warn('ADD_FAILED_LOCATION_DATA', action);
            console.log(data);
            return {
                ...state,
                location: null,
                errorMsg: data ? data : 'netwok error'
            };

        case SUCCESS_GET_LOCATION_DATA_BY_ID:
            console.warn('SUCCESS_GET_LOCATION_DATA_BY_ID', action.payload);
            console.log(data.payload[0]);
            return { ...state, locationToUpdate: data.payload[0] };

        case FAILED_GET_LOCATION_DATA_BY_ID:
            console.warn('FAILED_GET_LOCATION_DATA_BY_ID', action);
            console.log(data);
            return {
                ...state,
                locationToUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case UPDATE_SUCCESS_LOCATION_DATA:
            console.log(data.payload[0]);
            console.warn('UPDATE_SUCCESS_LOCATION_DATA', action);
            console.log(data.payload[0]);
            return { ...state, location: data.payload[0] };

        case UPDATE_FAILED_LOCATION_DATA:
            console.warn('UPDATE_FAILED_LOCATION_DATA', action);
            console.log(data);
            return {
                ...state,
                location: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_LOCATION_LIST_DATA:
            console.warn('SUCCESS_LOCATION_LIST_DATA', action);

            console.log(data);
            return { ...state, locations: data };

        case FAILED_LOCATION_LIST_DATA:
            console.warn('FAILED_LOCATION_LIST_DATA', action);

            console.log(data);
            return { ...state, locations: data };

        case LOCATION_DUPLICATE:
            return { ...state, duplicateLoction: data };

        case SUCCESS_LAST_MODIFIED_DATE_LOCATION:
            console.log('reducer:' + data.payload[0]);
            return { ...state, lastModifiedDateTime: data.payload[0].dateTime };

        case FAILED_LAST_MODIFIED_DATE_LOCATION:
            return { ...state, lastModifiedDateTime: data };

        case SUCCESS_GET_ACTIVE_LOCATIONS:
            console.log('SUCCESS_GET_ACTIVE_LOCATIONS', data);
            return { ...state, activeLocations: data.payload[0] };

        case FAILED_GET_ACTIVE_LOCATIONS:
            console.warn('FAILED_LOCATION_LIST_DATA', action);
            return { ...state, activeLocations: data.payload[0] };
        default:
            return state;
    }
};
