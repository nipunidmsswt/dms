import { put, call } from 'redux-saga/effects';
import { create, getById, update, get } from '../../../apis/Apis';
import {
    ADD_SUCCESS_HOTEL_MAIN_DATA,
    ADD_FAILED_HOTEL_MAIN_DATA,
    SUCCESS_HOTEL_MAIN_LIST_DATA,
    FAILED_HOTEL_MAIN_LIST_DATA,
    SUCCESS_GET_HOTEL_MAIN_DATA_BY_ID,
    FAILED_GET_HOTEL_MAIN_DATA_BY_ID,
    UPDATE_SUCCESS_HOTEL_MAIN_DATA,
    UPDATE_FAILED_HOTEL_MAIN_DATA,
    HOTEL_MAIN_DUPLICATE,
    SUCCESS_LAST_MODIFIED_DATE_HOTEL_MAIN,
    FAILED_LAST_MODIFIED_DATE_HOTEL_MAIN,
    SUCCESS_ACTIVE_HOTEL_MAIN_LIST_DATA,
    FAILED_ACTIVE_HOTEL_MAIN_LIST_DATA,
    SUCCESS_GET_HOTELS_BY_LOCATION_CURRENCY_MIN_MAX,
    FAILED_GET_HOTELS_BY_LOCATION_CURRENCY_MIN_MAX
} from 'store/constant/master/HotelMasterConstant';

export function* saveHotelMainSaga(action) {
    action.data.path = `${process.env.REACT_APP_ACCOMODATION_URL}/hotel`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        console.log(responseData.data.payload);

        yield put({ type: ADD_SUCCESS_HOTEL_MAIN_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: ADD_FAILED_HOTEL_MAIN_DATA, data: responseData.data });
    }
}

export function* getAllHotelMainSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_ACCOMODATION_URL}/hotels`);
        console.log(responseData.data.payload);

        yield put({ type: SUCCESS_HOTEL_MAIN_LIST_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_HOTEL_MAIN_LIST_DATA, data: responseData.data });
    }
}

export function* getHotelMainByIdSaga(action) {
    console.log('getTaxByIdSaga tax saga');
    console.log(action);

    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_ACCOMODATION_URL}/hotel/${action.data.id}`);
        console.log(responseData.data.payload);
        yield put({ type: SUCCESS_GET_HOTEL_MAIN_DATA_BY_ID, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: FAILED_GET_HOTEL_MAIN_DATA_BY_ID, data: responseData.data });
    }
}

export function* updateHotelMainSaga(action) {
    console.log('update Tax groupSaga tax saga');
    console.log(action);
    action.data.path = `${process.env.REACT_APP_ACCOMODATION_URL}/hotel`;
    let responseData = [];
    try {
        responseData = yield call(update, action.data);
        console.log(responseData.data.payload);
        yield put({ type: UPDATE_SUCCESS_HOTEL_MAIN_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: UPDATE_FAILED_HOTEL_MAIN_DATA, data: responseData.data });
    }
}

export function* checkDupicateHotelMainCodeSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_ACCOMODATION_URL}/hotelDuplicate/${action.data.code}`);
        console.log(responseData);
        yield put({ type: HOTEL_MAIN_DUPLICATE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: HOTEL_MAIN_DUPLICATE, data: responseData });
    }
}

export function* checkLatestHotelMainModifiedDateSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_ACCOMODATION_URL}/hotels/lastModified`);
        yield put({ type: SUCCESS_LAST_MODIFIED_DATE_HOTEL_MAIN, data: responseData.data });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_LAST_MODIFIED_DATE_HOTEL_MAIN, data: '' });
    }
}

export function* getAllActiveHotelMainSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_ACCOMODATION_URL}/hotelcategory/active`);
        console.log(responseData.data.payload);

        yield put({ type: SUCCESS_ACTIVE_HOTEL_MAIN_LIST_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_ACTIVE_HOTEL_MAIN_LIST_DATA, data: responseData.data });
    }
}

export function* getHotelsByLocationCurrencyMinMaxRates(action) {
    action.data.path = `${process.env.REACT_APP_ACCOMODATION_URL}/filterHotels`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        console.log(responseData.data.payload);

        yield put({ type: SUCCESS_GET_HOTELS_BY_LOCATION_CURRENCY_MIN_MAX, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_HOTELS_BY_LOCATION_CURRENCY_MIN_MAX, data: responseData.data });
    }
}
