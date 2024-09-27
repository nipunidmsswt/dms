import {
    SAVE_DEPARTMENT_DESIGNATION,
    GET_ALL_DEPARTMENT_DESIGNATION,
    GET_DEPARTMENT_DESIGNATION_BY_ID,
    UPDATE_DEPARTMENT_DESIGNATION,
    CHECK_DEPARTMENT_DESIGNATION_CODE_DUPLICATE,
    GET_DEPARTMENT_DESIGNATION_LAST_MODIFIED_DATE_TIME,
    GET_ALL_DEPARTMENT_ACTIVE,
    GET_ALL_DESIGNATION_ACTIVE
} from '../../constant/master/DepartmentDesignationConstant';

export const saveDepartmentDesignationData = (data) => {
    return {
        type: SAVE_DEPARTMENT_DESIGNATION,
        data
    };
};

export const getAllDepartmentDesignationData = () => {
    return {
        type: GET_ALL_DEPARTMENT_DESIGNATION
    };
};

export const getLatestModifiedDetails = () => {
    return {
        type: GET_DEPARTMENT_DESIGNATION_LAST_MODIFIED_DATE_TIME
    };
};

export const getDepartmentDesignationDataById = (id, type) => {
    return {
        type: GET_DEPARTMENT_DESIGNATION_BY_ID,
        data: { id, type }
    };
};

export const updateDepartmentDesignationData = (data) => {
    return {
        type: UPDATE_DEPARTMENT_DESIGNATION,
        data
    };
};

export const checkDuplicateDepartmentDesignationCode = (code) => {
    return {
        type: CHECK_DEPARTMENT_DESIGNATION_CODE_DUPLICATE,
        data: { code }
    };
};

export const getAllDepartmentData = () => {
    return {
        type: GET_ALL_DEPARTMENT_ACTIVE
    };
};

export const getAllDesignationData = () => {
    return {
        type: GET_ALL_DESIGNATION_ACTIVE
    };
};
