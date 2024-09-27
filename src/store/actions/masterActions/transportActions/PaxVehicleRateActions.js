import {
    CHECK_PAX_VEHICLE_RATE_CODE_DUPLICATE,
    CLEAR_PAX_VEHICLE_RATE,
    GET_ALL_PAX_VEHICLE_RATE,
    GET_PAX_VEHICLE_RATE_BY_ID,
    GET_PAX_VEHICLE_RATE_LAST_MODIFIED_DATE_TIME,
    SAVE_PAX_VEHICLE_RATE,
    UPDATE_PAX_VEHICLE_RATE,
    GET_ALL_ACTIVE_PAX_VEHICLE_RATE
} from 'store/constant/master/TransportMasterConstant/PaxVehicleRateConstant';

export const savePaxVehicleRateData = (data) => {
    return {
        type: SAVE_PAX_VEHICLE_RATE,
        data
    };
};

export const getAllPaxVehicleRateData = () => {
    return {
        type: GET_ALL_PAX_VEHICLE_RATE
    };
};

export const getLatestModifiedDetails = () => {
    return {
        type: GET_PAX_VEHICLE_RATE_LAST_MODIFIED_DATE_TIME
    };
};

export const getPaxVehicleRateDataById = (id) => {
    return {
        type: GET_PAX_VEHICLE_RATE_BY_ID,
        data: { id }
    };
};

export const updatePaxVehicleRateData = (data) => {
    return {
        type: UPDATE_PAX_VEHICLE_RATE,
        data
    };
};

export const checkDuplicatePaxVehicleRateCode = (data) => {
    return {
        type: CHECK_PAX_VEHICLE_RATE_CODE_DUPLICATE,
        data: { data }
    };
};

export const clearPaxVehicleRate = () => {
    return {
        type: CLEAR_BAGGAGE_TRANSPORT_RATE
    };
};

export const getTransportMainCategoryDataByType = (type) => {
    console.log(type);
    return {
        type: GET_TRANSPORT_MAIN_CATEGORY_DATA_BY_TYPE,
        data: { type }
    };
};
