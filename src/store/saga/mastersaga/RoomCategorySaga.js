import { put, takeEvery, call } from 'redux-saga/effects';
import { create, getById, update, get } from '../../../apis/Apis';
import {
    ADD_FAILED_ROOM_CATEGORY,
    ADD_SUCCESS_ROOM_CATEGORY,
    FAILED_GET_ROOM_CATEGORY_BY_ID,
    FAILED_ROOM_CATEGORY_LAST_MODIFIED_DATE,
    FAILED_ROOM_CATEGORY_LIST_DATA,
    ROOM_CATEGORY_CODE_DUPLICATE,
    SUCCESS_GET_ROOM_CATEGORY_BY_ID,
    SUCCESS_ROOM_CATEGORY_LAST_MODIFIED_DATE,
    SUCCESS_ROOM_CATEGORY_LIST_DATA,
    UPDATE_FAILED_ROOM_CATEGORY,
    UPDATE_SUCCESS_ROOM_CATEGORY,
    SUCCESS_ACTIVE_ROOM_CATEGORY_LIST_DATA,
    FAILED_ACTIVE_ROOM_CATEGORY_LIST_DATA
} from '../../constant/master/RoomCategoryConstant';

export function* saveRoomCategoryDataHandler(action) {
    action.data.path = `${process.env.REACT_APP_ACCOMODATION_URL}/roomCategory/`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        yield put({ type: ADD_SUCCESS_ROOM_CATEGORY, data: responseData.data });
    } catch (e) {
        yield put({ type: ADD_FAILED_ROOM_CATEGORY, data: responseData.data });
    }
}

export function* getAllRoomCategoryDataSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_ACCOMODATION_URL}/roomCategory/`);
        yield put({ type: SUCCESS_ROOM_CATEGORY_LIST_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_ROOM_CATEGORY_LIST_DATA, data: responseData.data });
    }
}

export function* getRoomCategoryByCodeSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_ACCOMODATION_URL}/roomCategory/${action.data.id}`);
        yield put({
            type: SUCCESS_GET_ROOM_CATEGORY_BY_ID,
            data: responseData.data
        });
    } catch (e) {
        yield put({ type: FAILED_GET_ROOM_CATEGORY_BY_ID, data: responseData.data });
    }
}

export function* updateRoomCategoryDataSaga(action) {
    action.data.path = `${process.env.REACT_APP_ACCOMODATION_URL}/roomCategory/${action.data.code}`;
    let responseData = [];
    try {
        responseData = yield call(update, action.data);

        yield put({ type: UPDATE_SUCCESS_ROOM_CATEGORY, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: UPDATE_FAILED_ROOM_CATEGORY, data: responseData.data });
    }
}

export function* getRoomCategoryLatestModifiedDateSaga() {
    let responseData = [];
    // action.data.path = `/product`;
    try {
        responseData = yield call(get, `${process.env.REACT_APP_ACCOMODATION_URL}/roomCategory/lastModifiedDateTime`);
        yield put({
            type: SUCCESS_ROOM_CATEGORY_LAST_MODIFIED_DATE,
            data: responseData.data
        });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_ROOM_CATEGORY_LAST_MODIFIED_DATE, data: '' });
    }
}

export function* checkRoomCategoryDupicateCodeSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(
            getById,
            `${process.env.REACT_APP_ACCOMODATION_URL}/roomCategory/codeDuplicate/${action.data.RoomCategoryCode}`
        );
        yield put({
            type: ROOM_CATEGORY_CODE_DUPLICATE,
            data: responseData.data
        });
    } catch (e) {
        yield put({
            type: ROOM_CATEGORY_CODE_DUPLICATE,
            data: responseData
        });
    }
}

export function* getActiveRoomCategoryListSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_ACCOMODATION_URL}/roomCategory/activeRoomCategories`);
        yield put({ type: SUCCESS_ACTIVE_ROOM_CATEGORY_LIST_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_ACTIVE_ROOM_CATEGORY_LIST_DATA, data: responseData.data });
    }
}
