import {
    SAVE_LOCATION_DATA,
    GET_ALL_LOCATION_DATA,
    GET_LOCATION_DATA_BY_ID,
    UPDATE_LOCATION_DATA,
    CHECK_LOCATION_DUPLICATE,
    GET_LAST_MODIFIED_DATE_TIME_LOCATION,
    GET_ACTIVE_LOCATIONS
} from '../../constant/master/LocationConstant';

export const saveLocationData = (data) => {
    console.log('saveLocationData  Data action s called', data);
    return {
        type: SAVE_LOCATION_DATA,
        data
    };
};

export const getAllLocationDetails = () => {
    console.log('get getAllLocationDetails Data action s called');
    return {
        type: GET_ALL_LOCATION_DATA
    };
};

export const getLocationDataById = (id) => {
    console.log('getLocationDataById  called', id);
    return {
        type: GET_LOCATION_DATA_BY_ID,
        data: { id }
    };
};

export const updateLocationData = (data) => {
    console.log('updateLocationData  called', data);
    return {
        type: UPDATE_LOCATION_DATA,
        data: data
    };
};

export const checkDuplicateLocationCode = (data) => {
    console.log('checkDuplicateLocationCode  called', data);
    return {
        type: CHECK_LOCATION_DUPLICATE,
        data: data
    };
};

export const getLatestModifiedLocationDetails = () => {
    return {
        type: GET_LAST_MODIFIED_DATE_TIME_LOCATION
    };
};

export const getActiveLocations = () => {
    return {
        type: GET_ACTIVE_LOCATIONS
    };
};
