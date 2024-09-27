import {
    ADD_SUCCESS_ACTIVITY_SUPPLIMENT_DATA,
    FAILED_GET_ALL_ACTIVE_ACTIVITY_SUPPLIMENT_DATA,
    FAILED_GET_ALL_ACTIVITY_SUPPLIMENT_DATA,
    FAILED_GET_ACTIVITY_SUPPLIMENT_DETAILS_BY_CODE,
    FAILED_GET_ACTIVITY_SUPPLIMENT_LAST_MODIFIED_DATE_TIME,
    ACTIVITY_SUPPLIMENT_CODE_DUPLICATE,
    SUCCESS_GET_ALL_ACTIVE_ACTIVITY_SUPPLIMENT_DATA,
    SUCCESS_GET_ALL_ACTIVITY_SUPPLIMENT_DATA,
    SUCCESS_GET_ACTIVITY_SUPPLIMENT_DETAILS_BY_CODE,
    SUCCESS_GET_ACTIVITY_SUPPLIMENT_LAST_MODIFIED_DATE_TIME,
    UPDATE_FAILED_ACTIVITY_SUPPLIMENT_DATA,
    UPDATE_SUCCESS_ACTIVITY_SUPPLIMENT_DATA,
    ADD_FAILED_ACTIVITY_SUPPLIMENT_DATA,
    SUCCESS_GET_ALL_ACTIVE_ACT_SUP_MIS_DATA_BY_LOCATION_AND_TYPE,
    FAILED_GET_ALL_ACTIVE_ACT_SUP_MIS_DATA_BY_LOCATION_AND_TYPE
} from 'store/constant/master/Activity_SupplimentConstant';

const initialState = {
    activity_suppliment: null,
    activity_supplimentList: [],
    activity_supplimentToUpdate: null,
    errorMsg: null,
    duplicateCodeType: null,
    duplicateCode: null,
    lastModifiedDateTime: null,
    cluterTypesDetails: [],
    activity_supplimentActiveList: [],
    actSupMisListByLocationandType: []
};

export const activity_supplimentReducer = (state = initialState, action) => {
    const { data } = action;
    switch (action.type) {
        case ADD_SUCCESS_ACTIVITY_SUPPLIMENT_DATA:
            console.log(data.payload[0]);
            return { ...state, activity_suppliment: data.payload[0] };

        case ADD_FAILED_ACTIVITY_SUPPLIMENT_DATA:
            console.warn('ADD_FAILED_CODE_AND_NAME_DATA', action);
            console.log(data);
            return {
                ...state,
                activity_suppliment: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_ACTIVITY_SUPPLIMENT_DETAILS_BY_CODE:
            return { ...state, activity_supplimentToUpdate: data.payload[0] };

        case FAILED_GET_ACTIVITY_SUPPLIMENT_DETAILS_BY_CODE:
            return {
                ...state,
                activity_supplimentToUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case UPDATE_SUCCESS_ACTIVITY_SUPPLIMENT_DATA:
            return { ...state, activity_suppliment: data.payload[0] };

        case UPDATE_FAILED_ACTIVITY_SUPPLIMENT_DATA:
            return {
                ...state,
                activity_suppliment: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_ALL_ACTIVITY_SUPPLIMENT_DATA:
            console.log(data.payload[0]);
            return { ...state, activity_supplimentList: data.payload[0] };

        case FAILED_GET_ALL_ACTIVITY_SUPPLIMENT_DATA:
            return { ...state, activity_supplimentList: data };

        case ACTIVITY_SUPPLIMENT_CODE_DUPLICATE:
            return { ...state, duplicateCode: data };

        case SUCCESS_GET_ACTIVITY_SUPPLIMENT_LAST_MODIFIED_DATE_TIME:
            return { ...state, lastModifiedDateTime: data.payload[0].dateTime };

        case FAILED_GET_ACTIVITY_SUPPLIMENT_LAST_MODIFIED_DATE_TIME:
            return { ...state, lastModifiedDateTime: data };

        case SUCCESS_GET_ALL_ACTIVE_ACTIVITY_SUPPLIMENT_DATA:
            return { ...state, activity_supplimentActiveList: data.payload[0] };

        case FAILED_GET_ALL_ACTIVE_ACTIVITY_SUPPLIMENT_DATA:
            return { ...state, activity_supplimentActiveList: data.payload[0] };

        case SUCCESS_GET_ALL_ACTIVE_ACT_SUP_MIS_DATA_BY_LOCATION_AND_TYPE:
            return { ...state, actSupMisListByLocationandType: data.payload[0] };

        case FAILED_GET_ALL_ACTIVE_ACT_SUP_MIS_DATA_BY_LOCATION_AND_TYPE:
            console.log('heyyyyyyyyyyyyy bn3');
            console.log(data);
            return {
                ...state,
                actSupMisListByLocationandType: [],
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        default:
            return state;
    }
};
