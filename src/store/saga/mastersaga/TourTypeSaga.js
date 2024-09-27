import { put, takeEvery, call } from 'redux-saga/effects';
import { create, get, getById, update } from 'apis/Apis';

import {
    ADD_FAILED_TOURTYPE_DATA,
    ADD_SUCCESS_TOURTYPE_DATA,
    FAILED_GET_TOURTYPE_DATA_BY_ID,
    FAILED_TOURTYPE_LAST_MODIFIED_DATE,
    FAILED_TOURTYPE_LIST_DATA,
    TOURTYPE_CODE_DUPLICATE,
    SUCCESS_GET_TOURTYPE_DATA_BY_ID,
    SUCCESS_TOURTYPE_LAST_MODIFIED_DATE,
    SUCCESS_TOURTYPE_LIST_DATA,
    UPDATE_FAILED_TOURTYPE_DATA,
    UPDATE_SUCCESS_TOURTYPE_DATA,
    SUCCESS_ACTIVE_TOURTYPE_LIST_DATA,
    FAILED_ACTIVE_TOURTYPE_LIST_DATA
} from 'store/constant/master/TourTypeConstant';

export function* saveTourType(action) {
    action.data.path = `${process.env.REACT_APP_TOUR_URL}/tourType/`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        yield put({ type: ADD_SUCCESS_TOURTYPE_DATA, data: responseData.data });
    } catch (e) {
        console.log('e:' + e);
        yield put({ type: ADD_FAILED_TOURTYPE_DATA, data: responseData.data });
    }
}

export function* getAllTourTypeSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_TOUR_URL}/tourType/`);
        yield put({ type: SUCCESS_TOURTYPE_LIST_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: FAILED_TOURTYPE_LIST_DATA, data: responseData.data });
    }
}

export function* getTourTypeByIdSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_TOUR_URL}/tourType/${action.data.id}`);
        console.log('response data:' + responseData);
        yield put({ type: SUCCESS_GET_TOURTYPE_DATA_BY_ID, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_TOURTYPE_DATA_BY_ID, data: responseData.data });
    }
}

export function* updateTourTypeSaga(action) {
    action.data.path = `${process.env.REACT_APP_TOUR_URL}/tourType/${action.data.code}`;
    let responseData = [];
    try {
        responseData = yield call(update, action.data);

        yield put({ type: UPDATE_SUCCESS_TOURTYPE_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: UPDATE_FAILED_TOURTYPE_DATA, data: responseData.data });
    }
}

export function* checkTourTypeLatestModifiedDateSaga() {
    console.log('latest date');
    let responseData = [];
    // action.data.path = `/product`;
    try {
        responseData = yield call(get, `${process.env.REACT_APP_TOUR_URL}/tourType/lastModifiedTime`);
        yield put({ type: SUCCESS_TOURTYPE_LAST_MODIFIED_DATE, data: responseData.data });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_TOURTYPE_LAST_MODIFIED_DATE, data: '' });
    }
}

export function* checkDupicateTourTypeCodeSaga(action) {
    console.log('checkDupicateTourTypeCodeSaga:' + action);
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_TOUR_URL}/tourType/codeDuplicate/${action.data.code}`);
        console.log('response data:' + responseData);
        yield put({ type: TOURTYPE_CODE_DUPLICATE, data: responseData.data.errorMessages });
    } catch (e) {
        console.log(responseData);
        yield put({ type: TOURTYPE_CODE_DUPLICATE, data: responseData.data.errorMessages });
    }
}

export function* getActiveTourTypes() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_TOUR_URL}/tourType/active`);
        console.log('response data:' + responseData);
        yield put({ type: SUCCESS_ACTIVE_TOURTYPE_LIST_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_ACTIVE_TOURTYPE_LIST_DATA, data: responseData.data });
    }
}
