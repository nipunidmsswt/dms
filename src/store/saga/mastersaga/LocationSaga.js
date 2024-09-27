import { put, call } from 'redux-saga/effects';
import { create, getById, updateWithUpload, get, createWithUpload, update } from '../../../apis/Apis';
import {
    ADD_SUCCESS_LOCATION_DATA,
    ADD_FAILED_LOCATION_DATA,
    UPDATE_SUCCESS_LOCATION_DATA,
    UPDATE_FAILED_LOCATION_DATA,
    SUCCESS_LOCATION_LIST_DATA,
    FAILED_LOCATION_LIST_DATA,
    SUCCESS_GET_LOCATION_DATA_BY_ID,
    FAILED_GET_LOCATION_DATA_BY_ID,
    CHECK_LOCATION_DUPLICATE,
    SUCCESS_LAST_MODIFIED_DATE_LOCATION,
    FAILED_LAST_MODIFIED_DATE_LOCATION,
    SUCCESS_GET_ACTIVE_LOCATIONS,
    FAILED_GET_ACTIVE_LOCATIONS
} from '../../constant/master/LocationConstant';

//location saga

export function* saveLocationSaga(action) {
    action.data.path = `${process.env.REACT_APP_ACCOMODATION_URL}/location/`;
    let responseData = [];
    let responseData2 = [];

    try {
        responseData = yield call(create, action.data);
        console.log(responseData);
        if (responseData.data.errorMessages.length === 0) {
            let formData = new FormData();
            console.log(action.data.files);
            if (action.data.files.length !== 0) {
                console.log('in side gdywetwytwu');

                formData.append(`id`, responseData.data.payload[0].Location.location_id);
                if (action.data.files != undefined) {
                    for (let i = 0; i < action.data.files.length; i++) {
                        formData.append(`files`, action.data.files[i]);
                    }
                }
                const requestOptions = {
                    method: 'POST',
                    body: formData
                };
                requestOptions.path = `${process.env.REACT_APP_ACCOMODATION_URL}/location/locationImg/`;
                responseData2 = yield call(createWithUpload, requestOptions);
                console.log(responseData2);
                if (responseData2.status == 201 || responseData2.status == 200) {
                    console.log('responseData2');
                    yield put({ type: ADD_SUCCESS_LOCATION_DATA, data: responseData.data });
                } else {
                    yield put({ type: ADD_FAILED_LOCATION_DATA, data: 'error' });
                }
            } else {
                yield put({ type: ADD_SUCCESS_LOCATION_DATA, data: responseData.data });
            }
        }
    } catch (e) {
        yield put({ type: ADD_FAILED_LOCATION_DATA, data: 'error' });
    }
}

export function* getLocationByIdSaga(action) {
    console.log('getTaxByIdSaga tax saga');
    console.log(action);

    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_ACCOMODATION_URL}/location/${action.data.id}`);
        console.log(responseData);
        yield put({ type: SUCCESS_GET_LOCATION_DATA_BY_ID, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: FAILED_GET_LOCATION_DATA_BY_ID, data: responseData.data });
    }
}

export function* updateLocationSaga(action) {
    console.log('updateTaxSaga tax saga');
    console.log(action);
    action.data.path = `${process.env.REACT_APP_ACCOMODATION_URL}/location/`;
    let responseData = [];
    let responseData2 = [];
    try {
        responseData = yield call(update, action.data);
        console.log(responseData);
        if (responseData.data.errorMessages.length === 0) {
            console.log('in side hfcsfsek');
            let formData = new FormData();
            console.log(action.data.files);
            if (action.data.files.length !== 0) {
                console.log('in side gdywetwytwu');
                // formData.append(`files`, JSON.stringify(action.data.files));
                formData.append(`id`, responseData.data.payload[0].UpdateLocation.location_id);
                if (action.data.files != undefined) {
                    for (let i = 0; i < action.data.files.length; i++) {
                        formData.append(`files`, action.data.files[i]);
                    }
                }
                const requestOptions = {
                    method: 'POST',
                    body: formData
                };
                requestOptions.path = `${process.env.REACT_APP_ACCOMODATION_URL}/location/locationImg/`;
                responseData2 = yield call(createWithUpload, requestOptions);
                console.log(responseData2);
                if (responseData2.status == 201 || responseData2.status == 200) {
                    console.log('responseData2');
                    yield put({ type: UPDATE_SUCCESS_LOCATION_DATA, data: responseData.data });
                } else {
                    yield put({ type: UPDATE_FAILED_LOCATION_DATA, data: 'error' });
                }
            } else {
                yield put({ type: UPDATE_SUCCESS_LOCATION_DATA, data: responseData.data });
            }
        }
    } catch (e) {
        console.log(e);
        yield put({ type: UPDATE_FAILED_LOCATION_DATA, data: responseData.data });
    }
}

export function* getAllLocatonSaga() {
    let responseData = [];

    try {
        responseData = yield call(get, process.env.REACT_APP_ACCOMODATION_URL + '/location/');
        console.log(responseData.data.payload);
        yield put({ type: SUCCESS_LOCATION_LIST_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: FAILED_LOCATION_LIST_DATA, data: responseData.data });
    }
}

export function* checkDupicateLocationSaga(action) {
    console.log('checkDupicateTaxCodeSaga tax saga');
    console.log(action);

    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_ACCOMODATION_URL}/taxCodeCheck/${action.data.taxCode}`);
        console.log(responseData);
        yield put({ type: CHECK_LOCATION_DUPLICATE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: CHECK_LOCATION_DUPLICATE, data: responseData });
    }
}

export function* checkLatestLocationModifiedDateSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_ACCOMODATION_URL}/location/lastModifiedTime`);
        console.log('response data last:' + responseData);
        yield put({ type: SUCCESS_LAST_MODIFIED_DATE_LOCATION, data: responseData.data });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_LAST_MODIFIED_DATE_LOCATION, data: '' });
    }
}

export function* getAllActiveLocations() {
    let responseData = [];

    try {
        responseData = yield call(get, process.env.REACT_APP_ACCOMODATION_URL + '/location/activeLocationDetails');
        console.log(responseData.data.payload);
        yield put({ type: SUCCESS_GET_ACTIVE_LOCATIONS, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: FAILED_GET_ACTIVE_LOCATIONS, data: responseData.data });
    }
}
