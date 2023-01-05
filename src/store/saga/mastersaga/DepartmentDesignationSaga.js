import { put, call } from 'redux-saga/effects';
import { create, getById, update, get, getByIdandType } from '../../../apis/Apis';
import {
    ADD_SUCCESS_DEPARTMENT_DESIGNATION,
    ADD_FAILED_DEPARTMENT_DESIGNATION,
    FAILED_GET_DEPARTMENT_DESIGNATION_BY_ID,
    SUCCESS_GET_DEPARTMENT_DESIGNATION_BY_ID,
    UPDATE_FAILED_DEPARTMENT_DESIGNATION,
    SUCCESS_DEPARTMENT_DESIGNATION_LAST_MODIFIED_DATE,
    FAILED_DEPARTMENT_DESIGNATION_LAST_MODIFIED_DATE,
    UPDATE_SUCCESS_DEPARTMENT_DESIGNATION,
    SUCCESS_DEPARTMENT_DESIGNATION_LIST_DATA,
    FAILED_DEPARTMENT_DESIGNATION_LIST_DATA,
    CHECK_DEPARTMENT_DESIGNATION_CODE_DUPLICATE
} from '../../constant/master/DepartmentDesignationConstant';

export function* saveDepartMentDesignationSaga(action) {
    action.data.path = `${process.env.REACT_APP_USER_MANAGEMENT_URL}/departmentAndDesignation`;
    let responseData = [];
    let imageUploadResponseData = [];
    try {
        responseData = yield call(create, action.data);

        yield put({
            type: ADD_SUCCESS_DEPARTMENT_DESIGNATION,
            data: responseData.data
        });
    } catch (e) {
        yield put({
            type: ADD_FAILED_DEPARTMENT_DESIGNATION,
            data: responseData.data
        });
    }
}

export function* getDepartMentDesignationByIdSaga(action) {
    console.log('getDepartMentDesignationByIdSaga tax saga');
    console.log(action);
    action.data.path = `${process.env.REACT_APP_USER_MANAGEMENT_URL}/departmentDesignation`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        console.log(responseData.data.payload);
        yield put({ type: SUCCESS_GET_DEPARTMENT_DESIGNATION_BY_ID, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: FAILED_GET_DEPARTMENT_DESIGNATION_BY_ID, data: responseData.data });
    }
}

export function* updateDepartMentDesignationSaga(action) {
    console.log('updateDepartMentDesignationSaga tax saga');
    console.log(action);
    action.data.path = `${process.env.REACT_APP_USER_MANAGEMENT_URL}/departmentAndDesignation`;
    let responseData = [];
    try {
        responseData = yield call(update, action.data);
        console.log(responseData.data.payload);
        yield put({
            type: UPDATE_SUCCESS_DEPARTMENT_DESIGNATION,
            data: responseData.data
        });
    } catch (e) {
        console.log(e);
        yield put({ type: UPDATE_FAILED_DEPARTMENT_DESIGNATION, data: responseData.data });
    }
}

export function* getAllDepartMentDesignationDataSaga() {
    let responseData = [];

    try {
        responseData = yield call(get, process.env.REACT_APP_USER_MANAGEMENT_URL + '/departmentsAndDesignations');
        console.log(responseData.data.payload);
        yield put({ type: SUCCESS_DEPARTMENT_DESIGNATION_LIST_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: FAILED_DEPARTMENT_DESIGNATION_LIST_DATA, data: responseData.data });
    }
}

export function* checkDupicateDepartMentDesignationSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_USER_MANAGEMENT_URL}/taxCodeCheck/${action.data.taxCode}`);
        console.log(responseData);
        yield put({ type: CHECK_DEPARTMENT_DESIGNATION_CODE_DUPLICATE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: CHECK_DEPARTMENT_DESIGNATION_CODE_DUPLICATE, data: responseData });
    }
}

export function* checkLatestDepartMentDesignationModifiedDateSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_USER_MANAGEMENT_URL}/lastModifiedTime`);
        console.log('response data last:' + responseData);
        yield put({
            type: SUCCESS_DEPARTMENT_DESIGNATION_LAST_MODIFIED_DATE,
            data: responseData.data
        });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_DEPARTMENT_DESIGNATION_LAST_MODIFIED_DATE, data: '' });
    }
}
