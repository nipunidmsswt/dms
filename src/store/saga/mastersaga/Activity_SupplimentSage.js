import { put, takeEvery, call } from 'redux-saga/effects';
import { create, getById, update, get, createWithUpload } from '../../../apis/Apis';

import {
    ADD_FAILED_ACTIVITY_SUPPLIMENT_DATA,
    ADD_SUCCESS_ACTIVITY_SUPPLIMENT_DATA,
    FAILED_GET_ALL_ACTIVE_ACTIVITY_SUPPLIMENT_DATA,
    FAILED_GET_ALL_ACTIVITY_SUPPLIMENT_DATA,
    FAILED_GET_ACTIVITY_SUPPLIMENT_DETAILS_BY_CODE,
    FAILED_GET_ACTIVITY_SUPPLIMENT_LAST_MODIFIED_DATE_TIME,
    ACTIVITY_SUPPLIMENT_CODE_DUPLICATE,
    SUCCESS_GET_ALL_ACTIVE_ACTIVITY_SUPPLIMENT_DATA,
    SUCCESS_GET_ALL_ACTIVITY_SUPPLIMENT_DATA,
    SUCCESS_GET_ACTIVITY_SUPPLIMENT_DETAILS_BY_CODE,
    SUCCESS_GET_ACTIVITY_SUPPLIMENT_LAST_MODIFIED_DATE_TIME,
    UPDATE_FAILED_ACTIVITY_SUPPLIMENT_DATA,
    UPDATE_SUCCESS_ACTIVITY_SUPPLIMENT_DATA,
    SUCCESS_GET_ALL_ACTIVE_ACT_SUP_MIS_DATA_BY_LOCATION_AND_TYPE,
    FAILED_GET_ALL_ACTIVE_ACT_SUP_MIS_DATA_BY_LOCATION_AND_TYPE
} from '../../constant/master/Activity_SupplimentConstant';

export function* getAllActivity_SupplimentDataSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_TOUR_URL}/activities`);
        console.log(responseData);
        yield put({ type: SUCCESS_GET_ALL_ACTIVITY_SUPPLIMENT_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_ALL_ACTIVITY_SUPPLIMENT_DATA, data: responseData.data });
    }
}

export function* getActivity_SupplimentLatestModifiedDateSaga() {
    console.log('latest date');
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_TOUR_URL}/activities/lastModifiedTime`);
        yield put({
            type: SUCCESS_GET_ACTIVITY_SUPPLIMENT_LAST_MODIFIED_DATE_TIME,
            data: responseData.data
        });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_GET_ACTIVITY_SUPPLIMENT_LAST_MODIFIED_DATE_TIME, data: '' });
    }
}

export function* saveActivity_SupplimentDataHandler(action) {
    console.log('action.data:' + action.data);
    action.data.path = `${process.env.REACT_APP_TOUR_URL}/activities`;
    let responseData = [];
    let responseData2 = [];
    try {
        responseData = yield call(create, action.data);
        if (responseData.data.errorMessages.length === 0) {
            let formData = new FormData();
            console.log(action.data.files);
            if (action.data.files.length !== 0) {
                console.log('in side gdywetwytwu');

                formData.append(`id`, responseData.data.payload[0].id);
                console.log(action.data.files);
                console.log(action.data.files);
                if (action.data.files != undefined) {
                    for (let i = 0; i < action.data.files.length; i++) {
                        formData.append(`files`, action.data.files[i]);
                    }
                }
                const requestOptions = {
                    method: 'POST',
                    body: formData
                };
                requestOptions.path = `${process.env.REACT_APP_TOUR_URL}/activityImg/`;
                responseData2 = yield call(createWithUpload, requestOptions);
                console.log(responseData2);
                if (responseData2.status == 201 || responseData2.status == 200) {
                    console.log('responseData2');
                    yield put({ type: ADD_SUCCESS_ACTIVITY_SUPPLIMENT_DATA, data: responseData.data });
                } else {
                    yield put({ type: ADD_FAILED_ACTIVITY_SUPPLIMENT_DATA, data: 'error' });
                }
            } else {
                yield put({ type: ADD_SUCCESS_ACTIVITY_SUPPLIMENT_DATA, data: responseData.data });
            }
        }
    } catch (e) {
        yield put({ type: ADD_FAILED_ACTIVITY_SUPPLIMENT_DATA, data: responseData.data });
    }
}

export function* getActivity_SupplimentDetailsByCodeSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_TOUR_URL}/activities/${action.data.id}`);
        console.log('response data:' + responseData);
        yield put({ type: SUCCESS_GET_ACTIVITY_SUPPLIMENT_DETAILS_BY_CODE, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_ACTIVITY_SUPPLIMENT_DETAILS_BY_CODE, data: responseData.data });
    }
}

export function* updateActivity_SupplimentDataSaga(action) {
    action.data.path = `${process.env.REACT_APP_TOUR_URL}/activities`;
    let responseData = [];
    let responseData2 = [];
    try {
        responseData = yield call(update, action.data);
        console.log('response data:' + responseData);
        if (responseData.data.errorMessages.length === 0) {
            let formData = new FormData();
            console.log(action.data.files);
            if (action.data.files.length !== 0) {
                console.log('in side gdywetwytwu');

                formData.append(`id`, responseData.data.payload[0].id);
                console.log(action.data.files);
                console.log(action.data.files);
                if (action.data.files != undefined) {
                    for (let i = 0; i < action.data.files.length; i++) {
                        formData.append(`files`, action.data.files[i]);
                    }
                }
                const requestOptions = {
                    method: 'POST',
                    body: formData
                };
                requestOptions.path = `${process.env.REACT_APP_TOUR_URL}/activityImg/`;
                responseData2 = yield call(createWithUpload, requestOptions);
                console.log(responseData2);
                if (responseData2.status == 201 || responseData2.status == 200) {
                    console.log('responseData2');
                    yield put({ type: UPDATE_SUCCESS_ACTIVITY_SUPPLIMENT_DATA, data: responseData.data });
                } else {
                    yield put({ type: UPDATE_FAILED_ACTIVITY_SUPPLIMENT_DATA, data: 'error' });
                }
            } else {
                yield put({ type: UPDATE_SUCCESS_ACTIVITY_SUPPLIMENT_DATA, data: responseData.data });
            }
        }
    } catch (e) {
        console.log(e);
        yield put({ type: UPDATE_FAILED_ACTIVITY_SUPPLIMENT_DATA, data: responseData.data });
    }
}

export function* checkActivity_SupplimentDupicateCodeSaga(action) {
    console.log(`${action.type}`);
    console.log(`${action.data}`);
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_TOUR_URL}/${action.data.code}/${action.data.type}`);

        yield put({ type: ACTIVITY_SUPPLIMENT_CODE_DUPLICATE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: ACTIVITY_SUPPLIMENT_CODE_DUPLICATE, data: responseData });
    }
}

export function* getAllActiveActivity_SupplimentDataSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_TOUR_URL}/Activity_Suppliment/active`);
        yield put({ type: SUCCESS_GET_ALL_ACTIVE_ACTIVITY_SUPPLIMENT_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_ALL_ACTIVE_ACTIVITY_SUPPLIMENT_DATA, data: responseData.data });
    }
}

export function* getActSupMisListByLocationAndTypSaga(action) {
    console.log(action.data);
    action.data.path = `${process.env.REACT_APP_TOUR_URL}/activeActivities`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        console.log(responseData);
        yield put({ type: SUCCESS_GET_ALL_ACTIVE_ACT_SUP_MIS_DATA_BY_LOCATION_AND_TYPE, data: responseData.data });
    } catch (e) {
        console.log('heyyyyyyyyyyyyyyyyyyyyy bnbnbn');
        yield put({ type: FAILED_GET_ALL_ACTIVE_ACT_SUP_MIS_DATA_BY_LOCATION_AND_TYPE, data: responseData });
    }
}
