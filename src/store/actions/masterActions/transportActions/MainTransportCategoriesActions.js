import {
    SAVE_MAIN_TRANSPORT_DETAILS_DATA,
    GET_ALL_MAIN_TRANSPORT_DETAILS_DATA,
    GET_MAIN_TRANSPORT_DETAILS_BY_ID,
    UPDATE_MAIN_TRANSPORT_DETAILS_DATA,
    CHECK_MAIN_TRANSPORT_DETAILS_DUPLICATE,
    GET_LAST_MODIFIED_DATE_TIME_MAIN_TRANSPORT_DETAILS,
    GET_TRANSPORT_MAIN_CATEGORY_DATA_BY_TYPE,
    GET_ACTIVE_TRANSPORT_MAIN_CATEGORY_DATA_BY_TYPE,
    GET_ACTIVE_VEHICLE_CATEGORY_DATA_BY_TYPE,
    GET_ACTIVE_VEHICLE_TYPE_DATA_BY_TYPE
} from '../../../constant/master/TransportMasterConstant/MainTransportCategoryConstant';

export const saveMainTransportDetailsData = (data) => {
    return {
        type: SAVE_MAIN_TRANSPORT_DETAILS_DATA,
        data
    };
};

export const getAllMainTransportDetailsData = () => {
    return {
        type: GET_ALL_MAIN_TRANSPORT_DETAILS_DATA
    };
};

export const getLatestModifiedDetails = () => {
    return {
        type: GET_LAST_MODIFIED_DATE_TIME_MAIN_TRANSPORT_DETAILS
    };
};

export const getMainTransportDetailstDataById = (id) => {
    return {
        type: GET_MAIN_TRANSPORT_DETAILS_BY_ID,
        data: { id }
    };
};

export const updateMainTransportDetailsData = (data) => {
    return {
        type: UPDATE_MAIN_TRANSPORT_DETAILS_DATA,
        data
    };
};

export const checkDuplicateMainTransportDetailsCode = (MainTransportCode) => {
    return {
        type: CHECK_MAIN_TRANSPORT_DETAILS_DUPLICATE,
        data: { MainTransportCode }
    };
};

export const getTransportMainCategoryDataByType = (type) => {
    console.log(type);
    return {
        type: GET_TRANSPORT_MAIN_CATEGORY_DATA_BY_TYPE,
        data: { type }
    };
};

export const getAllActiveTransportMainCategoryDataByType = (type) => {
    console.log(type);
    return {
        type: GET_ACTIVE_TRANSPORT_MAIN_CATEGORY_DATA_BY_TYPE,
        data: { type }
    };
};

export const getAllActiveVehicleCategoryDataByType = (type) => {
    console.log(type);
    return {
        type: GET_ACTIVE_VEHICLE_CATEGORY_DATA_BY_TYPE,
        data: { type }
    };
};

export const getAllActiveVehicleTypeDataByType = (type) => {
    console.log(type);
    return {
        type: GET_ACTIVE_VEHICLE_TYPE_DATA_BY_TYPE,
        data: { type }
    };
};
