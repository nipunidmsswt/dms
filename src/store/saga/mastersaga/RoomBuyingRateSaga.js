import { put, call } from 'redux-saga/effects';
import { create, get, getById, update } from 'apis/Apis';
import {
    ADD_SUCCESS_ROOM_BUYING_RATE,
    ADD_FAILED_ROOM_BUYING_RATE,
    UPDATE_SUCCESS_ROOM_BUYING_RATE,
    UPDATE_FAILED_ROOM_BUYING_RATE,
    SUCCESS_ROOM_BUYING_RATE_LIST_DATA,
    FAILED_ROOM_BUYING_RATE_LIST_DATA,
    SUCCESS_GET_ROOM_BUYING_RATE_BY_ID,
    FAILED_GET_ROOM_BUYING_RATE_BY_ID,
    ROOM_BUYING_RATE_CODE_DUPLICATE,
    SUCCESS_ROOM_BUYING_RATE_LAST_MODIFIED_DATE,
    FAILED_ROOM_BUYING_RATE_LAST_MODIFIED_DATE,
    SUCCESS_GET_ROOM_BUYING_RATE_LIST_BY_HOTEL,
    FAILED_GET_ROOM_BUYING_RATE_LIST_BY_HOTEL,
    SUCCESS_CLEAR_ROOM_BUYING_RATE
} from 'store/constant/master/RoomBuyingRateConstant';

//RoomBuyingRate saga

export function* saveRoomBuyingRateSaga(action) {
    action.data.path = `${process.env.REACT_APP_ACCOMODATION_URL}/roomBuyingRate`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        console.log(responseData.data.payload);

        yield put({ type: ADD_SUCCESS_ROOM_BUYING_RATE, data: responseData.data });
    } catch (e) {
        yield put({ type: ADD_FAILED_ROOM_BUYING_RATE, data: responseData.data });
    }
}

export function* getRoomBuyingRateByIdSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_ACCOMODATION_URL}/roomBuyingRates/${action.data.id}`);
        console.log(responseData);
        yield put({
            type: SUCCESS_GET_ROOM_BUYING_RATE_BY_ID,
            data: responseData.data
        });
    } catch (e) {
        console.log(e);
        yield put({
            type: FAILED_GET_ROOM_BUYING_RATE_BY_ID,
            data: responseData.data
        });
    }
}

export function* updateRoomBuyingRateSaga(action) {
    console.log('updateRoomBuyingRateSaga tax saga');
    console.log(action);

    action.data.path = `${process.env.REACT_APP_ACCOMODATION_URL}/roomBuyingRate`;
    let responseData = [];
    try {
        responseData = yield call(update, action.data);
        console.log(responseData);
        yield put({ type: UPDATE_SUCCESS_ROOM_BUYING_RATE, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: UPDATE_FAILED_ROOM_BUYING_RATE, data: responseData.data });
    }
}

export function* getAllRoomBuyingRateSaga() {
    let responseData = [];

    try {
        responseData = yield call(get, process.env.REACT_APP_ACCOMODATION_URL + '/roomBuyingRates');
        console.log(responseData.data.payload);
        yield put({ type: SUCCESS_ROOM_BUYING_RATE_LIST_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: FAILED_ROOM_BUYING_RATE_LIST_DATA, data: responseData.data });
    }
}

export function* checkDupicateRoomBuyingRateSaga(action) {
    console.log(action);
    action.data.data.path = `${process.env.REACT_APP_ACCOMODATION_URL}/checkRoomBuyingRate`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data.data);
        console.log(responseData);
        yield put({ type: ROOM_BUYING_RATE_CODE_DUPLICATE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: ROOM_BUYING_RATE_CODE_DUPLICATE, data: responseData });
    }
}

export function* checkLatestRoomBuyingRateModifiedDateSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_ACCOMODATION_URL}/roomBuyingRates/lastModified`);
        console.log('response data last:' + responseData);
        yield put({
            type: SUCCESS_ROOM_BUYING_RATE_LAST_MODIFIED_DATE,
            data: responseData.data
        });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_ROOM_BUYING_RATE_LAST_MODIFIED_DATE, data: '' });
    }
}

// export function* getAllActiveRoomBuyingRateSaga() {
//     let responseData = [];

//     try {
//         responseData = yield call(get, process.env.REACT_APP_ACCOMODATION_URL + '/RoomBuyingRate/activeRoomBuyingRate');
//         yield put({ type: SUCEE, data: responseData.data });
//     } catch (e) {
//         yield put({ type: FAILED_ROOM_BUYING_RATE_LAST_MODIFIED_DATE, data: responseData.data });
//     }
// }

export function* getBuyingRoomRatesByHotelSaga(action) {
    console.log(action);
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_ACCOMODATION_URL}/roomBuyingRatesByHotelId/${action.data.id}`);
        yield put({ type: SUCCESS_GET_ROOM_BUYING_RATE_LIST_BY_HOTEL, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_ROOM_BUYING_RATE_LIST_BY_HOTEL, data: responseData.data });
    }
}

export function* clearRoomBuyingRateSaga() {
    yield put({ type: SUCCESS_CLEAR_ROOM_BUYING_RATE, data: null });
}
