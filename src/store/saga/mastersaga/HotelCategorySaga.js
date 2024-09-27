import { put, call } from 'redux-saga/effects';
import { create, getById, update, get } from '../../../apis/Apis';
import {
    ADD_SUCCESS_HOTEL_CATEGORY_DATA,
    ADD_FAILED_HOTEL_CATEGORY_DATA,
    SUCCESS_HOTEL_CATEGORY_LIST_DATA,
    FAILED_HOTEL_CATEGORY_LIST_DATA,
    SUCCESS_GET_HOTEL_CATEGORY_DATA_BY_ID,
    FAILED_GET_HOTEL_CATEGORY_DATA_BY_ID,
    UPDATE_SUCCESS_HOTEL_CATEGORY_DATA,
    UPDATE_FAILED_HOTEL_CATEGORY_DATA,
    HOTEL_CATEGORY_DUPLICATE,
    SUCCESS_LAST_MODIFIED_DATE_HOTEL_CATEGORY,
    FAILED_LAST_MODIFIED_DATE_HOTEL_CATEGORY,
    SUCCESS_ACTIVE_HOTEL_CATEGORY_LIST_DATA,
    FAILED_ACTIVE_HOTEL_CATEGORY_LIST_DATA
} from '../../constant/master/HotelCategoryConstant';

export function* saveHotelCateogrySaga(action) {
    action.data.path = `${process.env.REACT_APP_ACCOMODATION_URL}/hotelcategory/`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        console.log(responseData.data.payload);

        yield put({ type: ADD_SUCCESS_HOTEL_CATEGORY_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: ADD_FAILED_HOTEL_CATEGORY_DATA, data: responseData.data });
    }
}

export function* getAllHotelCateogrySaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_ACCOMODATION_URL}/hotelcategory/`);
        console.log(responseData.data.payload);

        yield put({ type: SUCCESS_HOTEL_CATEGORY_LIST_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_HOTEL_CATEGORY_LIST_DATA, data: responseData.data });
    }
}

export function* getHotelCateogryByIdSaga(action) {
    console.log('getTaxByIdSaga tax saga');
    console.log(action);

    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_ACCOMODATION_URL}/hotelcategory/${action.data.id}`);
        console.log(responseData.data.payload);
        yield put({ type: SUCCESS_GET_HOTEL_CATEGORY_DATA_BY_ID, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: FAILED_GET_HOTEL_CATEGORY_DATA_BY_ID, data: responseData.data });
    }
}

export function* updateHotelCateogrySaga(action) {
    console.log('update Tax groupSaga tax saga');
    console.log(action);
    action.data.path = `${process.env.REACT_APP_ACCOMODATION_URL}/hotelcategory/${action.data.code}`;
    let responseData = [];
    try {
        responseData = yield call(update, action.data);
        console.log(responseData.data.payload);
        yield put({ type: UPDATE_SUCCESS_HOTEL_CATEGORY_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: UPDATE_FAILED_HOTEL_CATEGORY_DATA, data: responseData.data });
    }
}

export function* checkDupicateHotelCateogryCodeSaga(action) {
    console.log('checkDupicateHotelCateogryCodeSaga tax saga');
    console.log(action.data.code);

    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_ACCOMODATION_URL}/hotelcategory/codeDuplicate/${action.data.code}`);
        console.log(responseData);
        yield put({ type: HOTEL_CATEGORY_DUPLICATE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: HOTEL_CATEGORY_DUPLICATE, data: responseData });
    }
}

export function* checkLatestHotelCateogryModifiedDateSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_FINANCE_URL}/hotelcategory/lastModifiedDateTime`);
        console.log('response data last:' + responseData);
        yield put({ type: SUCCESS_LAST_MODIFIED_DATE_HOTEL_CATEGORY, data: responseData.data });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_LAST_MODIFIED_DATE_HOTEL_CATEGORY, data: '' });
    }
}

export function* getAllActiveHotelCateogrySaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_ACCOMODATION_URL}/hotelcategory/active`);
        console.log(responseData.data.payload);

        yield put({ type: SUCCESS_ACTIVE_HOTEL_CATEGORY_LIST_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_ACTIVE_HOTEL_CATEGORY_LIST_DATA, data: responseData.data });
    }
}
