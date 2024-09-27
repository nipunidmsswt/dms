import { put, call } from 'redux-saga/effects';
import { create, get, getById, update } from 'apis/Apis';
import {
    ADD_SUCCESS_MAIN_TRANSPORT_DETAILS_DATA,
    ADD_FAILED_MAIN_TRANSPORT_DETAILS_DATA,
    SUCCESS_GET_MAIN_TRANSPORT_DETAILS_DATA_BY_ID,
    FAILED_GET_MAIN_TRANSPORT_DETAILS_DATA_BY_ID,
    SUCCESS_MAIN_TRANSPORT_DETAILS_LIST_DATA,
    FAILED_MAIN_TRANSPORT_DETAILS_LIST_DATA,
    UPDATE_FAILED_MAIN_TRANSPORT_DETAILS_DATA,
    UPDATE_SUCCESS_MAIN_TRANSPORT_DETAILS_DATA,
    MAIN_TRANSPORT_DETAILS_DUPLICATE,
    FAILED_LAST_MODIFIED_DATE_MAIN_TRANSPORT_DETAILS,
    SUCCESS_LAST_MODIFIED_DATE_MAIN_TRANSPORT_DETAILS,
    SUCCESS_GET_TRANSPORT_MAIN_CATEGORY_DATA_BY_TYPE,
    FAILED_GET_TRANSPORT_MAIN_CATEGORY_DATA_BY_TYPE,
    SUCCESS_GET_ACTIVE_TRANSPORT_MAIN_CATEGORY_DATA_BY_TYPE,
    FAILED_GET_ACTIVE_TRANSPORT_MAIN_CATEGORY_DATA_BY_TYPE,
    SUCCESS_GET_ACTIVE_VEHICLE_CATEGORY_DATA_BY_TYPE,
    SUCCESS_GET_ACTIVE_VEHICLE_TYPE_DATA_BY_TYPE,
    FAILED_GET_GET_ACTIVE_VEHICLE_CATEGORY_DATA_BY_TYPE,
    FAILED_GET_GET_ACTIVE_VEHICLE_TYPE_DATA_BY_TYPE
} from '../../../constant/master/TransportMasterConstant/MainTransportCategoryConstant';

//Main Transport categories saga
export function* saveMainTransportCategoriesSaga(action) {
    console.log(action.data);
    action.data.path = `${process.env.REACT_APP_TRANSPORT_URL}/allMainCategories`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        console.log(responseData.data.payload);

        yield put({ type: ADD_SUCCESS_MAIN_TRANSPORT_DETAILS_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: ADD_FAILED_MAIN_TRANSPORT_DETAILS_DATA, data: responseData.data });
    }
}

export function* getMainTransportCategoriesByIdSaga(action) {
    console.log('getTaxByIdSaga tax saga');
    console.log(action);

    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_TRANSPORT_URL}/MainTransport/${action.data.id}`);
        console.log(responseData);
        yield put({
            type: SUCCESS_GET_MAIN_TRANSPORT_DETAILS_DATA_BY_ID,
            data: responseData.data
        });
    } catch (e) {
        console.log(e);
        yield put({
            type: FAILED_GET_MAIN_TRANSPORT_DETAILS_DATA_BY_ID,
            data: responseData.data
        });
    }
}

export function* updateMainTransportCategoriesSaga(action) {
    console.log('updateMainTransportSaga tax saga');
    console.log(action);

    action.data.path = `${process.env.REACT_APP_TRANSPORT_URL}/MainTransport/${action.data.mainMainTransport}`;
    let responseData = [];
    try {
        responseData = yield call(update, action.data);
        console.log(responseData);
        yield put({ type: UPDATE_SUCCESS_MAIN_TRANSPORT_DETAILS_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: UPDATE_FAILED_MAIN_TRANSPORT_DETAILS_DATA, data: responseData.data });
    }
}

export function* getAllMainTransportCategoriesSaga() {
    let responseData = [];

    try {
        responseData = yield call(get, process.env.REACT_APP_TRANSPORT_URL + '/MainTransport/');
        console.log(responseData.data.payload);
        yield put({ type: SUCCESS_MAIN_TRANSPORT_DETAILS_LIST_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: FAILED_MAIN_TRANSPORT_DETAILS_LIST_DATA, data: responseData.data });
    }
}

export function* checkDupicateMainTransportCategoriesSaga(action) {
    console.log(action);

    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_TRANSPORT_URL}/sessionCheck/${action.data.taxCode}`);
        console.log(responseData);
        yield put({ type: MAIN_TRANSPORT_DETAILS_DUPLICATE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: MAIN_TRANSPORT_DETAILS_DUPLICATE, data: responseData });
    }
}

export function* getTransportMainCategoryDataByTypeSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_TRANSPORT_URL}/allMainCategories/${action.data.type}`);
        console.log(responseData);
        yield put({ type: SUCCESS_GET_TRANSPORT_MAIN_CATEGORY_DATA_BY_TYPE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: FAILED_GET_TRANSPORT_MAIN_CATEGORY_DATA_BY_TYPE, data: responseData });
    }
}

export function* checkLatestMainTransportCategoriesModifiedDateSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_TRANSPORT_URL}/MainTransport/lastModifiedTime`);
        console.log('response data last:' + responseData);
        yield put({
            type: SUCCESS_LAST_MODIFIED_DATE_MAIN_TRANSPORT_DETAILS,
            data: responseData.data
        });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_LAST_MODIFIED_DATE_MAIN_TRANSPORT_DETAILS, data: '' });
    }
}

export function* getActiveTransportMainCategoryDataByTypeSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_TRANSPORT_URL}/activeMainCategories/${action.data.type}`);
        console.log(responseData);
        yield put({ type: SUCCESS_GET_ACTIVE_TRANSPORT_MAIN_CATEGORY_DATA_BY_TYPE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: FAILED_GET_ACTIVE_TRANSPORT_MAIN_CATEGORY_DATA_BY_TYPE, data: responseData });
    }
}

export function* getActiveVehicleCategoryDataByTypeSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_TRANSPORT_URL}/activeMainCategories/${action.data.type}`);
        console.log(responseData);
        yield put({ type: SUCCESS_GET_ACTIVE_VEHICLE_CATEGORY_DATA_BY_TYPE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: FAILED_GET_GET_ACTIVE_VEHICLE_CATEGORY_DATA_BY_TYPE, data: responseData });
    }
}

export function* getActiveVehicleTypeDataByTypeSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_TRANSPORT_URL}/activeMainCategories/${action.data.type}`);
        console.log(responseData);
        yield put({ type: SUCCESS_GET_ACTIVE_VEHICLE_TYPE_DATA_BY_TYPE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: FAILED_GET_GET_ACTIVE_VEHICLE_TYPE_DATA_BY_TYPE, data: responseData });
    }
}
