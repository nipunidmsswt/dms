import {
    ADD_SUCCESS_COMPANY_PROFILE,
    ADD_FAILED_COMPANY_PROFILE,
    SUCCESS_COMPANY_PROFILE_LAST_MODIFIED_DATE,
    FAILED_GET_COMPANY_PROFILE_BY_ID,
    SUCCESS_GET_COMPANY_PROFILE_BY_ID,
    UPDATE_FAILED_COMPANY_PROFILE,
    FAILED_COMPANY_PROFILE_LAST_MODIFIED_DATE,
    UPDATE_SUCCESS_COMPANY_PROFILE,
    SUCCESS_COMPANY_PROFILE_LIST_DATA,
    FAILED_COMPANY_PROFILE_LIST_DATA,
    COMPANY_PROFILE_CODE_DUPLICATE,
    SUCCESS_AVAILABLE_LICENSE_COUNT,
    FAILED_AVAILABLE_LICENSE_COUNT
} from '../../constant/master/CompanyProfilrConstant';

const initialState = {
    companyProfile: null,
    companyProfileList: [],
    companyProfileToUpdate: null,
    errorMsg: null,
    duplicatecompanyProfileGroup: null,
    lastModifiedDateTime: null,
    availableLicenseCount: null
};

export const companyProfileReducer = (state = initialState, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case ADD_SUCCESS_COMPANY_PROFILE:
            return { ...state, companyProfile: data };

        case ADD_FAILED_COMPANY_PROFILE:
            return {
                ...state,
                companyProfile: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_COMPANY_PROFILE_BY_ID:
            return { ...state, companyProfileToUpdate: data.payload[0].body.payload[0]?.companyProfile };

        case FAILED_GET_COMPANY_PROFILE_BY_ID:
            return {
                ...state,
                companyProfileToUpdate: null,
                errorMsg: data ? data.payload[0].body.errorMessages : 'netwok error'
            };

        case UPDATE_SUCCESS_COMPANY_PROFILE:
            return { ...state, companyProfile: data.payload[0] };

        case UPDATE_FAILED_COMPANY_PROFILE:
            return {
                ...state,
                companyProfile: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_COMPANY_PROFILE_LIST_DATA:
            return { ...state, companyProfileList: data };

        case FAILED_COMPANY_PROFILE_LIST_DATA:
            return { ...state, companyProfileList: data };

        case SUCCESS_COMPANY_PROFILE_LAST_MODIFIED_DATE:
            return { ...state, lastModifiedDateTime: data.payload[0].dateTime };

        case FAILED_COMPANY_PROFILE_LAST_MODIFIED_DATE:
            return { ...state, lastModifiedDateTime: data };

        case COMPANY_PROFILE_CODE_DUPLICATE:
            return { ...state, duplicatecompanyProfileGroup: data };

        case SUCCESS_AVAILABLE_LICENSE_COUNT:
            return { ...state, availableLicenseCount: data.payload[0] };

        case FAILED_AVAILABLE_LICENSE_COUNT:
            return { ...state, availableLicenseCount: null };

        default:
            return state;
    }
};
