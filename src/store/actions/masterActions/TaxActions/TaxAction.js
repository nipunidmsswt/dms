import {
    CHECK_TAX_DUPLICATE,
    GET_ALL_TAX_DATA,
    GET_LAST_MODIFIED_DATE_TIME_TAX,
    GET_TAX_DATA_BY_ID,
    GET_TAX_DATA_BY_UNIQUE_ID,
    SAVE_TAX_DATA,
    TAX_DUPLICATE,
    UPDATE_TAX_DATA
} from 'store/constant/master/TaxMasterConstant';

export const saveTaxData = (data) => {
    console.log('saveTaxData action s called', data);
    return {
        type: SAVE_TAX_DATA,
        data
    };
};

export const updateTaxData = (data) => {
    console.log('updateTaxData action s called', data);
    return {
        type: UPDATE_TAX_DATA,
        data
    };
};
export const getTaxDataById = (id) => {
    console.log('getTaxDataByCode  called', id);
    return {
        type: GET_TAX_DATA_BY_ID,
        data: { id }
    };
};

export const getTaxDataByUniqueId = (id) => {
    console.log('getTaxDataById  called', id);
    return {
        type: GET_TAX_DATA_BY_UNIQUE_ID,
        data: { id }
    };
};

export const getAllTaxData = () => {
    console.log('getAllTaxData  called');
    return {
        type: GET_ALL_TAX_DATA
    };
};

export const checkDuplicateTaxCode = (taxCode) => {
    console.log('getAllTaxData  called');
    return {
        type: CHECK_TAX_DUPLICATE,
        data: { taxCode }
    };
};

export const taxDuplicateError = (data) => {
    console.log('getAllTaxData  called');
    return {
        type: TAX_DUPLICATE,
        data: data
    };
};

export const getLatestModifiedTaxDetails = () => {
    return {
        type: GET_LAST_MODIFIED_DATE_TIME_TAX
    };
};
