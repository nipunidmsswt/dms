import {
    ADD_FAILED_ACTUAL_GUIDE_DATA,
    ADD_SUCCESS_ACTUAL_GUIDE_DATA,
    FAILED_GET_ALL_ACTIVE_ACTUAL_GUIDE_DATA,
    FAILED_GET_ALL_ACTUAL_GUIDE_DATA,
    FAILED_GET_ACTUAL_GUIDE_DETAILS_BY_ID,
    FAILED_GET_ACTUAL_GUIDE_LAST_MODIFIED_DATE_TIME,
    ACTUAL_GUIDE_CODE_DUPLICATE,
    SUCCESS_GET_ALL_ACTIVE_ACTUAL_GUIDE_DATA,
    SUCCESS_GET_ALL_ACTUAL_GUIDE_DATA,
    SUCCESS_GET_ACTUAL_GUIDE_DETAILS_BY_ID,
    SUCCESS_GET_ACTUAL_GUIDE_LAST_MODIFIED_DATE_TIME,
    UPDATE_FAILED_ACTUAL_GUIDE_DATA,
    UPDATE_SUCCESS_ACTUAL_GUIDE_DATA
} from '../../constant/master/ActualGuideConstant';

const initialState = {
    actualGuide: null,
    actualGuideList: [],
    actualGuideToUpdate: null,
    errorMsg: null,
    duplicateCode: null,
    lastModifiedDateTime: null,
    actualGuideActiveList: []
};

export const actualGuideReducer = (state = initialState, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case ADD_SUCCESS_ACTUAL_GUIDE_DATA:
            console.log(data.payload[0]);
            return { ...state, actualGuide: data.payload[0] };

        case ADD_FAILED_ACTUAL_GUIDE_DATA:
            console.log(data);
            return {
                ...state,
                actualGuide: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_ACTUAL_GUIDE_DETAILS_BY_ID:
            return { ...state, actualGuideToUpdate: data.payload[0] };

        case FAILED_GET_ACTUAL_GUIDE_DETAILS_BY_ID:
            return {
                ...state,
                actualGuideToUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case UPDATE_SUCCESS_ACTUAL_GUIDE_DATA:
            return { ...state, guideClass: data.payload[0] };

        case UPDATE_FAILED_ACTUAL_GUIDE_DATA:
            return {
                ...state,
                guideClass: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_ALL_ACTUAL_GUIDE_DATA:
            console.log(data.payload[0]);
            return { ...state, actualGuideList: data.payload[0] };

        case FAILED_GET_ALL_ACTUAL_GUIDE_DATA:
            return { ...state, actualGuideList: data };

        case ACTUAL_GUIDE_CODE_DUPLICATE:
            console.log('ACTUAL_GUIDE_CODE_DUPLICATE');
            console.log(data);
            return { ...state, duplicateCode: data };

        case SUCCESS_GET_ACTUAL_GUIDE_LAST_MODIFIED_DATE_TIME:
            return { ...state, lastModifiedDateTime: data.payload[0].dateTime };

        case FAILED_GET_ACTUAL_GUIDE_LAST_MODIFIED_DATE_TIME:
            return { ...state, lastModifiedDateTime: data };

        case SUCCESS_GET_ALL_ACTIVE_ACTUAL_GUIDE_DATA:
            return { ...state, guideClassActiveList: data.payload[0] };

        case FAILED_GET_ALL_ACTIVE_ACTUAL_GUIDE_DATA:
            return { ...state, guideClassActiveList: data.payload[0] };

        default:
            return state;
    }
};
