import { put, takeEvery, call } from 'redux-saga/effects';
import { create, getById, update, get } from '../../../apis/Apis';
import { SUCCESS_GET_ALL_ACTIVE_MANAGER_DATA } from '../../constant/master/ManagerConstant';
import {
    ADD_FAILED_MARKET_DATA,
    ADD_SUCCESS_MARKET_DATA,
    FAILED_GET_ALL_ACTIVE_MARKET_DATA,
    FAILED_GET_ALL_MARKET_DATA,
    FAILED_GET_MARKET_DETAILS_BY_CODE,
    FAILED_GET_MARKET_LAST_MODIFIED_DATE_TIME,
    MARKET_CODE_DUPLICATE,
    SUCCESS_GET_ALL_ACTIVE_MARKET_DATA,
    SUCCESS_GET_ALL_MARKET_DATA,
    SUCCESS_GET_MARKET_DETAILS_BY_CODE,
    SUCCESS_GET_MARKET_LAST_MODIFIED_DATE_TIME,
    UPDATE_FAILED_MARKET_DATA,
    UPDATE_SUCCESS_MARKET_DATA
} from '../../constant/master/MarketConstant';

export function* getAllMarketDataSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_OPERATOR_URL}/market/`);
        yield put({ type: SUCCESS_GET_ALL_MARKET_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_ALL_MARKET_DATA, data: responseData.data });
    }
}

export function* getMarketLatestModifiedDateSaga() {
    console.log('latest date');
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_OPERATOR_URL}/market/lastModifiedTime`);
        yield put({
            type: SUCCESS_GET_MARKET_LAST_MODIFIED_DATE_TIME,
            data: responseData.data
        });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_GET_MARKET_LAST_MODIFIED_DATE_TIME, data: '' });
    }
}

export function* saveMarketDataHandler(action) {
    console.log('action.data:' + action.data);
    action.data.path = `${process.env.REACT_APP_OPERATOR_URL}/market/`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        yield put({ type: ADD_SUCCESS_MARKET_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: ADD_FAILED_MARKET_DATA, data: responseData.data });
    }
}

export function* getMarketDetailsByCodeSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_OPERATOR_URL}/market/${action.data.id}`);
        console.log('response data:' + responseData);
        yield put({ type: SUCCESS_GET_MARKET_DETAILS_BY_CODE, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_MARKET_DETAILS_BY_CODE, data: responseData.data });
    }
}

export function* updateMarketDataSaga(action) {
    action.data.path = `${process.env.REACT_APP_OPERATOR_URL}/market/${action.data.code}`;
    let responseData = [];
    try {
        responseData = yield call(update, action.data);
        console.log('response data:' + responseData);
        yield put({ type: UPDATE_SUCCESS_MARKET_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: UPDATE_FAILED_MARKET_DATA, data: responseData.data });
    }
}

export function* checkMarketDupicateCodeSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_OPERATOR_URL}/market/codeDuplicate/${action.data}`);
        console.log(responseData);
        yield put({ type: MARKET_CODE_DUPLICATE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: MARKET_CODE_DUPLICATE, data: responseData });
    }
}

export function* getAllActiveMarketDataSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_OPERATOR_URL}/codeAndName/markets`);
        yield put({ type: SUCCESS_GET_ALL_ACTIVE_MARKET_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_ALL_ACTIVE_MARKET_DATA, data: responseData.data });
    }
}
