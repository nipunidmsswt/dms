import { put, call } from 'redux-saga/effects';
import { create, get, getById, update } from 'apis/Apis';
import {
    ADD_SUCCESS_DISTANCE_DATA,
    ADD_FAILED_DISTANCE_DATA,
    SUCCESS_GET_DISTANCE_DATA_BY_ID,
    FAILED_GET_DISTANCE_DATA_BY_ID,
    SUCCESS_DISTANCE_LIST_DATA,
    FAILED_DISTANCE_LIST_DATA,
    UPDATE_FAILED_DISTANCE_DATA,
    UPDATE_SUCCESS_DISTANCE_DATA,
    DISTANCE_CODE_DUPLICATE,
    FAILED_LAST_MODIFIED_DATE_DISTANCE,
    SUCCESS_LAST_MODIFIED_DATE_DISTANCE,
    SUCCESS_GET_ALL_ACTIVE_DISTANCE_DATA_TBY_TRANSPORT_TYPE,
    FAILED_GET_ALL_ACTIVE_DISTANCE_DATA_TBY_TRANSPORT_TYPE,
    SUCCESS_GET_CALCULATED_DISTANCE_AND_DURATION,
    FAILED_GET_CALCULATED_DISTANCE_AND_DURATION
} from '../../../constant/master/TransportMasterConstant/DistanceConstant';

//DISTANCE saga
export function* saveDistanceSaga(action) {
    console.log(action.data);
    action.data.path = `${process.env.REACT_APP_TRANSPORT_URL}/distancesDetails`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        console.log(responseData.data.payload);

        yield put({ type: ADD_SUCCESS_DISTANCE_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: ADD_FAILED_DISTANCE_DATA, data: responseData.data });
    }
}

export function* getDistanceByIdSaga(action) {
    console.log('getTaxByIdSaga tax saga');
    console.log(action);

    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_TRANSPORT_URL}/MainTransport/${action.data.id}`);
        console.log(responseData);
        yield put({
            type: SUCCESS_GET_DISTANCE_DATA_BY_ID,
            data: responseData.data
        });
    } catch (e) {
        console.log(e);
        yield put({
            type: FAILED_GET_DISTANCE_DATA_BY_ID,
            data: responseData.data
        });
    }
}

export function* updateDistanceSaga(action) {
    console.log('updateMainTransportSaga tax saga');
    console.log(action);

    action.data.path = `${process.env.REACT_APP_TRANSPORT_URL}/MainTransport/${action.data.mainMainTransport}`;
    let responseData = [];
    try {
        responseData = yield call(update, action.data);
        console.log(responseData);
        yield put({ type: UPDATE_SUCCESS_DISTANCE_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: UPDATE_FAILED_DISTANCE_DATA, data: responseData.data });
    }
}

export function* getAllDistanceSaga() {
    let responseData = [];

    try {
        responseData = yield call(get, process.env.REACT_APP_TRANSPORT_URL + '/MainTransport/');
        console.log(responseData.data.payload);
        yield put({ type: SUCCESS_DISTANCE_LIST_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: FAILED_DISTANCE_LIST_DATA, data: responseData.data });
    }
}

export function* checkDupicateDistanceSaga(action) {
    console.log(action);

    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_TRANSPORT_URL}/sessionCheck/${action.data.taxCode}`);
        console.log(responseData);
        yield put({ type: DISTANCE_CODE_DUPLICATE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: DISTANCE_CODE_DUPLICATE, data: responseData });
    }
}

export function* getAllActiveDistanceDataByTransportTypeSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_TRANSPORT_URL}/distances/${action.data.id}`);
        console.log(responseData);
        yield put({ type: SUCCESS_GET_ALL_ACTIVE_DISTANCE_DATA_TBY_TRANSPORT_TYPE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: FAILED_GET_ALL_ACTIVE_DISTANCE_DATA_TBY_TRANSPORT_TYPE, data: responseData });
    }
}

export function* checkLatestDistanceModifiedDateSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_TRANSPORT_URL}/MainTransport/lastModifiedTime`);
        console.log('response data last:' + responseData);
        yield put({
            type: SUCCESS_LAST_MODIFIED_DATE_DISTANCE,
            data: responseData.data
        });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_LAST_MODIFIED_DATE_DISTANCE, data: '' });
    }
}

export function* getDistanceAndDurationSaga(action) {
    console.log('getDistanceAndDuration Saga');
    console.log(action);

    const { transportTypeId, locationIds } = action.data;

    let responseData = [];
    try {
        const requestBody = JSON.stringify({ locationIds });
        responseData = yield call(create, `${process.env.REACT_APP_TRANSPORT_URL}/calculateDistances/${transportTypeId}`, requestBody);
        console.log(responseData);
        console.log('response data check');
        yield put({
            type: SUCCESS_GET_CALCULATED_DISTANCE_AND_DURATION,
            data: responseData.data
        });
    } catch (e) {
        console.log(e);
        yield put({
            type: FAILED_GET_CALCULATED_DISTANCE_AND_DURATION,
            data: responseData.data
        });
    }
}
