import {
    SAVE_MANAGING_COMAPANY_DATA,
    GET_ALL_MANAGING_COMAPANY_DATA,
    GET_MANAGING_COMAPANY_DATA_BY_ID,
    UPDATE_MANAGING_COMAPANY_DATA,
    CHECK_MANAGING_COMAPANY_DUPLICATE,
    GET_LAST_MODIFIED_DATE_TIME_MANAGING_COMAPANY,
    GET_ALL_ACTIVE_MANAGING_COMAPANY_DATA
} from '../../constant/master/ManagingCompanyConstant';

export const saveManagingCompanyData = (data) => {
    console.log('saveManagingCompanyData  Data action s called', data);
    return {
        type: SAVE_MANAGING_COMAPANY_DATA,
        data
    };
};

export const getAllManagingCompanyDetails = () => {
    console.log('get getAllManagingCompanyDetails Data action s called');
    return {
        type: GET_ALL_MANAGING_COMAPANY_DATA
    };
};

export const getAllActiveManagingCompanyDetails = () => {
    console.log('get All Active Managing Compan yDetails Data action s called');
    return {
        type: GET_ALL_ACTIVE_MANAGING_COMAPANY_DATA
    };
};
export const getManagingCompanyDataById = (id) => {
    console.log('getManagingCompanyDataById  called', id);
    return {
        type: GET_MANAGING_COMAPANY_DATA_BY_ID,
        data: { id }
    };
};

export const updateManagingCompanyData = (data) => {
    console.log('updateManagingCompanyData  called', data);
    return {
        type: UPDATE_MANAGING_COMAPANY_DATA,
        data: data
    };
};

export const checkDuplicateManagingCompanyCode = (data) => {
    console.log('checkDuplicateManagingCompanyCode  called', data);
    return {
        type: CHECK_MANAGING_COMAPANY_DUPLICATE,
        data: data
    };
};

export const getLatestModifiedManagingCompanyDetails = () => {
    return {
        type: GET_LAST_MODIFIED_DATE_TIME_MANAGING_COMAPANY
    };
};
