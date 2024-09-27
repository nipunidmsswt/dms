import {
    ADD_FAILED_GUIDE_CLASS_DATA,
    ADD_SUCCESS_GUIDE_CLASS_DATA,
    FAILED_GET_ALL_ACTIVE_GUIDE_CLASS_DATA,
    FAILED_GET_ALL_GUIDE_CLASS_DATA,
    FAILED_GET_GUIDE_CLASS_DETAILS_BY_CODE,
    FAILED_GET_GUIDE_CLASS_LAST_MODIFIED_DATE_TIME,
    GUIDE_CLASS_CODE_DUPLICATE,
    SUCCESS_GET_ALL_ACTIVE_GUIDE_CLASS_DATA,
    SUCCESS_GET_ALL_GUIDE_CLASS_DATA,
    SUCCESS_GET_GUIDE_CLASS_DETAILS_BY_CODE,
    SUCCESS_GET_GUIDE_CLASS_LAST_MODIFIED_DATE_TIME,
    UPDATE_FAILED_GUIDE_CLASS_DATA,
    UPDATE_SUCCESS_GUIDE_CLASS_DATA
} from '../../constant/master/GuideClassConstant';

const initialState = {
    guideClass: null,
    guideClassList: [],
    guideClassToUpdate: null,
    errorMsg: null,
    duplicateCodeType: null,
    duplicateCode: null,
    lastModifiedDateTime: null,
    cluterTypesDetails: [],
    guideClassActiveList: []
};

export const guideClassReducer = (state = initialState, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case ADD_SUCCESS_GUIDE_CLASS_DATA:
            console.warn('ADD_SUCCESS_CODE_AND_NAME_DATA', action.payload);
            console.log(data.payload[0]);
            return { ...state, guideClass: data.payload[0] };

        case ADD_FAILED_GUIDE_CLASS_DATA:
            console.warn('ADD_FAILED_CODE_AND_NAME_DATA', action);
            console.log(data);
            return {
                ...state,
                guideClass: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_GUIDE_CLASS_DETAILS_BY_CODE:
            return { ...state, guideClassToUpdate: data.payload[0] };

        case FAILED_GET_GUIDE_CLASS_DETAILS_BY_CODE:
            return {
                ...state,
                guideClassToUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case UPDATE_SUCCESS_GUIDE_CLASS_DATA:
            return { ...state, guideClass: data.payload[0] };

        case UPDATE_FAILED_GUIDE_CLASS_DATA:
            return {
                ...state,
                guideClass: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_ALL_GUIDE_CLASS_DATA:
            console.log(data.payload[0]);
            return { ...state, guideClassList: data.payload[0] };

        case FAILED_GET_ALL_GUIDE_CLASS_DATA:
            return { ...state, guideClassList: data };

        case GUIDE_CLASS_CODE_DUPLICATE:
            return { ...state, duplicateCode: data };

        case SUCCESS_GET_GUIDE_CLASS_LAST_MODIFIED_DATE_TIME:
            return { ...state, lastModifiedDateTime: data.payload[0].dateTime };

        case FAILED_GET_GUIDE_CLASS_LAST_MODIFIED_DATE_TIME:
            return { ...state, lastModifiedDateTime: data };

        case SUCCESS_GET_ALL_ACTIVE_GUIDE_CLASS_DATA:
            return { ...state, guideClassActiveList: data.payload[0] };

        case FAILED_GET_ALL_ACTIVE_GUIDE_CLASS_DATA:
            return { ...state, guideClassActiveList: data.payload[0] };

        default:
            return state;
    }
};
