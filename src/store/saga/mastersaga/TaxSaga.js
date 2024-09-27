import { create, get, getById, update } from 'apis/Apis';
import { put, takeEvery, call } from 'redux-saga/effects';
import {
    ADD_FAILED_TAX_DATA,
    ADD_FAILED_TAX_GROUP_DATA,
    ADD_SUCCESS_TAX_DATA,
    ADD_SUCCESS_TAX_GROUP_DATA,
    FAILED_GET_TAX_DATA_BY_ID,
    FAILED_GET_TAX_DATA_BY_UNIQUE_ID,
    FAILED_GET_TAX_GROUP_DATA_BY_ID,
    FAILED_LAST_MODIFIED_DATE_TAX,
    FAILED_LAST_MODIFIED_DATE_TAX_GROUP,
    FAILED_TAX_GROUP_LIST_DATA,
    FAILED_TAX_LIST_DATA,
    SUCCESS_GET_TAX_DATA_BY_ID,
    SUCCESS_GET_TAX_DATA_BY_UNIQUE_ID,
    SUCCESS_GET_TAX_GROUP_DATA_BY_ID,
    SUCCESS_LAST_MODIFIED_DATE_TAX,
    SUCCESS_LAST_MODIFIED_DATE_TAX_GROUP,
    SUCCESS_TAX_GROUP_LIST_DATA,
    SUCCESS_TAX_LIST_DATA,
    TAX_DUPLICATE,
    TAX_GROUP_DUPLICATE,
    UPDATE_FAILED_TAX_DATA,
    UPDATE_FAILED_TAX_GROUP_DATA,
    UPDATE_SUCCESS_TAX_DATA,
    UPDATE_SUCCESS_TAX_GROUP_DATA,
    SUCCESS_GET_ACTIVE_TAX_GROUP_LIST,
    FAILED_GET_ACTIVE_TAX_GROUP_LIST,
    SUCCESS_GET_TAX_GROUP_AND_TAX_LIST,
    FAILED_GET_TAX_GROUP_AND_TAX_LIST
} from 'store/constant/master/TaxMasterConstant';

//tax saga

export function* saveTaxSaga(action) {
    action.data.path = `${process.env.REACT_APP_FINANCE_URL}/tax`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        console.log(responseData.data.payload);

        yield put({ type: ADD_SUCCESS_TAX_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: ADD_FAILED_TAX_DATA, data: responseData.data });
    }
}

export function* getTaxByIdSaga(action) {
    console.log('getTaxByIdSaga tax saga');
    console.log(action);

    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_FINANCE_URL}/tax/${action.data.id}`);
        console.log(responseData.data.payload);
        yield put({ type: SUCCESS_GET_TAX_DATA_BY_ID, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: FAILED_GET_TAX_DATA_BY_ID, data: responseData.data });
    }
}

export function* getTaxByUniqueIdSaga(action) {
    console.log('getTaxByUniqueIdSaga');
    console.log(action);

    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_FINANCE_URL}/taxDetails/${action.data.id}`);
        console.log(responseData.data.payload);
        yield put({ type: SUCCESS_GET_TAX_DATA_BY_UNIQUE_ID, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: FAILED_GET_TAX_DATA_BY_UNIQUE_ID, data: responseData.data });
    }
}

export function* updateTaxSaga(action) {
    console.log('updateTaxSaga tax saga');
    console.log(action);
    action.data.path = `${process.env.REACT_APP_FINANCE_URL}/tax/${action.data.taxCode}`;
    let responseData = [];
    try {
        responseData = yield call(update, action.data);
        console.log(responseData.data.payload);
        yield put({ type: UPDATE_SUCCESS_TAX_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: UPDATE_FAILED_TAX_DATA, data: responseData.data });
    }
}

export function* getAllTaxSaga() {
    console.log('here');
    let responseData = [];

    try {
        responseData = yield call(get, process.env.REACT_APP_FINANCE_URL + '/taxes');
        console.log(responseData.data.payload);
        yield put({ type: SUCCESS_TAX_LIST_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: FAILED_TAX_LIST_DATA, data: responseData.data });
    }
}

