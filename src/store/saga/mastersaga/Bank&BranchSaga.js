import { put, call } from 'redux-saga/effects';
import { create, get, getById, update } from 'apis/Apis';
import {
    ADD_SUCCESS_BANK_DATA,
    ADD_SUCCESS_BRANCH_DATA,
    ADD_SUCCESS_DETAILS_BANK_DATA,
    ADD_FAILED_BANK_DATA,
    ADD_FAILED_BRANCH_DATA,
    ADD_FAILED_DETAILS_BANK_DATA,
    UPDATE_SUCCESS_BANK_DETAILS_DATA,
    UPDATE_FAILED_BANK_DETAILS_DATA,
    UPDATE_FAILED_BRANCH_DATA,
    SUCCESS_BANK_LIST_DATA,
    SUCCESS_BANK_DETAILS_LIST_DATA,
    SUCCESS_BRANCH_LIST_DATA,
    FAILED_BANK_LIST_DATA,
    FAILED_BRANCH_LIST_DATA,
    FAILED_BANK_DETAILS_LIST_DATA,
    SUCCESS_GET_BRANCH_DATA_BY_ID,
    SUCCESS_GET_BANK_DETAILS_DATA_BY_ID,
    BANK_DUPLICATE,
    BANK_DETAILS_DUPLICATE,
    BRANCH_DUPLICATE,
    SUCCESS_LAST_MODIFIED_DATE_BANK,
    SUCCESS_LAST_MODIFIED_DATE_BANK_DETAILS,
    SUCCESS_LAST_MODIFIED_DATE_BRANCH,
    FAILED_LAST_MODIFIED_DATE_BANK_DETAILS,
    FAILED_LAST_MODIFIED_DATE_BANK,
    FAILED_LAST_MODIFIED_DATE_BRANCH,
    FAILED_GET_BRANCH_DATA_BY_ID,
    FAILED_GET_BANK_DETAILS_DATA_BY_ID,
    UPDATE_SUCCESS_BRANCH_DATA,
    SUCCESS_GET_BRANCHES_BY_BANK_ID,
    FAILED_GET_BRANCHES_BY_BANK_ID,
    SAVED_BANK_AND_BRANCH
} from 'store/constant/master/BankConstant';

//bank saga

export function* saveBankSaga(action) {
    action.data.path = `${process.env.REACT_APP_FINANCE_URL}/bank/`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        console.log(responseData.data.payload);

        yield put({ type: ADD_SUCCESS_BANK_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: ADD_FAILED_BANK_DATA, data: responseData.data });
    }
}

export function* getAllBankSaga() {
    let responseData = [];

    try {
        responseData = yield call(get, process.env.REACT_APP_FINANCE_URL + '/bank/');
        console.log(responseData.data.payload);
        yield put({ type: SUCCESS_BANK_LIST_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: FAILED_BANK_LIST_DATA, data: responseData.data });
    }
}

export function* checkDupicateBankSaga(action) {
    console.log(action);

    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_FINANCE_URL}/sessionCheck/${action.data.taxCode}`);
        console.log(responseData);
        yield put({ type: BANK_DUPLICATE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: BANK_DUPLICATE, data: responseData });
    }
}

export function* checkLatestModifiedDateSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_FINANCE_URL}/season/lastModifiedTime`);
        console.log('response data last:' + responseData);
        yield put({
            type: SUCCESS_LAST_MODIFIED_DATE_BANK,
            data: responseData.data
        });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_LAST_MODIFIED_DATE_BANK, data: '' });
    }
}

//branch saga

export function* saveBranchSaga(action) {
    action.data.path = `${process.env.REACT_APP_FINANCE_URL}/branch/`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        console.log(responseData.data.payload);

        yield put({ type: ADD_SUCCESS_BRANCH_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: ADD_FAILED_BRANCH_DATA, data: responseData.data });
    }
}

