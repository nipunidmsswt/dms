import { create, get, getById, update } from 'apis/Apis';
import { put, takeEvery, call } from 'redux-saga/effects';
import {
    ADD_SUCCESS_TOUR_CATEGORY_DATA,
    ADD_FAILED_TOUR_CATEGORY_DATA,
    SUCCESS_TOUR_CATEGORY_LIST_DATA,
    FAILED_TOUR_CATEGORY_LIST_DATA,
    SUCCESS_GET_TOUR_CATEGORY_DATA_BY_ID,
    FAILED_GET_TOUR_CATEGORY_BY_ID,
    UPDATE_SUCCESS_TOUR_CATEGORY_DATA,
    UPDATE_FAILED_TOUR_CATEGORY_DATA,
    TOUR_CATEGORY_DUPLICATE,
    SUCCESS_LAST_MODIFIED_DATE,
    FAILED_LAST_MODIFIED_DATE,
    SUCCESS_ACTIVE_TOUR_CATEGORY_LIST_DATA,
    FAILED_ACTIVE_TOUR_CATEGORY_LIST_DATA
} from 'store/constant/master/TourCategoryMasterConstant';

export function* saveTourCategoryHandler(action) {
    action.data.path = `${process.env.REACT_APP_TOUR_URL}/tourCategory`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        yield put({
            type: ADD_SUCCESS_TOUR_CATEGORY_DATA,
            data: responseData.data
        });
    } catch (e) {
        console.log('e:' + e);
        yield put({ type: ADD_FAILED_TOUR_CATEGORY_DATA, data: responseData.data });
    }
}

export function* getAllTourCategorySaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_TOUR_URL}/tourCategories`);
        yield put({
            type: SUCCESS_TOUR_CATEGORY_LIST_DATA,
            data: responseData.data
        });
    } catch (e) {
        console.log(e);
        yield put({
            type: FAILED_TOUR_CATEGORY_LIST_DATA,
            data: responseData.data
        });
    }
}

export function* checkLeatestModifiedDateSaga() {
    console.log('latest date');
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_TOUR_URL}/lastModifiedTime`);
        console.log('response data last:' + responseData);
        yield put({ type: SUCCESS_LAST_MODIFIED_DATE, data: responseData.data });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_LAST_MODIFIED_DATE, data: '' });
    }
}

export function* getTourCategoryByIdSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_TOUR_URL}/tourCategory/${action.data.id}`);
        yield put({
            type: SUCCESS_GET_TOUR_CATEGORY_DATA_BY_ID,
            data: responseData.data
        });
    } catch (e) {
        yield put({
            type: FAILED_GET_TOUR_CATEGORY_BY_ID,
            data: responseData.data
        });
    }
}

export function* updateTourCategorySaga(action) {
    action.data.path = `${process.env.REACT_APP_TOUR_URL}/tourCategory/${action.data.tourCategoryCode}`;
    let responseData = [];
    try {
        responseData = yield call(update, action.data);

        yield put({
            type: UPDATE_SUCCESS_TOUR_CATEGORY_DATA,
            data: responseData.data
        });
    } catch (e) {
        console.log(e);
        yield put({
            type: UPDATE_FAILED_TOUR_CATEGORY_DATA,
            data: responseData.data
        });
    }
}

export function* checkDupicateTourCategotyCodeSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_TOUR_URL}/tourCodeCheck/${action.data.tourCategoryCode}`);
        console.log('response data:' + responseData);
        yield put({
            type: TOUR_CATEGORY_DUPLICATE,
            data: responseData.data.errorMessages
        });
    } catch (e) {
        console.log(responseData);
        yield put({
            type: TOUR_CATEGORY_DUPLICATE,
            data: responseData.data.errorMessages
        });
    }
}

export function* getActiveTourCategoriesSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_TOUR_URL}/activeTourCategories`);
        yield put({
            type: SUCCESS_ACTIVE_TOUR_CATEGORY_LIST_DATA,
            data: responseData.data
        });
    } catch (e) {
        console.log(e);
        yield put({
            type: FAILED_ACTIVE_TOUR_CATEGORY_LIST_DATA,
            data: responseData.data
        });
    }
}
