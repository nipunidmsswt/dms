import {
    CHECK_DISTANCE_CODE_DUPLICATE,
    GET_ALL_ACTIVE_DISTANCE_DATA_TBY_TRANSPORT_TYPE,
    // GET_ALL_ACTIVE_DISTANCE_DATA,
    GET_ALL_DISTANCE_DATA,
    GET_DISTANCE_DATA_BY_ID,
    GET_DISTANCE_LAST_MODIFIED_DATE_TIME,
    SAVE_DISTANCE_DATA,
    UPDATE_DISTANCE_DATA,
    GET_CALCULATED_DISTANCE_AND_DURATION
} from 'store/constant/master/TransportMasterConstant/DistanceConstant';

export const saveDistanceData = (data) => {
    return {
        type: SAVE_DISTANCE_DATA,
        data
    };
};

// export const getAllDistanceData = () => {
//     return {
//         type: GET_ALL_DISTANCE_DATA
//     };
// };

export const getDistanceDataById = (id) => {
    return {
        type: GET_DISTANCE_DATA_BY_ID,
        data: { id }
    };
};

export const updateDistanceData = (data) => {
    return {
        type: UPDATE_DISTANCE_DATA,
        data
    };
};

export const getHotelLatestModifiedDetails = () => {
    return {
        type: GET_DISTANCE_LAST_MODIFIED_DATE_TIME
    };
};

export const checkDuplicateDistanceCode = (code) => {
    console.log('Distance code:' + code);
    return {
        type: CHECK_DISTANCE_CODE_DUPLICATE,
        data: { code }
    };
};

export const getAllActiveDistanceDataByTransportType = (id) => {
    return {
        type: GET_ALL_ACTIVE_DISTANCE_DATA_TBY_TRANSPORT_TYPE,
        data: { id }
    };
};

export const getCalculatedDistanceAndDuration = (transportTypeId, locationIds) => {
    console.log('Distance and duration');
    return {
        type: GET_CALCULATED_DISTANCE_AND_DURATION,
        data: { transportTypeId, locationIds: [...locationIds] }
    };
};
