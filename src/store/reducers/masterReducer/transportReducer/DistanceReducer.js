import {
    FAILED_GET_TRANSPORT_MAIN_CATEGORY_DATA_BY_TYPE,
    SUCCESS_GET_TRANSPORT_MAIN_CATEGORY_DATA_BY_TYPE
} from 'store/constant/master/TransportMasterConstant/MainTransportCategoryConstant';
import {
    ADD_SUCCESS_DISTANCE_DATA,
    ADD_FAILED_DISTANCE_DATA,
    SUCCESS_GET_DISTANCE_DATA_BY_ID,
    FAILED_GET_DISTANCE_DATA_BY_ID,
    SUCCESS_DISTANCE_LIST_DATA,
    FAILED_DISTANCE_LIST_DATA,
    UPDATE_FAILED_DISTANCE_DATA,
    UPDATE_SUCCESS_DISTANCE_DATA,
    DISTANCE_CODE_DUPLICATE,
    FAILED_LAST_MODIFIED_DATE_DISTANCE,
    SUCCESS_LAST_MODIFIED_DATE_DISTANCE,
    SUCCESS_GET_ALL_ACTIVE_DISTANCE_DATA_TBY_TRANSPORT_TYPE,
    FAILED_GET_ALL_ACTIVE_DISTANCE_DATA_TBY_TRANSPORT_TYPE,
    SUCCESS_GET_CALCULATED_DISTANCE_AND_DURATION,
    FAILED_GET_CALCULATED_DISTANCE_AND_DURATION
} from '../../../constant/master/TransportMasterConstant/DistanceConstant';

const initialState = {
    distance: null,
    distances: [],
    distanceByTransportType: [],
    distanceToUpdate: null,
    detailsType: [],
    errorMsg: null,
    duplicatedistance: null,
    lastModifiedDateTime: null
};

export const distanceReducer = (state = initialState, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case ADD_SUCCESS_DISTANCE_DATA:
            return { ...state, distance: data.payload[0] };

        case ADD_FAILED_DISTANCE_DATA:
            return {
                ...state,
                distance: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_DISTANCE_DATA_BY_ID:
            return { ...state, distanceToUpdate: data.payload[0] };

        case FAILED_GET_DISTANCE_DATA_BY_ID:
            return {
                ...state,
                distanceToUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case UPDATE_SUCCESS_DISTANCE_DATA:
            return { ...state, distance: data.payload[0] };

        case UPDATE_FAILED_DISTANCE_DATA:
            return {
                ...state,
                distance: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_DISTANCE_LIST_DATA:
            return { ...state, distances: data };

        case FAILED_DISTANCE_LIST_DATA:
            return { ...state, distances: data };

        case DISTANCE_CODE_DUPLICATE:
            return { ...state, duplicatedistance: data };

        case SUCCESS_LAST_MODIFIED_DATE_DISTANCE:
            return { ...state, lastModifiedDateTime: data.payload[0].dateTime };

        case FAILED_LAST_MODIFIED_DATE_DISTANCE:
            return { ...state, lastModifiedDateTime: data };

        case SUCCESS_GET_ALL_ACTIVE_DISTANCE_DATA_TBY_TRANSPORT_TYPE:
            console.warn('SUCCESS_GET_CODE_NAME_DATA_BY_CODE', data.payload[0]);
            return { ...state, distanceByTransportType: data.payload[0] };

        case FAILED_GET_ALL_ACTIVE_DISTANCE_DATA_TBY_TRANSPORT_TYPE:
            return {
                ...state,
                distanceByTransportType: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_CALCULATED_DISTANCE_AND_DURATION:
            console.log('Distance Reducer Success');
            return { ...state, calculatedDistance: 10, calculatedDuration: 10 };

        case FAILED_GET_CALCULATED_DISTANCE_AND_DURATION:
            console.log('Distance Reducer Failed');
            return { ...state, calculatedDistance: 0, calculatedDuration: 0, errorMsg: 'netwok error' };

        default:
            return state;
    }
};
