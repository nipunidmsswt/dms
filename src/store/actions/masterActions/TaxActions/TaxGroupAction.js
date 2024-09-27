import {
    SAVE_TAX_GROUP_DATA,
    GET_ALL_TAX_GROUP_DATA,
    GET_TAX_GROUP_DATA_BY_ID,
    UPDATE_TAX_GROUP_DATA,
    CHECK_TAX_GROUP_DUPLICATE,
    GET_LAST_MODIFIED_DATE_TIME_TAX_GROUP,
    GET_ACTIVE_TAX_GROUP_LIST,
    GET_TAX_GROUP_AND_TAX_LIST
} from '../../../constant/master/TaxMasterConstant';

export const saveTaxGroupData = (data) => {
    console.log('saveTax group Data action s called', data);
    return {
        type: SAVE_TAX_GROUP_DATA,
        data
    };
};

export const getAllTaxGroupDetails = () => {
    console.log('get all group Data action s called');
    return {
        type: GET_ALL_TAX_GROUP_DATA
    };
};

export const getTaxGroupDataById = (id) => {
    console.log('getTaxDataById  called', id);
    return {
        type: GET_TAX_GROUP_DATA_BY_ID,
        data: { id }
    };
};

export const updateTaxGroupData = (data) => {
    console.log('getTaxDataById  called', data);
    return {
        type: UPDATE_TAX_GROUP_DATA,
        data: data
    };
};

export const checkDuplicateTaxGroupCode = (data) => {
    console.log('getTaxDataById  called', data);
    return {
        type: CHECK_TAX_GROUP_DUPLICATE,
        data: data
    };
};

export const getLatestModifiedTaxGroupDetails = () => {
    return {
        type: GET_LAST_MODIFIED_DATE_TIME_TAX_GROUP
    };
};

export const getActiveTaxGroupList = () => {
    return {
        type: GET_ACTIVE_TAX_GROUP_LIST
    };
};

export const getActiveTaxGroupandTaxList = (data) => {
    return {
        type: GET_TAX_GROUP_AND_TAX_LIST,
        data: data
    };
};
