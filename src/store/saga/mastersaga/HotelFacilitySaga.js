import { put, call } from 'redux-saga/effects';
import { create, getById, get, update } from '../../../apis/Apis';
import {
    ADD_SUCCESS_HOTEL_FACILITY_DATA,
    ADD_FAILED_HOTEL_FACILITY_DATA,
    UPDATE_SUCCESS_HOTEL_FACILITY_DATA,
    UPDATE_FAILED_HOTEL_FACILITY_DATA,
    SUCCESS_HOTEL_FACILITY_LIST_DATA,
    FAILED_HOTEL_FACILITY_LIST_DATA,
    SUCCESS_GET_HOTEL_FACILITY_DATA_BY_ID,
    FAILED_GET_HOTEL_FACILITY_DATA_BY_ID,
    CHECK_HOTEL_FACILITY_DUPLICATE,
    SUCCESS_LAST_MODIFIED_DATE_HOTEL_FACILITY,
    FAILED_LAST_MODIFIED_DATE_HOTEL_FACILITY,
    SUCCESS_HOTEL_FACILITY_TYPES_LIST_DATA,
    FAILED_HOTEL_FACILITY_TYPES_LIST_DATA,
    HOTEL_FACILITY_DUPLICATE,
    SUCCESS_ACTIVE_ROOM_RECREATION_LIST_DATA,
    FAILED_ACTIVE_ROOM_RECREATION_LIST_DATA,
    SUCCESS_ACTIVE_FACILITIES_OFFERED_LIST_DATA,
    FAILED_ACTIVE_FACILITIES_OFFERED_LIST_DATA,
    SUCCESS_ACTIVE_CHILDREN_FACILITIES_LIST_DATA,
    FAILED_ACTIVE_CHILDREN_FACILITIES_LIST_DATA,
    FAILED_ACTIVE_SERVICE_OFFERED_LIST_DATA,
    SUCCESS_ACTIVE_SERVICE_OFFERED_LIST_DATA
} from '../../constant/master/HotelFacilityConstant';

//hotel facility saga

export function* saveHotelFacilitySaga(action) {
    action.data.path = `${process.env.REACT_APP_ACCOMODATION_URL}/hotelfacility/`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        console.log(responseData.data.payload);

        yield put({
            type: ADD_SUCCESS_HOTEL_FACILITY_DATA,
            data: responseData.data
        });
    } catch (e) {
        yield put({
            type: ADD_FAILED_HOTEL_FACILITY_DATA,
            data: responseData.data
        });
    }
}

export function* getFacilityByIdSaga(action) {
    console.log('getFacilityByIdSaga saga');
    console.log(action);

    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_ACCOMODATION_URL}/hotelfacility/${action.data.id}`);
        console.log(responseData);
        yield put({
            type: SUCCESS_GET_HOTEL_FACILITY_DATA_BY_ID,
            data: responseData.data
        });
    } catch (e) {
        console.log(e);
        yield put({
            type: FAILED_GET_HOTEL_FACILITY_DATA_BY_ID,
            data: responseData.data
        });
    }
}

export function* updateHotelFacilitySaga(action) {
    console.log('updateSeasonSaga tax saga');
    console.log(action);

    action.data.path = `${process.env.REACT_APP_ACCOMODATION_URL}/hotelfacility/${action.data.hotelFacilityId}`;
    let responseData = [];
    try {
        responseData = yield call(update, action.data);
        console.log(responseData);
        yield put({
            type: UPDATE_SUCCESS_HOTEL_FACILITY_DATA,
            data: responseData.data
        });
    } catch (e) {
        console.log(e);
        yield put({
            type: UPDATE_FAILED_HOTEL_FACILITY_DATA,
            data: responseData.data
        });
    }
}

export function* getAllHotelFacilitySaga() {
    let responseData = [];

    try {
        responseData = yield call(get, process.env.REACT_APP_ACCOMODATION_URL + '/hotelfacility/');
        console.log(responseData.data.payload);
        yield put({
            type: SUCCESS_HOTEL_FACILITY_LIST_DATA,
            data: responseData.data
        });
    } catch (e) {
        console.log(e);
        yield put({
            type: FAILED_HOTEL_FACILITY_LIST_DATA,
            data: responseData.data
        });
    }
}

export function* checkDupicateHotelFacilitySaga(action) {
    console.log(action);

    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_ACCOMODATION_URL}/hotelfacility/hotelFacilityCheck/{code}`);
        console.log(responseData);
        yield put({
            type: HOTEL_FACILITY_DUPLICATE,
            data: responseData.data
        });
    } catch (e) {
        console.log(responseData);
        yield put({ type: HOTEL_FACILITY_DUPLICATE, data: responseData });
    }
}

