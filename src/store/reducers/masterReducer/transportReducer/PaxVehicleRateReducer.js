import {
    ADD_SUCCESS_PAX_VEHICLE_RATE,
    ADD_FAILED_PAX_VEHICLE_RATE,
    UPDATE_SUCCESS_PAX_VEHICLE_RATE,
    UPDATE_FAILED_PAX_VEHICLE_RATE,
    SUCCESS_PAX_VEHICLE_RATE_LIST_DATA,
    FAILED_PAX_VEHICLE_RATE_LIST_DATA,
    SUCCESS_GET_PAX_VEHICLE_RATE_BY_ID,
    FAILED_GET_PAX_VEHICLE_RATE_BY_ID,
    PAX_VEHICLE_RATE_CODE_DUPLICATE,
    SUCCESS_PAX_VEHICLE_RATE_LAST_MODIFIED_DATE,
    FAILED_PAX_VEHICLE_RATE_LAST_MODIFIED_DATE,
    SUCCESS_CLEAR_PAX_VEHICLE_RATE
} from 'store/constant/master/TransportMasterConstant/PaxVehicleRateConstant';

const initialState = {
    paxVehicleRate: null,
    paxVehicleRates: [],
    updatedPaxVehicleRate: null,
    paxVehicleRateToUpdate: null,
    errorMsg: null,
    duplicatePaxVehicleRate: null,
    lastModifiedDateTime: null
};

export const paxVehicleRateReducer = (state = initialState, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case ADD_SUCCESS_PAX_VEHICLE_RATE:
            return { ...state, paxVehicleRate: data.payload[0] };

        case ADD_FAILED_PAX_VEHICLE_RATE:
            return {
                ...state,
                paxVehicleRate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_PAX_VEHICLE_RATE_BY_ID:
            return { ...state, paxVehicleRateToUpdate: data.payload === null ? null : data.payload[0] };

        case FAILED_GET_PAX_VEHICLE_RATE_BY_ID:
            return {
                ...state,
                paxVehicleRateToUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case UPDATE_SUCCESS_PAX_VEHICLE_RATE:
            return { ...state, updatedPaxVehicleRate: data.payload[0] };

        case UPDATE_FAILED_PAX_VEHICLE_RATE:
            return {
                ...state,
                updatedPaxVehicleRate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_PAX_VEHICLE_RATE_LIST_DATA:
            return { ...state, paxVehicleRates: data };

        case FAILED_PAX_VEHICLE_RATE_LIST_DATA:
            return { ...state, paxVehicleRates: data };

        case PAX_VEHICLE_RATE_CODE_DUPLICATE:
            return { ...state, duplicatePaxVehicleRate: data };

        case SUCCESS_PAX_VEHICLE_RATE_LAST_MODIFIED_DATE:
            return { ...state, lastModifiedDateTime: data.payload[0].dateTime };

        case FAILED_PAX_VEHICLE_RATE_LAST_MODIFIED_DATE:
            return { ...state, lastModifiedDateTime: data };

        case SUCCESS_CLEAR_PAX_VEHICLE_RATE:
            return { ...state, paxVehicleRate: null };

        default:
            return state;
    }
};
