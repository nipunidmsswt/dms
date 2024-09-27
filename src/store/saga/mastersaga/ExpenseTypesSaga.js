import {
    ADD_FAILED_EXPENSE_TYPES,
    ADD_SUCCESS_EXPENSE_TYPES,
    EXPENSE_TYPES_CODE_DUPLICATE,
    FAILED_EXPENSE_TYPES_LAST_MODIFIED_DATE,
    FAILED_EXPENSE_TYPES_LIST_DATA,
    FAILED_GET_ALL_CURRENCY_LIST,
    FAILED_GET_EXPENSE_TYPES_BY_ID,
    SUCCESS_EXPENSE_TYPES_LAST_MODIFIED_DATE,
    SUCCESS_EXPENSE_TYPES_LIST_DATA,
    SUCCESS_GET_EXPENSE_TYPES_BY_ID,
    SUCESS_GET_ALL_CURRENCY_LIST,
    UPDATE_FAILED_EXPENSE_TYPES,
    UPDATE_SUCCESS_EXPENSE_TYPES,
    SUCCESS_ACTIVE_EXPENSE_TYPES_LIST_DATA,
    FAILED_ACTIVE_EXPENSE_TYPES_LIST_DATA,
    EXPENSE_TYPES_DESCRIPTION_DUPLICATE
} from 'store/constant/master/ExpenseTypesConstant';
import { put, takeEvery, call } from 'redux-saga/effects';
import { create, getById, update, get } from '../../../apis/Apis';

export function* getAllCurrencyListData() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_FINANCE_URL}/currencyList/`);
        yield put({ type: SUCESS_GET_ALL_CURRENCY_LIST, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_ALL_CURRENCY_LIST, data: responseData.data });
    }
}

export function* saveExpenseTypesDataHandler(action) {
    console.log('yaaa');
    action.data.path = `${process.env.REACT_APP_TRANSPORT_URL}/expenseTypes/`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        yield put({ type: ADD_SUCCESS_EXPENSE_TYPES, data: responseData.data });
    } catch (e) {
        console.log('e:' + e);
        yield put({ type: ADD_FAILED_EXPENSE_TYPES, data: responseData.data });
    }
}

export function* getAllExpenseTypesDataSaga() {
    console.log('getAllExpenseTypesDataSaga');
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_TRANSPORT_URL}/expenseTypes/`);
        yield put({ type: SUCCESS_EXPENSE_TYPES_LIST_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: FAILED_EXPENSE_TYPES_LIST_DATA, data: responseData.data });
    }
}

export function* getExpenseTypesByCodeSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_TRANSPORT_URL}/expenseTypes/${action.data.id}`);
        console.log('response data:' + responseData);
        yield put({
            type: SUCCESS_GET_EXPENSE_TYPES_BY_ID,
            data: responseData.data
        });
    } catch (e) {
        yield put({ type: FAILED_GET_EXPENSE_TYPES_BY_ID, data: responseData.data });
    }
}

export function* updateExpenseTypesDataSaga(action) {
    console.log(`${action.data.code}`);
    action.data.path = `${process.env.REACT_APP_TRANSPORT_URL}/expenseTypes/${action.data.expenseCode}`;
    let responseData = [];
    try {
        responseData = yield call(update, action.data);

        yield put({ type: UPDATE_SUCCESS_EXPENSE_TYPES, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: UPDATE_FAILED_EXPENSE_TYPES, data: responseData.data });
    }
}

export function* getExpenseTypesLatestModifiedDateSaga() {
    console.log('latest date');
    let responseData = [];
    // action.data.path = `/product`;
    try {
        responseData = yield call(get, `${process.env.REACT_APP_TRANSPORT_URL}/expenseTypes/lastModifiedTime`);
        console.log(responseData);
        yield put({
            type: SUCCESS_EXPENSE_TYPES_LAST_MODIFIED_DATE,
            data: responseData.data
        });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_EXPENSE_TYPES_LAST_MODIFIED_DATE, data: '' });
    }
}

export function* checkExpenseTypesDupicateCodeSaga(action) {
    console.log('checkExpenseTypesDupicateCodeSaga:' + action.data.code);
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_TRANSPORT_URL}/expenseTypes/codeDuplicate/${action.data.code}`);
        console.log('response data:' + responseData);
        yield put({
            type: EXPENSE_TYPES_CODE_DUPLICATE,
            data: responseData.data
        });
    } catch (e) {
        console.log(responseData);
        yield put({
            type: EXPENSE_TYPES_CODE_DUPLICATE,
            data: responseData
        });
    }
}

export function* getAllActiveExpenseTypesDataSaga() {
    console.log('getAllExpenseTypesDataSaga');
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_TRANSPORT_URL}/expenseTypes/activeExpenseTypes`);
        yield put({ type: SUCCESS_ACTIVE_EXPENSE_TYPES_LIST_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: FAILED_ACTIVE_EXPENSE_TYPES_LIST_DATA, data: responseData.data });
    }
}

export function* checkExpenseTypesDupicateDescriptionSaga(action) {
    console.log('checkExpenseTypesDupicateDescriptionSaga:' + action.data.code);
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_TRANSPORT_URL}/expenseTypes/descriptionDuplicate/${action.data.code}`);
        console.log('response data:' + responseData);
        yield put({
            type: EXPENSE_TYPES_DESCRIPTION_DUPLICATE,
            data: responseData.data
        });
    } catch (e) {
        console.log(responseData);
        yield put({
            type: EXPENSE_TYPES_DESCRIPTION_DUPLICATE,
            data: responseData
        });
    }
}