export function* getBranchByIdSaga(action) {
    console.log('getTaxByIdSaga tax saga');
    console.log(action);

    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_FINANCE_URL}/branch/${action.data.id}`);
        console.log(responseData);
        yield put({
            type: SUCCESS_GET_BRANCH_DATA_BY_ID,
            data: responseData.data
        });
    } catch (e) {
        console.log(e);
        yield put({
            type: FAILED_GET_BRANCH_DATA_BY_ID,
            data: responseData.data
        });
    }
}

export function* updateBranchSaga(action) {
    console.log('updateBranchSaga tax saga');
    console.log(action);

    action.data.path = `${process.env.REACT_APP_FINANCE_URL}/branch/`;
    let responseData = [];
    try {
        responseData = yield call(update, action.data);
        console.log(responseData);
        yield put({ type: UPDATE_SUCCESS_BRANCH_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: UPDATE_FAILED_BRANCH_DATA, data: responseData.data });
    }
}

export function* getAllBranchesSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, process.env.REACT_APP_FINANCE_URL + '/branch/');
        console.log(responseData.data.payload);
        yield put({ type: SUCCESS_BRANCH_LIST_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: FAILED_BRANCH_LIST_DATA, data: responseData.data });
    }
}

export function* checkDupicateBranchesSaga(action) {
    console.log(action);

    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_FINANCE_URL}/sessionCheck/${action.data.taxCode}`);
        console.log(responseData);
        yield put({ type: BRANCH_DUPLICATE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: BRANCH_DUPLICATE, data: responseData });
    }
}

export function* checkLatestBranchModifiedDateSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_FINANCE_URL}/branch/lastModifiedDateTime`);
        console.log('response data last:' + responseData);
        yield put({
            type: SUCCESS_LAST_MODIFIED_DATE_BRANCH,
            data: responseData.data
        });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_LAST_MODIFIED_DATE_BRANCH, data: '' });
    }
}

export function* getBranchesByBankId(action) {
    console.log(action);
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_FINANCE_URL}/branch/branchList/${action.id}`);
        console.log('response data last:' + responseData);
        yield put({
            type: SUCCESS_GET_BRANCHES_BY_BANK_ID,
            data: responseData.data
        });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_GET_BRANCHES_BY_BANK_ID, data: '' });
    }
}

export function* getSavedBankBrachData(action) {
    console.log('dfhjkfghl;gkfjdhscxzccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
    console.log(action);
    let responseData = [];
    try {
        responseData = yield call(
            get,
            `${process.env.REACT_APP_FINANCE_URL}/bankDetails/codeDuplicate/${action.data.bank}/${action.data.branch}`
        );
        console.log('response data last:' + responseData);
        yield put({
            type: SAVED_BANK_AND_BRANCH,
            data: responseData.data
        });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: SAVED_BANK_AND_BRANCH, data: '' });
    }
}

//bank details saga

export function* saveBankDetailsSaga(action) {
    action.data.path = `${process.env.REACT_APP_FINANCE_URL}/bankDetails/`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        console.log(responseData.data.payload);

        yield put({ type: ADD_SUCCESS_DETAILS_BANK_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: ADD_FAILED_DETAILS_BANK_DATA, data: responseData.data });
    }
}

export function* getBankDetailsByIdSaga(action) {
    console.log('getTaxByIdSaga tax saga');
    console.log(action);

    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_FINANCE_URL}/bankDetails/${action.data.id}`);
        console.log(responseData);
        yield put({
            type: SUCCESS_GET_BANK_DETAILS_DATA_BY_ID,
            data: responseData.data
        });
    } catch (e) {
        console.log(e);
        yield put({
            type: FAILED_GET_BANK_DETAILS_DATA_BY_ID,
            data: responseData.data
        });
    }
}

export function* updateBankDetailsSaga(action) {
    console.log('updateSeasonSaga tax saga');
    console.log(action);

    action.data.path = `${process.env.REACT_APP_FINANCE_URL}/season/${action.data.mainSeason}`;
    let responseData = [];
    try {
        responseData = yield call(update, action.data);
        console.log(responseData);
        yield put({ type: UPDATE_SUCCESS_BANK_DETAILS_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: UPDATE_FAILED_BANK_DETAILS_DATA, data: responseData.data });
    }
}

export function* getAllBankDetailsSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, process.env.REACT_APP_FINANCE_URL + '/bankDetails/');
        console.log(responseData.data.payload);
        yield put({ type: SUCCESS_BANK_DETAILS_LIST_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: FAILED_BANK_DETAILS_LIST_DATA, data: responseData.data });
    }
}

export function* checkDupicateBankDetailsSaga(action) {
    console.log(action);

    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_FINANCE_URL}/sessionCheck/${action.data.taxCode}`);
        console.log(responseData);
        yield put({ type: BANK_DETAILS_DUPLICATE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: BANK_DETAILS_DUPLICATE, data: responseData });
    }
}

export function* checkLatestBankDetailsModifiedDateSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_FINANCE_URL}/bankDetails/lastModifiedDateTime`);
        console.log('response data last:' + responseData);
        yield put({
            type: SUCCESS_LAST_MODIFIED_DATE_BANK_DETAILS,
            data: responseData.data
        });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_LAST_MODIFIED_DATE_BANK_DETAILS, data: '' });
    }
}
