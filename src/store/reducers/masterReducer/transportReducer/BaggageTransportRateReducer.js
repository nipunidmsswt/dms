import {
    ADD_SUCCESS_BAGGAGE_TRANSPORT_RATE,
    ADD_FAILED_BAGGAGE_TRANSPORT_RATE,
    UPDATE_SUCCESS_BAGGAGE_TRANSPORT_RATE,
    UPDATE_FAILED_BAGGAGE_TRANSPORT_RATE,
    SUCCESS_BAGGAGE_TRANSPORT_RATE_LIST_DATA,
    FAILED_BAGGAGE_TRANSPORT_RATE_LIST_DATA,
    SUCCESS_GET_BAGGAGE_TRANSPORT_RATE_BY_ID,
    FAILED_GET_BAGGAGE_TRANSPORT_RATE_BY_ID,
    BAGGAGE_TRANSPORT_RATE_CODE_DUPLICATE,
    SUCCESS_BAGGAGE_TRANSPORT_RATE_LAST_MODIFIED_DATE,
    FAILED_BAGGAGE_TRANSPORT_RATE_LAST_MODIFIED_DATE,
    SUCCESS_CLEAR_BAGGAGE_TRANSPORT_RATE
} from 'store/constant/master/TransportMasterConstant/BaggageTransportRateConstant';

const initialState = {
    bagggeTransportRate: null,
    bagggeTransportRates: [],
    updatedBagggeTransportRate: null,
    bagggeTransportRateToUpdate: null,
    errorMsg: null,
    duplicatePaxVehicleRate: null,
    lastModifiedDateTime: null
};

export const bagggeTransportRateReducer = (state = initialState, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case ADD_SUCCESS_BAGGAGE_TRANSPORT_RATE:
            return { ...state, bagggeTransportRate: data.payload[0] };

        case ADD_FAILED_BAGGAGE_TRANSPORT_RATE:
            return {
                ...state,
                bagggeTransportRate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_BAGGAGE_TRANSPORT_RATE_BY_ID:
            return { ...state, bagggeTransportRateToUpdate: data.payload === null ? null : data.payload[0] };

        case FAILED_GET_BAGGAGE_TRANSPORT_RATE_BY_ID:
            return {
                ...state,
                bagggeTransportRateToUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case UPDATE_SUCCESS_BAGGAGE_TRANSPORT_RATE:
            return { ...state, updatedBagggeTransportRate: data.payload[0] };

        case UPDATE_FAILED_BAGGAGE_TRANSPORT_RATE:
            return {
                ...state,
                updatedBagggeTransportRate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_BAGGAGE_TRANSPORT_RATE_LIST_DATA:
            return { ...state, bagggeTransportRates: data };

        case FAILED_BAGGAGE_TRANSPORT_RATE_LIST_DATA:
            return { ...state, bagggeTransportRates: data };

        case BAGGAGE_TRANSPORT_RATE_CODE_DUPLICATE:
            return { ...state, duplicatePaxVehicleRate: data };

        case SUCCESS_BAGGAGE_TRANSPORT_RATE_LAST_MODIFIED_DATE:
            return { ...state, lastModifiedDateTime: data.payload[0].dateTime };

        case FAILED_BAGGAGE_TRANSPORT_RATE_LAST_MODIFIED_DATE:
            return { ...state, lastModifiedDateTime: data };

        case SUCCESS_CLEAR_BAGGAGE_TRANSPORT_RATE:
            return { ...state, bagggeTransportRate: null };

        default:
            return state;
    }
};
