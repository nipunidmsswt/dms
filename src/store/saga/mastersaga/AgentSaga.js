import { put, takeEvery, call } from 'redux-saga/effects';
import { create, getById, update, get } from '../../../apis/Apis';
import {
    ADD_FAILED_AGENT_DATA,
    ADD_SUCCESS_AGENT_DATA,
    FAILED_GET_ALL_ACTIVE_AGENT_DATA,
    FAILED_GET_ALL_AGENT_DATA,
    FAILED_GET_AGENT_DETAILS_BY_CODE,
    FAILED_GET_AGENT_LAST_MODIFIED_DATE_TIME,
    AGENT_CODE_DUPLICATE,
    SUCCESS_GET_ALL_ACTIVE_AGENT_DATA,
    SUCCESS_GET_ALL_AGENT_DATA,
    SUCCESS_GET_AGENT_DETAILS_BY_CODE,
    SUCCESS_GET_AGENT_LAST_MODIFIED_DATE_TIME,
    UPDATE_FAILED_AGENT_DATA,
    UPDATE_SUCCESS_AGENT_DATA
} from 'store/constant/master/AgentConstant';

export function* saveAgentDataHandler(action) {
    console.log(action.data);
    action.data.path = `${process.env.REACT_APP_OPERATOR_URL}/agent`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        console.log(responseData);
        yield put({ type: ADD_SUCCESS_AGENT_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: ADD_FAILED_AGENT_DATA, data: responseData.data });
    }
}

export function* getAllAgentDataSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_OPERATOR_URL}/Agent/`);
        yield put({ type: SUCCESS_GET_ALL_AGENT_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_ALL_AGENT_DATA, data: responseData.data });
    }
}

export function* getAgentDetailsByCodeSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(
            getById,
            `${process.env.REACT_APP_OPERATOR_URL}/agent/${action.data.operatorCode}/${action.data.marketCode}`
        );
        console.log('response data:' + responseData);
        yield put({ type: SUCCESS_GET_AGENT_DETAILS_BY_CODE, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_AGENT_DETAILS_BY_CODE, data: responseData.data });
    }
}

export function* updateAgentDataSaga(action) {
    action.data.path = `${process.env.REACT_APP_OPERATOR_URL}/agent`;
    let responseData = [];
    try {
        responseData = yield call(update, action.data);

        yield put({ type: UPDATE_SUCCESS_AGENT_DATA, data: responseData.data });
    } catch (e) {
        console.log(e);
        yield put({ type: UPDATE_FAILED_AGENT_DATA, data: responseData.data });
    }
}

export function* checkAgentDupicateCodeSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_OPERATOR_URL}/Agent/codeDuplicate/${action.data}`);
        console.log(responseData);
        yield put({ type: AGENT_CODE_DUPLICATE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: AGENT_CODE_DUPLICATE, data: responseData });
    }
}

export function* getAgentLatestModifiedDateSaga() {
    console.log('latest date');
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_OPERATOR_URL}/Agent/lastModifiedTime`);
        yield put({
            type: SUCCESS_GET_AGENT_LAST_MODIFIED_DATE_TIME,
            data: responseData.data
        });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_GET_AGENT_LAST_MODIFIED_DATE_TIME, data: '' });
    }
}

export function* getAllActiveAgentDataSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_OPERATOR_URL}/Agent/active`);
        yield put({ type: SUCCESS_GET_ALL_ACTIVE_AGENT_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_ALL_ACTIVE_AGENT_DATA, data: responseData.data });
    }
}
