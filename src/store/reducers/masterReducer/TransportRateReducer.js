import {
    ADD_SUCCESS_TRANSPORT_RATE_DATA,
    ADD_FAILED_TRANSPORT_RATE_DATA,
    SUCCESS_GET_TRANSPORT_RATE_DATA_BY_ID,
    FAILED_GET_TRANSPORT_RATE_DATA_BY_ID,
    SUCCESS_TRANSPORT_RATE_LIST_DATA,
    FAILED_TRANSPORT_RATE_LIST_DATA,
    UPDATE_FAILED_TRANSPORT_RATE_DATA,
    UPDATE_SUCCESS_TRANSPORT_RATE_DATA,
    TRANSPORT_RATE_DUPLICATE,
    FAILED_LAST_MODIFIED_DATE_TRANSPORT_RATE,
    SUCCESS_LAST_MODIFIED_DATE_TRANSPORT_RATE,
    SUCCESS_MODE_OF_TRANSPORT_LIST_DATA,
    FAILED_MODE_OF_TRANSPORT_LIST_DATA,
    SUCCESS_CHARGE_METHOD_LIST_DATA,
    FAILED_CHARGE_METHOD_LIST_DATA
} from '../../constant/master/TransportRateConstant';

const initialStateTransportRate = {
    transportRate: null,
    transportRates: [],
    transportRateToUpdate: null,
    errorMsg: null,
    duplicateTransportRate: null,
    lastModifiedDateTime: null
};

const initialStateChargeMethod = {
    chargeofMethods: [],
    errorMsg: null
};

const initialStateModeofTransport = {
    modeofTransports: [],
    errorMsg: null
};

// export const transportRateReducer = (state = initialStateTransportRate, action) => {
//     const { data } = action;
//     console.log(data);
//     switch (
//         action.type
//         // case ADD_SUCCESS_TRANSPORT_RATE_DATA:
//         //     return { ...state, transportRate: data.payload[0] };

//         // case ADD_FAILED_SEASON_DATA:
//         //     return {
//         //         ...state,
//         //         transportRate: null,
//         //         errorMsg: data ? data.errorMessages : 'netwok error'
//         //     };

//         // case SUCCESS_GET_SEASON_DATA_BY_ID:
//         //     return { ...state, seasonToUpdate: data.payload[0] };

//         // case FAILED_GET_SEASON_DATA_BY_ID:
//         //     return {
//         //         ...state,
//         //         seasonToUpdate: null,
//         //         errorMsg: data ? data.errorMessages : 'netwok error'
//         //     };

//         // case UPDATE_SUCCESS_SEASON_DATA:
//         //     return { ...state, season: data.payload[0] };

//         // case UPDATE_FAILED_SEASON_DATA:
//         //     return {
//         //         ...state,
//         //         season: null,
//         //         errorMsg: data ? data.errorMessages : 'netwok error'
//         //     };

//         // case SUCCESS_SEASON_LIST_DATA:
//         //     return { ...state, seasons: data };

//         // case FAILED_SEASON_LIST_DATA:
//         //     return { ...state, seasons: data };

//         // case SEASON_DUPLICATE:
//         //     return { ...state, duplicateSeason: data };

//         // case SUCCESS_LAST_MODIFIED_DATE_SEASON:
//         //     return { ...state, lastModifiedDateTime: data.payload[0].dateTime };

//         // case FAILED_LAST_MODIFIED_DATE_SEASON:
//         //     return { ...state, lastModifiedDateTime: data };

//         // default:
//         //     return state;
//     ) {
//     }
// };

export const chargeMethodReducer = (state = initialStateChargeMethod, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case SUCCESS_CHARGE_METHOD_LIST_DATA:
            return { ...state, chargeofMethods: data.payload };

        case FAILED_CHARGE_METHOD_LIST_DATA:
            return { ...state, chargeofMethods: data.payload };

        default:
            return state;
    }
};

export const modeOfTransortReducer = (state = initialStateModeofTransport, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case SUCCESS_MODE_OF_TRANSPORT_LIST_DATA:
            return { ...state, modeofTransports: data.payload };

        case FAILED_MODE_OF_TRANSPORT_LIST_DATA:
            return { ...state, modeofTransports: data.payload };

        default:
            return state;
    }
};