export function* checkDupicateTaxCodeSaga(action) {
    console.log('checkDupicateTaxCodeSaga tax saga');
    console.log(action);

    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_FINANCE_URL}/taxCodeCheck/${action.data.taxCode}`);
        console.log(responseData);
        yield put({ type: TAX_DUPLICATE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: TAX_DUPLICATE, data: responseData });
    }
}

export function* checkLatestTaxModifiedDateSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_FINANCE_URL}/taxLastModifiedTime`);
        console.log('response data last:' + responseData);
        yield put({ type: SUCCESS_LAST_MODIFIED_DATE_TAX, data: responseData.data });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_LAST_MODIFIED_DATE_TAX, data: '' });
    }
}

//tax group saga

export function* saveTaxGroupSaga(action) {
    action.data.path = `${process.env.REACT_APP_FINANCE_URL}/taxGroup`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        console.log(responseData.data.payload);

        yield put({ type: ADD_SUCCESS_TAX_GROUP_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: ADD_FAILED_TAX_GROUP_DATA, data: responseData.data });
    }
}

export function* getAllTaxGroupSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_FINANCE_URL}/taxGroups`);
        console.log(responseData.data.payload);

        yield put({ type: SUCCESS_TAX_GROUP_LIST_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_TAX_GROUP_LIST_DATA, data: responseData.data });
    }
}

export function* getTaxGroupByIdSaga(action) {
    console.log('getTaxByIdSaga tax saga');
    console.log(action);

    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_FINANCE_URL}/taxGroup/${action.data.id}`);
        console.log(responseData.data.payload);
        yield put({ type: SUCCESS_GET_TAX_GROUP_DATA_BY_ID, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: FAILED_GET_TAX_GROUP_DATA_BY_ID, data: responseData.data });
    }
}

export function* updateTaxGroupSaga(action) {
    console.log('update Tax groupSaga tax saga');
    console.log(action);
    action.data.path = `${process.env.REACT_APP_FINANCE_URL}/taxGroup/${action.data.taxGroupCode}`;
    let responseData = [];
    try {
        responseData = yield call(update, action.data);
        console.log(responseData.data.payload);
        yield put({ type: UPDATE_SUCCESS_TAX_GROUP_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: UPDATE_FAILED_TAX_GROUP_DATA, data: responseData.data });
    }
}

export function* checkDupicateTaxGroupCodeSaga(action) {
    console.log('checkDupicateTaxGroupCodeSaga tax saga');
    console.log(action);

    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_FINANCE_URL}/taxGroupCodeCheck/${action.data}`);
        console.log(responseData);
        yield put({ type: TAX_GROUP_DUPLICATE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: TAX_GROUP_DUPLICATE, data: responseData });
    }
}

export function* checkLatestTaxGrupModifiedDateSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_FINANCE_URL}/lastModifiedTime`);
        console.log('response data last:' + responseData);
        yield put({ type: SUCCESS_LAST_MODIFIED_DATE_TAX_GROUP, data: responseData.data });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_LAST_MODIFIED_DATE_TAX_GROUP, data: '' });
    }
}

export function* getAllActiveTaxGroups() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_FINANCE_URL}/activeTaxGroups`);
        console.log('response data last:' + responseData);
        yield put({ type: SUCCESS_GET_ACTIVE_TAX_GROUP_LIST, data: responseData.data });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_GET_ACTIVE_TAX_GROUP_LIST, data: '' });
    }
}

export function* getAllActiveTaxGroupsandTaxes(action) {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_FINANCE_URL}/taxTaxGroupDetailsByType/${action.data}`);
        console.log('response data last:' + responseData);
        yield put({ type: SUCCESS_GET_TAX_GROUP_AND_TAX_LIST, data: responseData.data });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_GET_TAX_GROUP_AND_TAX_LIST, data: '' });
    }
}
