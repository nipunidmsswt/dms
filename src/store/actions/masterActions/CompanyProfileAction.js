import {
    SAVE_COMPANY_PROFILE,
    GET_ALL_COMPANY_PROFILE,
    GET_COMPANY_PROFILE_BY_ID,
    UPDATE_COMPANY_PROFILE,
    CHECK_COMPANY_PROFILE_CODE_DUPLICATE,
    GET_COMPANY_PROFILE_LAST_MODIFIED_DATE_TIME,
    GET_AVAILABLE_LICENSE_COUNT
} from '../../constant/master/CompanyProfilrConstant';

export const saveCompanyProfileData = (data) => {
    return {
        type: SAVE_COMPANY_PROFILE,
        data
    };
};

export const getAllCompanyProfileData = () => {
    return {
        type: GET_ALL_COMPANY_PROFILE
    };
};

export const getLatestModifiedDetails = () => {
    return {
        type: GET_COMPANY_PROFILE_LAST_MODIFIED_DATE_TIME
    };
};

export const getCompanyProfileDataById = (id) => {
    return {
        type: GET_COMPANY_PROFILE_BY_ID,
        data: { id }
    };
};

export const updateCompanyProfileData = (data) => {
    return {
        type: UPDATE_COMPANY_PROFILE,
        data
    };
};

export const checkDuplicateCompanyProfileCode = (CompanyProfileCode) => {
    return {
        type: CHECK_COMPANY_PROFILE_CODE_DUPLICATE,
        data: { CompanyProfileCode }
    };
};

export const getAvailableLicenseCount = (companyProfileId) => {
    return {
        type: GET_AVAILABLE_LICENSE_COUNT,
        data: { companyProfileId }
    };
};
