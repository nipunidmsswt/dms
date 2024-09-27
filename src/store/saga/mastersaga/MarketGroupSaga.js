import { put, takeEvery, call } from 'redux-saga/effects';
import { create, getById, update, get } from '../../../apis/Apis';
import {
    ADD_FAILED_MARKET_GROUP_DATA,
    ADD_SUCCESS_MARKET_GROUP_DATA,
    FAILED_GET_ALL_ACTIVE_MARKET_GROUP_DATA,
    FAILED_GET_ALL_MARKET_GROUP_DATA,
    FAILED_GET_MARKET_GROUP_DETAILS_BY_CODE,
    FAILED_GET_MARKET_GROUP_LAST_MODIFIED_DATE_TIME,
    MARKET_GROUP_CODE_DUPLICATE,
    SUCCESS_GET_ALL_ACTIVE_MARKET_GROUP_DATA,
    SUCCESS_GET_ALL_MARKET_GROUP_DATA,
    SUCCESS_GET_MARKET_GROUP_DETAILS_BY_CODE,
    SUCCESS_GET_MARKET_GROUP_LAST_MODIFIED_DATE_TIME,
    UPDATE_FAILED_MARKET_GROUP_DATA,
    UPDATE_SUCCESS_MARKET_GROUP_DATA,
    SUCCESS_GET_ALL_ACTIVE_OPERATOR_GROUP_DATA,
    FAILED_GET_ALL_ACTIVE_OPERATOR_GROUP_DATA,
    SUCCESS_GET_ALL_ACTIVE_OPERATOR_LIST_BY_OPERATOR_GROUP,
    FAILED_GET_ALL_ACTIVE_OPERATOR_LIST_BY_OPERATOR_GROUP
} from '../../constant/master/MarketGroupConstant';

export function* getAllMarketGroupDataSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_OPERATOR_URL}/marketGroup/`);
        console.log('res:' + responseData);
        yield put({ type: SUCCESS_GET_ALL_MARKET_GROUP_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_ALL_MARKET_GROUP_DATA, data: responseData.data });
    }
}

export function* getMarketGroupLatestModifiedDateSaga() {
    console.log('latest date');
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_OPERATOR_URL}/marketGroup/lastModifiedTime`);
        yield put({
            type: SUCCESS_GET_MARKET_GROUP_LAST_MODIFIED_DATE_TIME,
            data: responseData.data
        });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_GET_MARKET_GROUP_LAST_MODIFIED_DATE_TIME, data: '' });
    }
}

export function* saveMarketGroupDataHandler(action) {
    console.log('action.data:' + action.data);
    action.data.path = `${process.env.REACT_APP_OPERATOR_URL}/marketGroup/`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        yield put({ type: ADD_SUCCESS_MARKET_GROUP_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: ADD_FAILED_MARKET_GROUP_DATA, data: responseData.data });
    }
}

export function* getMarketGroupDetailsByCodeSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_OPERATOR_URL}/marketGroup/${action.data.id}`);
        console.log('response data:' + responseData);
        yield put({ type: SUCCESS_GET_MARKET_GROUP_DETAILS_BY_CODE, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_MARKET_GROUP_DETAILS_BY_CODE, data: responseData.data });
    }
}

export function* updateMarketGroupDataSaga(action) {
    action.data.path = `${process.env.REACT_APP_OPERATOR_URL}/marketGroup/${action.data.code}`;
    let responseData = [];
    try {
        responseData = yield call(update, action.data);
        console.log('response data:' + responseData);
        yield put({ type: UPDATE_SUCCESS_MARKET_GROUP_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: UPDATE_FAILED_MARKET_GROUP_DATA, data: responseData.data });
    }
}

export function* checkMarketGroupDupicateCodeSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_OPERATOR_URL}/marketGroup/codeDuplicate/${action.data}`);
        console.log(responseData);
        yield put({ type: MARKET_GROUP_CODE_DUPLICATE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: MARKET_GROUP_CODE_DUPLICATE, data: responseData });
    }
}

export function* getAllActiveMarketDataSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_OPERATOR_URL}/market/active`);
        yield put({ type: SUCCESS_GET_ALL_ACTIVE_MARKET_GROUP_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_ALL_ACTIVE_MARKET_GROUP_DATA, data: responseData.data });
    }
}

export function* getAllActiveOperatorGroupDataSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_OPERATOR_URL}/marketGroup/activeOperatorGroups`);
        console.log(responseData);
        yield put({ type: SUCCESS_GET_ALL_ACTIVE_OPERATOR_GROUP_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_ALL_ACTIVE_OPERATOR_GROUP_DATA, data: responseData.data });
    }
}

export function* getAllActiveOperatorListByOperatorGroup(action) {
    console.log(action.id);
    let responseData = [];
    console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
    try {
        responseData = yield call(get, `${process.env.REACT_APP_OPERATOR_URL}/marketGroup/activeOperatorCode/${action.id}`);
        console.log(responseData);
        yield put({ type: SUCCESS_GET_ALL_ACTIVE_OPERATOR_LIST_BY_OPERATOR_GROUP, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_ALL_ACTIVE_OPERATOR_LIST_BY_OPERATOR_GROUP, data: responseData.data });
    }
}
