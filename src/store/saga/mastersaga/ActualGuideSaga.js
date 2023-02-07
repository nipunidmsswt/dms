import { put, takeEvery, call } from 'redux-saga/effects';
import { create, getById, update, get } from '../../../apis/Apis';

import {
    ADD_FAILED_ACTUAL_GUIDE_DATA,
    ADD_SUCCESS_ACTUAL_GUIDE_DATA,
    FAILED_GET_ALL_ACTIVE_ACTUAL_GUIDE_DATA,
    FAILED_GET_ALL_ACTUAL_GUIDE_DATA,
    FAILED_GET_ACTUAL_GUIDE_DETAILS_BY_ID,
    FAILED_GET_ACTUAL_GUIDE_LAST_MODIFIED_DATE_TIME,
    ACTUAL_GUIDE_CODE_DUPLICATE,
    SUCCESS_GET_ALL_ACTIVE_ACTUAL_GUIDE_DATA,
    SUCCESS_GET_ALL_ACTUAL_GUIDE_DATA,
    SUCCESS_GET_ACTUAL_GUIDE_DETAILS_BY_ID,
    SUCCESS_GET_ACTUAL_GUIDE_LAST_MODIFIED_DATE_TIME,
    UPDATE_FAILED_ACTUAL_GUIDE_DATA,
    UPDATE_SUCCESS_ACTUAL_GUIDE_DATA
} from '../../constant/master/ActualGuideConstant';

export function* getAllActualGuideDataSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_TOUR_URL}/ActualGuide/`);
        console.log(responseData);
        yield put({ type: SUCCESS_GET_ALL_ACTUAL_GUIDE_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_ALL_ACTUAL_GUIDE_DATA, data: responseData.data });
    }
}

export function* saveActualGuideDataHandler(action) {
    console.log('action.data:' + action.data);
    action.data.path = `${process.env.REACT_APP_TOUR_URL}/ActualGuide/`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        yield put({ type: ADD_SUCCESS_ACTUAL_GUIDE_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: ADD_FAILED_ACTUAL_GUIDE_DATA, data: responseData.data });
    }
}

export function* getActualGuideDetailsByIdeSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_TOUR_URL}/ActualGuide/${action.data.id}`);
        console.log('response data:' + responseData);
        yield put({ type: SUCCESS_GET_ACTUAL_GUIDE_DETAILS_BY_ID, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_ACTUAL_GUIDE_DETAILS_BY_ID, data: responseData.data });
    }
}

export function* updateActualGuideDataSaga(action) {
    action.data.path = `${process.env.REACT_APP_TOUR_URL}/ActualGuide/${action.data.id}`;
    let responseData = [];
    try {
        responseData = yield call(update, action.data);
        console.log('response data:' + responseData);
        yield put({ type: UPDATE_SUCCESS_ACTUAL_GUIDE_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: UPDATE_FAILED_ACTUAL_GUIDE_DATA, data: responseData.data });
    }
}

export function* checkActualGuideDupicateCodeSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_TOUR_URL}/ActualGuide/codeDuplicate/${action.data}`);
        console.log(responseData);
        yield put({ type: ACTUAL_GUIDE_CODE_DUPLICATE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: ACTUAL_GUIDE_CODE_DUPLICATE, data: responseData });
    }
}

export function* getAllActiveActualGuideDataSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_TOUR_URL}/ActualGuide/active`);
        yield put({ type: SUCCESS_GET_ALL_ACTIVE_ACTUAL_GUIDE_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_ALL_ACTIVE_ACTUAL_GUIDE_DATA, data: responseData.data });
    }
}

export function* getActualGuideLatestModifiedDateSaga() {
    console.log('latest date');
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_TOUR_URL}/ActualGuide/lastModifiedTime`);
        yield put({
            type: SUCCESS_GET_ACTUAL_GUIDE_LAST_MODIFIED_DATE_TIME,
            data: responseData.data
        });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_GET_ACTUAL_GUIDE_LAST_MODIFIED_DATE_TIME, data: '' });
    }
}
