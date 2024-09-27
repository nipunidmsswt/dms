import { put, takeEvery, call } from 'redux-saga/effects';
import { create, getById, update, get } from '../../../apis/Apis';

import {
    ADD_FAILED_GUIDE_CLASS_DATA,
    ADD_SUCCESS_GUIDE_CLASS_DATA,
    FAILED_GET_ALL_ACTIVE_GUIDE_CLASS_DATA,
    FAILED_GET_ALL_GUIDE_CLASS_DATA,
    FAILED_GET_GUIDE_CLASS_DETAILS_BY_CODE,
    FAILED_GET_GUIDE_CLASS_LAST_MODIFIED_DATE_TIME,
    GUIDE_CLASS_CODE_DUPLICATE,
    SUCCESS_GET_ALL_ACTIVE_GUIDE_CLASS_DATA,
    SUCCESS_GET_ALL_GUIDE_CLASS_DATA,
    SUCCESS_GET_GUIDE_CLASS_DETAILS_BY_CODE,
    SUCCESS_GET_GUIDE_CLASS_LAST_MODIFIED_DATE_TIME,
    UPDATE_FAILED_GUIDE_CLASS_DATA,
    UPDATE_SUCCESS_GUIDE_CLASS_DATA
} from '../../constant/master/GuideClassConstant';

export function* getAllGuideClassDataSaga() {
    console.log('guide class');
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_TOUR_URL}/guideClass/`);
        console.log(responseData);
        yield put({ type: SUCCESS_GET_ALL_GUIDE_CLASS_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_ALL_GUIDE_CLASS_DATA, data: responseData.data });
    }
}

export function* getGuideClassLatestModifiedDateSaga() {
    console.log('latest date');
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_TOUR_URL}/guideClass/lastModifiedTime`);
        yield put({
            type: SUCCESS_GET_GUIDE_CLASS_LAST_MODIFIED_DATE_TIME,
            data: responseData.data
        });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_GET_GUIDE_CLASS_LAST_MODIFIED_DATE_TIME, data: '' });
    }
}

export function* saveGuideClassDataHandler(action) {
    console.log('action.data:' + action.data);
    action.data.path = `${process.env.REACT_APP_TOUR_URL}/guideClass/`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        yield put({ type: ADD_SUCCESS_GUIDE_CLASS_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: ADD_FAILED_GUIDE_CLASS_DATA, data: responseData.data });
    }
}

export function* getGuideClassDetailsByCodeSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_TOUR_URL}/guideClass/${action.data.id}`);
        console.log('response data:' + responseData);
        yield put({ type: SUCCESS_GET_GUIDE_CLASS_DETAILS_BY_CODE, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_GUIDE_CLASS_DETAILS_BY_CODE, data: responseData.data });
    }
}

export function* updateGuideClassDataSaga(action) {
    action.data.path = `${process.env.REACT_APP_TOUR_URL}/guideClass/${action.data.guideCode}`;
    let responseData = [];
    try {
        responseData = yield call(update, action.data);
        console.log('response data:' + responseData);
        yield put({ type: UPDATE_SUCCESS_GUIDE_CLASS_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: UPDATE_FAILED_GUIDE_CLASS_DATA, data: responseData.data });
    }
}

export function* checkGuideClassDupicateCodeSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_TOUR_URL}/guideClass/codeDuplicate/${action.data}`);
        console.log(responseData);
        yield put({ type: GUIDE_CLASS_CODE_DUPLICATE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: GUIDE_CLASS_CODE_DUPLICATE, data: responseData });
    }
}

export function* getAllActiveGuideClassDataSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_TOUR_URL}/guideClass/activeGuideClass`);
        yield put({ type: SUCCESS_GET_ALL_ACTIVE_GUIDE_CLASS_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_ALL_ACTIVE_GUIDE_CLASS_DATA, data: responseData.data });
    }
}
