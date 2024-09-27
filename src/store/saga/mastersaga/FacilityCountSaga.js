import { put, call } from 'redux-saga/effects';
import {
    ADD_FAILED_FACILITYCOUNTER_DATA,
    ADD_SUCCESS_FACILITYCOUNTER_DATA,
    FAILED_FACILITYCOUNTER_LAST_MODIFIED_DATE,
    FAILED_FACILITYCOUNTER_LIST_DATA,
    FAILED_GET_ALL_FACILITY_COUNTER_DATA_HOTEL_WISE,
    SUCCESS_FACILITYCOUNTER_LAST_MODIFIED_DATE,
    SUCCESS_FACILITYCOUNTER_LIST_DATA,
    SUCCESS_GET_ALL_FACILITY_COUNTER_DATA_HOTEL_WISE,
    UPDATE_FAILED_FACILITYCOUNTER_DATA,
    UPDATE_SUCCESS_FACILITYCOUNTER_DATA
} from 'store/constant/master/FacilityCounterConstant';
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

export function* saveFacilityCountSaga(action) {
    action.data.path = `${process.env.REACT_APP_ACCOMODATION_URL}/facilityCount/`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        console.log(responseData.data.payload);

        yield put({ type: ADD_SUCCESS_FACILITYCOUNTER_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: ADD_FAILED_FACILITYCOUNTER_DATA, data: responseData.data });
    }
}

export function* getAllFacilityCountSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_ACCOMODATION_URL}/facilityCount/`);
        console.log(responseData.data.payload);

        yield put({ type: SUCCESS_FACILITYCOUNTER_LIST_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_FACILITYCOUNTER_LIST_DATA, data: responseData.data });
    }
}

export function* getAllFacilityCountHotelWiseSaga(action) {
    console.log(action.data.hotel);

    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_ACCOMODATION_URL}/facilityCount/hotelWise/${action.data.hotel}`);
        console.log(responseData.data.payload);
        yield put({ type: SUCCESS_GET_ALL_FACILITY_COUNTER_DATA_HOTEL_WISE, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: FAILED_GET_ALL_FACILITY_COUNTER_DATA_HOTEL_WISE, data: responseData.data });
    }
}

export function* getFacilityCountByIdSaga(action) {
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

export function* updateFacilityCountSaga(action) {
    action.data.path = `${process.env.REACT_APP_ACCOMODATION_URL}/facilityCount/`;
    let responseData = [];
    try {
        responseData = yield call(update, action.data);
        console.log(responseData.data.payload);
        yield put({ type: UPDATE_SUCCESS_FACILITYCOUNTER_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: UPDATE_FAILED_FACILITYCOUNTER_DATA, data: responseData.data });
    }
}

export function* checkDupicateFacilityCountCodeSaga(action) {
    console.log('checkDupicateFacilityCountCodeSaga tax saga');
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

export function* checkLatestFacilityCountModifiedDateSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_ACCOMODATION_URL}/facilityCount/lastModifiedDateTime`);
        yield put({ type: SUCCESS_FACILITYCOUNTER_LAST_MODIFIED_DATE, data: responseData.data });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_FACILITYCOUNTER_LAST_MODIFIED_DATE, data: '' });
    }
}

export function* getAllActiveFacilityCountSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_ACCOMODATION_URL}/hotelcategory/active`);
        console.log(responseData.data.payload);

        yield put({ type: SUCCESS_ACTIVE_HOTEL_CATEGORY_LIST_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_ACTIVE_HOTEL_CATEGORY_LIST_DATA, data: responseData.data });
    }
}
