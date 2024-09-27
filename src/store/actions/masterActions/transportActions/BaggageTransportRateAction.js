import {
    CHECK_BAGGAGE_TRANSPORT_RATE_CODE_DUPLICATE,
    CLEAR_BAGGAGE_TRANSPORT_RATE,
    GET_ALL_BAGGAGE_TRANSPORT_RATE,
    GET_BAGGAGE_TRANSPORT_RATE_BY_ID,
    GET_BAGGAGE_TRANSPORT_RATE_LAST_MODIFIED_DATE_TIME,
    SAVE_BAGGAGE_TRANSPORT_RATE,
    UPDATE_BAGGAGE_TRANSPORT_RATE,
    GET_ALL_ACTIVE_BAGGAGE_TRANSPORT_RATE
} from 'store/constant/master/TransportMasterConstant/BaggageTransportRateConstant';

export const saveBaggageTransportRateData = (data) => {
    return {
        type: SAVE_BAGGAGE_TRANSPORT_RATE,
        data
    };
};

export const getAllBaggageTransportRateData = () => {
    return {
        type: GET_ALL_BAGGAGE_TRANSPORT_RATE
    };
};

export const getLatestModifiedDetails = () => {
    return {
        type: GET_BAGGAGE_TRANSPORT_RATE_LAST_MODIFIED_DATE_TIME
    };
};

export const getBaggageTransportRateDataById = (id) => {
    return {
        type: GET_BAGGAGE_TRANSPORT_RATE_BY_ID,
        data: { id }
    };
};

export const updateBaggageTransportRateData = (data) => {
    return {
        type: UPDATE_BAGGAGE_TRANSPORT_RATE,
        data
    };
};

export const checkDuplicateBaggageTransportRateCode = (data) => {
    return {
        type: CHECK_BAGGAGE_TRANSPORT_RATE_CODE_DUPLICATE,
        data: { data }
    };
};

export const clearBaggageTransportRate = () => {
    return {
        type: CLEAR_BAGGAGE_TRANSPORT_RATE
    };
};

// export const getTransportMainCategoryDataByType = (type) => {
//     console.log(type);
//     return {
//         type: GET_TRANSPORT_MAIN_CATEGORY_DATA_BY_TYPE,
//         data: { type }
//     };
// };