export function* checkLatestHotelFacilityModifiedDateSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_ACCOMODATION_URL}/season/lastModifiedTime`);
        console.log('response data last:' + responseData);
        yield put({
            type: SUCCESS_LAST_MODIFIED_DATE_HOTEL_FACILITY,
            data: responseData.data
        });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_LAST_MODIFIED_DATE_HOTEL_FACILITY, data: '' });
    }
}

//hotel facility types
export function* getAllHotelFacilityTypesSaga() {
    let responseData = [];

    try {
        responseData = yield call(get, process.env.REACT_APP_ACCOMODATION_URL + '/hotelfacilitytypes/');
        console.log(responseData.data.payload);
        yield put({
            type: SUCCESS_HOTEL_FACILITY_TYPES_LIST_DATA,
            data: responseData.data
        });
    } catch (e) {
        console.log(e);
        yield put({
            type: FAILED_HOTEL_FACILITY_TYPES_LIST_DATA,
            data: responseData.data
        });
    }
}

export function* getAllActiveRoomRecreationSaga() {
    let responseData = [];

    try {
        responseData = yield call(get, process.env.REACT_APP_ACCOMODATION_URL + '/hotelfacility/reCreation');
        console.log(responseData.data.payload);
        yield put({
            type: SUCCESS_ACTIVE_ROOM_RECREATION_LIST_DATA,
            data: responseData.data
        });
    } catch (e) {
        console.log(e);
        yield put({
            type: FAILED_ACTIVE_ROOM_RECREATION_LIST_DATA,
            data: responseData.data
        });
    }
}

export function* getAllActiveFacilitiesOfferedSaga() {
    let responseData = [];

    try {
        responseData = yield call(get, process.env.REACT_APP_ACCOMODATION_URL + '/hotelfacility/facilityOffered');
        console.log(responseData.data.payload);
        yield put({
            type: SUCCESS_ACTIVE_FACILITIES_OFFERED_LIST_DATA,
            data: responseData.data
        });
    } catch (e) {
        console.log(e);
        yield put({
            type: FAILED_ACTIVE_FACILITIES_OFFERED_LIST_DATA,
            data: responseData.data
        });
    }
}

export function* getAllActiveChildrenFacilitiesSaga() {
    let responseData = [];

    try {
        responseData = yield call(get, process.env.REACT_APP_ACCOMODATION_URL + '/hotelfacility/childrenFacilities');
        console.log(responseData.data.payload);
        yield put({
            type: SUCCESS_ACTIVE_CHILDREN_FACILITIES_LIST_DATA,
            data: responseData.data
        });
    } catch (e) {
        console.log(e);
        yield put({
            type: FAILED_ACTIVE_CHILDREN_FACILITIES_LIST_DATA,
            data: responseData.data
        });
    }
}

export function* getAllActiveServiceOfferedSaga() {
    let responseData = [];

    try {
        responseData = yield call(get, process.env.REACT_APP_ACCOMODATION_URL + '/hotelfacility/serviceOffered');
        console.log(responseData.data.payload);
        yield put({
            type: SUCCESS_ACTIVE_SERVICE_OFFERED_LIST_DATA,
            data: responseData.data
        });
    } catch (e) {
        console.log(e);
        yield put({
            type: FAILED_ACTIVE_SERVICE_OFFERED_LIST_DATA,
            data: responseData.data
        });
    }
}
