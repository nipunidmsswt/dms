import {
    SAVE_TRANSPORT_RATE_DATA,
    GET_ALL_TRANSPORT_RATE_DATA,
    GET_TRANSPORT_RATE_DATA_BY_ID,
    UPDATE_TRANSPORT_RATE_DATA,
    CHECK_TRANSPORT_RATE_DUPLICATE,
    GET_LAST_MODIFIED_DATE_TIME_TRANSPORT_RATE,
    GET_ALL_CHARGE_METHOD_DATA,
    GET_ALL_MODE_OF_TRANSPORT_DATA
} from '../../constant/master/TransportRateConstant';

//transport rate
export const saveTransportData = (data) => {
    return {
        type: SAVE_TRANSPORT_RATE_DATA,
        data
    };
};

export const getAllSeasonData = () => {
    return {
        type: GET_ALL_TRANSPORT_RATE_DATA
    };
};

export const getLatestModifiedDetails = () => {
    return {
        type: GET_LAST_MODIFIED_DATE_TIME_TRANSPORT_RATE
    };
};

export const getSeasonDataById = (id) => {
    return {
        type: GET_TRANSPORT_RATE_DATA_BY_ID,
        data: { id }
    };
};

export const updateSeasonData = (data) => {
    return {
        type: UPDATE_TRANSPORT_RATE_DATA,
        data
    };
};

export const checkDuplicateSeasonCode = (SeasonCode) => {
    return {
        type: CHECK_TRANSPORT_RATE_DUPLICATE,
        data: { SeasonCode }
    };
};

//mode of transport
export const getAllModeofTransports = () => {
    return {
        type: GET_ALL_MODE_OF_TRANSPORT_DATA
    };
};

//charge methods
export const getAllChargeMethods = () => {
    return {
        type: GET_ALL_CHARGE_METHOD_DATA
    };
};
