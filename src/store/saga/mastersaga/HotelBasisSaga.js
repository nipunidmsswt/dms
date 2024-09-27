import { put, takeEvery, call } from 'redux-saga/effects';
import { create, getById, update, get } from '../../../apis/Apis';
import {
    ADD_FAILED_HOTEL_BASIS,
    ADD_SUCCESS_HOTEL_BASIS,
    FAILED_GET_HOTEL_BASIS_BY_ID,
    FAILED_HOTEL_BASIS_LAST_MODIFIED_DATE,
    FAILED_HOTEL_BASIS_LIST_DATA,
    HOTEL_BASIS_CODE_DUPLICATE,
    SUCCESS_GET_HOTEL_BASIS_BY_ID,
    SUCCESS_HOTEL_BASIS_LAST_MODIFIED_DATE,
    SUCCESS_HOTEL_BASIS_LIST_DATA,
    UPDATE_FAILED_HOTEL_BASIS,
    UPDATE_SUCCESS_HOTEL_BASIS,
    SUCCESS_ACTIVE_HOTEL_BASIS_LIST_DATA,
    FAILED_ACTIVE_HOTEL_BASIS_LIST_DATA
} from '../../constant/master/HotelBasisConstant';

export function* saveHotelBasisDataHandler(action) {
    action.data.path = `${process.env.REACT_APP_ACCOMODATION_URL}/hotelBasis/`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        yield put({ type: ADD_SUCCESS_HOTEL_BASIS, data: responseData.data });
    } catch (e) {
        console.log('e:' + e);
        yield put({ type: ADD_FAILED_HOTEL_BASIS, data: responseData.data });
    }
}

export function* getAllHotelBasisDataSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_ACCOMODATION_URL}/hotelBasis/`);
        yield put({ type: SUCCESS_HOTEL_BASIS_LIST_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: FAILED_HOTEL_BASIS_LIST_DATA, data: responseData.data });
    }
}

export function* getHotelBasisByCodeSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_ACCOMODATION_URL}/hotelBasis/${action.data.id}`);
        console.log('response data:' + responseData);
        yield put({
            type: SUCCESS_GET_HOTEL_BASIS_BY_ID,
            data: responseData.data
        });
    } catch (e) {
        yield put({ type: FAILED_GET_HOTEL_BASIS_BY_ID, data: responseData.data });
    }
}

export function* updateHotelBasisDataSaga(action) {
    console.log(`${action.data.code}`);
    action.data.path = `${process.env.REACT_APP_ACCOMODATION_URL}/hotelBasis/${action.data.code}`;
    let responseData = [];
    try {
        responseData = yield call(update, action.data);

        yield put({ type: UPDATE_SUCCESS_HOTEL_BASIS, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: UPDATE_FAILED_HOTEL_BASIS, data: responseData.data });
    }
}

export function* getHotelBasisLatestModifiedDateSaga() {
    console.log('latest date');
    let responseData = [];
    // action.data.path = `/product`;
    try {
        responseData = yield call(get, `${process.env.REACT_APP_ACCOMODATION_URL}/hotelBasis/lastModifiedDateTime`);
        yield put({
            type: SUCCESS_HOTEL_BASIS_LAST_MODIFIED_DATE,
            data: responseData.data
        });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_HOTEL_BASIS_LAST_MODIFIED_DATE, data: '' });
    }
}

export function* checkHotelBasisDupicateCodeSaga(action) {
    console.log('checkHotelBasisDupicateCodeSaga:' + action.data.hotelBasisCode);
    let responseData = [];
    try {
        responseData = yield call(
            getById,
            `${process.env.REACT_APP_ACCOMODATION_URL}/hotelBasis/codeDuplicate/${action.data.hotelBasisCode}`
        );
        console.log('response data:' + responseData);
        yield put({
            type: HOTEL_BASIS_CODE_DUPLICATE,
            data: responseData.data
        });
    } catch (e) {
        console.log(responseData);
        yield put({
            type: HOTEL_BASIS_CODE_DUPLICATE,
            data: responseData
        });
    }
}

export function* getActiveHotelBasisListSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_ACCOMODATION_URL}/hotelBasis/activeHotelBasis`);
        console.log('response data:' + responseData?.data);
        console.log(responseData?.data);
        yield put({
            type: SUCCESS_ACTIVE_HOTEL_BASIS_LIST_DATA,
            data: responseData.data
        });
    } catch (e) {
        console.log(responseData);
        yield put({
            type: FAILED_ACTIVE_HOTEL_BASIS_LIST_DATA,
            data: responseData.data
        });
    }
}
