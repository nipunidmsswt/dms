import { put, call } from 'redux-saga/effects';
import { create, getById, update, get } from '../../../apis/Apis';
import {
    ADD_SUCCESS_MANAGING_COMAPANY_DATA,
    ADD_FAILED_MANAGING_COMAPANY_DATA,
    SUCCESS_MANAGING_COMAPANY_LIST_DATA,
    FAILED_MANAGING_COMAPANY_LIST_DATA,
    SUCCESS_GET_MANAGING_COMAPANY_DATA_BY_ID,
    FAILED_GET_MANAGING_COMAPANY_DATA_BY_ID,
    UPDATE_SUCCESS_MANAGING_COMAPANY_DATA,
    UPDATE_FAILED_MANAGING_COMAPANY_DATA,
    MANAGING_COMAPANY_DUPLICATE,
    SUCCESS_LAST_MODIFIED_DATE_MANAGING_COMAPANY,
    FAILED_LAST_MODIFIED_DATE_MANAGING_COMAPANY,
    SUCCESS_MANAGING_COMAPANY_ACTIVE_LIST_DATA,
    FAILED_MANAGING_COMAPANY_ACTIVE_LIST_DATA
} from '../../constant/master/ManagingCompanyConstant';

export function* saveManagingCompanySaga(action) {
    action.data.path = `${process.env.REACT_APP_ACCOMODATION_URL}/managingCompany/`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        console.log(responseData.data.payload);

        yield put({ type: ADD_SUCCESS_MANAGING_COMAPANY_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: ADD_FAILED_MANAGING_COMAPANY_DATA, data: responseData.data });
    }
}

export function* getAllManagingCompanySaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_ACCOMODATION_URL}/managingCompany/`);
        console.log(responseData.data.payload);

        yield put({ type: SUCCESS_MANAGING_COMAPANY_LIST_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_MANAGING_COMAPANY_LIST_DATA, data: responseData.data });
    }
}

export function* getAllActiveManagingCompanySaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_ACCOMODATION_URL}/managingCompany/active/`);
        console.log(responseData.data.payload);

        yield put({ type: SUCCESS_MANAGING_COMAPANY_ACTIVE_LIST_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_MANAGING_COMAPANY_ACTIVE_LIST_DATA, data: responseData.data });
    }
}

export function* getManagingCompanyByIdSaga(action) {
    console.log('getTaxByIdSaga tax saga');
    console.log(action);

    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_ACCOMODATION_URL}/managingCompany/${action.data.id}`);
        console.log(responseData.data.payload);
        yield put({ type: SUCCESS_GET_MANAGING_COMAPANY_DATA_BY_ID, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: FAILED_GET_MANAGING_COMAPANY_DATA_BY_ID, data: responseData.data });
    }
}

export function* updateManagingCompanySaga(action) {
    console.log('update Tax groupSaga tax saga');
    console.log(action);
    action.data.path = `${process.env.REACT_APP_ACCOMODATION_URL}/managingCompany/${action.data.code}`;
    let responseData = [];
    try {
        responseData = yield call(update, action.data);
        console.log(responseData.data.payload);
        yield put({ type: UPDATE_SUCCESS_MANAGING_COMAPANY_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: UPDATE_FAILED_MANAGING_COMAPANY_DATA, data: responseData.data });
    }
}

export function* checkDupicateManagingCompanyCodeSaga(action) {
    console.log('checkDupicateTaxGroupCodeSaga tax saga');
    console.log(action);

    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_ACCOMODATION_URL}/managingCompany/codeDuplicate/${action.data}`);
        console.log(responseData);
        yield put({ type: MANAGING_COMAPANY_DUPLICATE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: MANAGING_COMAPANY_DUPLICATE, data: responseData });
    }
}

export function* checkLatestManagingCompanyModifiedDateSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_ACCOMODATION_URL}/managingCompany/lastModifiedTime`);
        console.log('response data last:' + responseData);
        yield put({ type: SUCCESS_LAST_MODIFIED_DATE_MANAGING_COMAPANY, data: responseData.data });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_LAST_MODIFIED_DATE_MANAGING_COMAPANY, data: '' });
    }
}
