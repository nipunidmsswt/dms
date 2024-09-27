import { put, call } from 'redux-saga/effects';
import { create, get, getById, update } from 'apis/Apis';
import {
    ADD_SUCCESS_PAX_VEHICLE_RATE,
    ADD_FAILED_PAX_VEHICLE_RATE,
    UPDATE_SUCCESS_PAX_VEHICLE_RATE,
    UPDATE_FAILED_PAX_VEHICLE_RATE,
    SUCCESS_PAX_VEHICLE_RATE_LIST_DATA,
    FAILED_PAX_VEHICLE_RATE_LIST_DATA,
    SUCCESS_GET_PAX_VEHICLE_RATE_BY_ID,
    FAILED_GET_PAX_VEHICLE_RATE_BY_ID,
    PAX_VEHICLE_RATE_CODE_DUPLICATE,
    SUCCESS_PAX_VEHICLE_RATE_LAST_MODIFIED_DATE,
    FAILED_PAX_VEHICLE_RATE_LAST_MODIFIED_DATE,
    SUCCESS_CLEAR_PAX_VEHICLE_RATE
} from 'store/constant/master/TransportMasterConstant/PaxVehicleRateConstant';

//PaxVehicleRate saga

export function* savePaxVehicleRateSaga(action) {
    action.data.path = `${process.env.REACT_APP_TRANSPORT_URL}/paxVehicleRates`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        console.log(responseData.data.payload);

        yield put({ type: ADD_SUCCESS_PAX_VEHICLE_RATE, data: responseData.data });
    } catch (e) {
        yield put({ type: ADD_FAILED_PAX_VEHICLE_RATE, data: responseData.data });
    }
}

export function* getPaxVehicleRateByIdSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_TRANSPORT_URL}/paxVehicleRates/${action.data.id}`);
        console.log(responseData);
        yield put({
            type: SUCCESS_GET_PAX_VEHICLE_RATE_BY_ID,
            data: responseData.data
        });
    } catch (e) {
        console.log(e);
        yield put({
            type: FAILED_GET_PAX_VEHICLE_RATE_BY_ID,
            data: responseData.data
        });
    }
}

export function* updatePaxVehicleRateSaga(action) {
    console.log('updatePaxVehicleRateSaga tax saga');
    console.log(action);

    action.data.path = `${process.env.REACT_APP_TRANSPORT_URL}/paxVehicleRates`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        console.log(responseData);
        yield put({ type: UPDATE_SUCCESS_PAX_VEHICLE_RATE, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: UPDATE_FAILED_PAX_VEHICLE_RATE, data: responseData.data });
    }
}

export function* getAllPaxVehicleRateSaga() {
    let responseData = [];

    try {
        responseData = yield call(get, process.env.REACT_APP_TRANSPORT_URL + '/roomBuyingRates');
        console.log(responseData.data.payload);
        yield put({ type: SUCCESS_PAX_VEHICLE_RATE_LIST_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: FAILED_PAX_VEHICLE_RATE_LIST_DATA, data: responseData.data });
    }
}

export function* checkDupicatePaxVehicleRateSaga(action) {
    console.log(action);
    action.data.data.path = `${process.env.REACT_APP_TRANSPORT_URL}/checkPaxVehicleRate`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data.data);
        console.log(responseData);
        yield put({ type: PAX_VEHICLE_RATE_CODE_DUPLICATE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: PAX_VEHICLE_RATE_CODE_DUPLICATE, data: responseData });
    }
}

export function* checkLatestPaxVehicleRateModifiedDateSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_TRANSPORT_URL}/roomBuyingRates/lastModified`);
        console.log('response data last:' + responseData);
        yield put({
            type: SUCCESS_PAX_VEHICLE_RATE_LAST_MODIFIED_DATE,
            data: responseData.data
        });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_PAX_VEHICLE_RATE_LAST_MODIFIED_DATE, data: '' });
    }
}

export function* clearPaxVehicleRateSaga() {
    yield put({ type: SUCCESS_CLEAR_PAX_VEHICLE_RATE, data: null });
}
