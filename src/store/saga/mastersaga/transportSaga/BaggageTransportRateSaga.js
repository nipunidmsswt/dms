import { put, call } from 'redux-saga/effects';
import { create, get, getById, update } from 'apis/Apis';
import {
    ADD_SUCCESS_BAGGAGE_TRANSPORT_RATE,
    ADD_FAILED_BAGGAGE_TRANSPORT_RATE,
    UPDATE_SUCCESS_BAGGAGE_TRANSPORT_RATE,
    UPDATE_FAILED_BAGGAGE_TRANSPORT_RATE,
    SUCCESS_BAGGAGE_TRANSPORT_RATE_LIST_DATA,
    FAILED_BAGGAGE_TRANSPORT_RATE_LIST_DATA,
    SUCCESS_GET_BAGGAGE_TRANSPORT_RATE_BY_ID,
    FAILED_GET_BAGGAGE_TRANSPORT_RATE_BY_ID,
    BAGGAGE_TRANSPORT_RATE_CODE_DUPLICATE,
    SUCCESS_BAGGAGE_TRANSPORT_RATE_LAST_MODIFIED_DATE,
    FAILED_BAGGAGE_TRANSPORT_RATE_LAST_MODIFIED_DATE,
    SUCCESS_CLEAR_BAGGAGE_TRANSPORT_RATE
} from 'store/constant/master/TransportMasterConstant/BaggageTransportRateConstant';

//BaggageTransportRate saga

export function* saveBaggageTransportRateSaga(action) {
    action.data.path = `${process.env.REACT_APP_TRANSPORT_URL}/baggageTransportRates`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        console.log(responseData.data.payload);

        yield put({ type: ADD_SUCCESS_BAGGAGE_TRANSPORT_RATE, data: responseData.data });
    } catch (e) {
        yield put({ type: ADD_FAILED_BAGGAGE_TRANSPORT_RATE, data: responseData.data });
    }
}

export function* getBaggageTransportRateByIdSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_TRANSPORT_URL}/baggageTransportRate/${action.data.id}`);
        console.log(responseData);
        yield put({
            type: SUCCESS_GET_BAGGAGE_TRANSPORT_RATE_BY_ID,
            data: responseData.data
        });
    } catch (e) {
        console.log(e);
        yield put({
            type: FAILED_GET_BAGGAGE_TRANSPORT_RATE_BY_ID,
            data: responseData.data
        });
    }
}

export function* updateBaggageTransportRateSaga(action) {
    console.log('updateBaggageTransportRateSaga tax saga');
    console.log(action);

    action.data.path = `${process.env.REACT_APP_TRANSPORT_URL}/baggageTransportRates`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        console.log(responseData);
        yield put({ type: UPDATE_SUCCESS_BAGGAGE_TRANSPORT_RATE, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: UPDATE_FAILED_BAGGAGE_TRANSPORT_RATE, data: responseData.data });
    }
}

export function* getAllBaggageTransportRateSaga() {
    let responseData = [];

    try {
        responseData = yield call(get, process.env.REACT_APP_TRANSPORT_URL + '/baggageTransportRates');
        console.log(responseData.data.payload);
        yield put({ type: SUCCESS_BAGGAGE_TRANSPORT_RATE_LIST_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: FAILED_BAGGAGE_TRANSPORT_RATE_LIST_DATA, data: responseData.data });
    }
}

export function* checkDupicateBaggageTransportRateSaga(action) {
    console.log(action);
    action.data.data.path = `${process.env.REACT_APP_TRANSPORT_URL}/checkBaggageTransportRate`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data.data);
        console.log(responseData);
        yield put({ type: BAGGAGE_TRANSPORT_RATE_CODE_DUPLICATE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: BAGGAGE_TRANSPORT_RATE_CODE_DUPLICATE, data: responseData });
    }
}

export function* checkLatestBaggageTransportRateModifiedDateSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_TRANSPORT_URL}/roomBuyingRates/lastModified`);
        console.log('response data last:' + responseData);
        yield put({
            type: SUCCESS_BAGGAGE_TRANSPORT_RATE_LAST_MODIFIED_DATE,
            data: responseData.data
        });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_BAGGAGE_TRANSPORT_RATE_LAST_MODIFIED_DATE, data: '' });
    }
}

export function* clearBaggageTransportRateSaga() {
    yield put({ type: SUCCESS_CLEAR_BAGGAGE_TRANSPORT_RATE, data: null });
}
