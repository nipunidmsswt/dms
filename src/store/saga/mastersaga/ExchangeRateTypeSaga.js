import { put, takeEvery, call } from 'redux-saga/effects';
import { create, getById, update, get } from '../../../apis/Apis';
import {
    SUCCESS_EXCHNAGE_RATE_TYPE_LIST_DATA,
    FAILED_EXCHNAGE_RATE_TYPE_LIST_DATA,
    UPDATE_SUCCESS_EXCHNAGE_RATE_TYPE_DATA,
    UPDATE_FAILED_EXCHNAGE_RATE_TYPE_DATA,
    ADD_SUCCESS_EXCHNAGE_RATE_TYPE_DATA,
    ADD_FAILED_EXCHNAGE_RATE_TYPE_DATA,
    SUCCESS_GET_EXCHNAGE_RATE_TYPE_DATA_BY_ID,
    FAILED_GET_EXCHNAGE_RATE_TYPE_DATA_BY_ID,
    SUCCESS_LAST_MODIFIED_DATE_EXCHNAGE_RATE_TYPE,
    FAILED_LAST_MODIFIED_DATE_EXCHNAGE_RATE_TYPE,
    SUCCESS_EXCHNAGE_RATE_TYPE_DATA_BY_CURRENCY_ID,
    FAILED_EXCHNAGE_RATE_TYPE_DATA_BY_CURRENCY_ID,
    SUCCESS_CONVERT_CURRENCY_TO_BASE_CURRENCY,
    FAILED_CONVERT_CURRENCY_TO_BASE_CURRENCY
} from '../../constant/master/ExchangeRateConstant';

//exchange rate type saga

export function* saveExchangeRateTypeSaga(action) {
    action.data.path = `${process.env.REACT_APP_FINANCE_URL}/currency/`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        console.log(responseData.data.payload);

        yield put({
            type: ADD_SUCCESS_EXCHNAGE_RATE_TYPE_DATA,
            data: responseData.data
        });
    } catch (e) {
        yield put({
            type: ADD_FAILED_EXCHNAGE_RATE_TYPE_DATA,
            data: responseData.data
        });
    }
}

export function* getExchangeRateTypeByIdSaga(action) {
    console.log('getExchangeRateTypeByIdSaga tax saga');
    console.log(action);

    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_FINANCE_URL}/currency/exchangeRate/${action.data.id}`);
        console.log(responseData.data.payload);
        yield put({ type: SUCCESS_GET_EXCHNAGE_RATE_TYPE_DATA_BY_ID, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: FAILED_GET_EXCHNAGE_RATE_TYPE_DATA_BY_ID, data: responseData.data });
    }
}

export function* updateExchangeRateTypeSaga(action) {
    console.log('updateExchangeRateTypeSaga tax saga');
    console.log(action);
    action.data.path = `${process.env.REACT_APP_FINANCE_URL}/currency/${action.data.currencyId}`;
    let responseData = [];
    try {
        responseData = yield call(update, action.data);
        console.log(responseData.data.payload);
        yield put({
            type: UPDATE_SUCCESS_EXCHNAGE_RATE_TYPE_DATA,
            data: responseData.data
        });
    } catch (e) {
        console.log(e);
        yield put({ type: UPDATE_FAILED_EXCHNAGE_RATE_TYPE_DATA, data: responseData.data });
    }
}

export function* getAllExchnageRateTypeDataSaga() {
    let responseData = [];

    try {
        responseData = yield call(get, process.env.REACT_APP_FINANCE_URL + '/currency/');
        console.log(responseData.data.payload);
        yield put({ type: SUCCESS_EXCHNAGE_RATE_TYPE_LIST_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: FAILED_EXCHNAGE_RATE_TYPE_LIST_DATA, data: responseData.data });
    }
}

// export function* checkDupicateTaxCodeSaga(action) {
//   console.log("checkDupicateTaxCodeSaga tax saga");
//   console.log(action);

//   let responseData = [];
//   try {
//     responseData = yield call(getById, `${process.env.REACT_APP_FINANCE_URL}/taxCodeCheck/${action.data.taxCode}`);
//     console.log(responseData);
//     yield put({ type: TAX_DUPLICATE, data: responseData.data });
//   } catch (e) {

//     console.log(responseData);
//     yield put({ type: TAX_DUPLICATE, data:  responseData});
//   }
// }

export function* checkLatestCurrencyModifiedDateSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_FINANCE_URL}/currency/lastModifiedTime`);
        console.log('response data last:' + responseData);
        yield put({
            type: SUCCESS_LAST_MODIFIED_DATE_EXCHNAGE_RATE_TYPE,
            data: responseData.data
        });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_LAST_MODIFIED_DATE_EXCHNAGE_RATE_TYPE, data: '' });
    }
}
export function* getExChangeRateDataByCurrencyId(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_FINANCE_URL}/currency/exchangeRates/${action.data.id}`);
        console.log(responseData.data.payload);
        yield put({ type: SUCCESS_EXCHNAGE_RATE_TYPE_DATA_BY_CURRENCY_ID, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: FAILED_EXCHNAGE_RATE_TYPE_DATA_BY_CURRENCY_ID, data: responseData.data });
    }
}

export function* convertCurrencyToBaseCurrencySaga(action) {
    action.data.path = `${process.env.REACT_APP_FINANCE_URL}/exchangeRate`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        console.log(responseData.data.payload);

        yield put({
            type: SUCCESS_CONVERT_CURRENCY_TO_BASE_CURRENCY,
            data: responseData.data
        });
    } catch (e) {
        yield put({
            type: FAILED_CONVERT_CURRENCY_TO_BASE_CURRENCY,
            data: responseData.data
        });
    }
}
