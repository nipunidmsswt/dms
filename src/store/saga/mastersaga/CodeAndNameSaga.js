import {
    ADD_FAILED_CODE_AND_NAME_DATA,
    ADD_SUCCESS_CODE_AND_NAME_DATA,
    CODE_DUPLICATE,
    CODE_TYPE_DUPLICATE,
    FAILED_ALL_CLUSTER_TYPE_DATA,
    FAILED_ALL_CODE_AND_NAME_DATA,
    FAILED_CODE_LAST_MODIFIED_DATE,
    FAILED_GET_ALL_OPERATOR_DATA,
    FAILED_GET_CODE_NAME_DATA_BY_CODE,
    FAILED_GET_CODE_NAME_DATA_BY_TYPE,
    FAILED_GET_DATA_TO_TABLE_VIEW,
    FAILED_GET_EXISITING_MARKETCODE_FOR_CLUSTER,
    FAILED_GET_EXISITING_OPERATOR_CODE_FOR_MARKET,
    FAILED_SAVE_CLUSTER_MARKET_MAPPING_DATA,
    FAILED_SAVE_MARKET_OPERATOR_MAPPING_DATA,
    SUCCESS_ALL_CLUSTER_TYPE_DATA,
    SUCCESS_ALL_CODE_AND_NAME_DATA,
    SUCCESS_CODE_LAST_MODIFIED_DATE,
    SUCCESS_GET_ALL_OPERATOR_DATA,
    SUCCESS_GET_CODE_NAME_DATA_BY_CODE,
    SUCCESS_GET_CODE_NAME_DATA_BY_TYPE,
    SUCCESS_GET_DATA_TO_TABLE_VIEW,
    SUCCESS_GET_EXISITING_MARKETCODE_FOR_CLUSTER,
    SUCCESS_GET_EXISITING_OPERATOR_CODE_FOR_MARKET,
    SUCCESS_SAVE_CLUSTER_MARKET_MAPPING_DATA,
    SUCCESS_SAVE_MARKET_OPERATOR_MAPPING_DATA,
    SUCESS_SAVE_CLUSTER_MARKET_MAPPING_DATA,
    UPDATE_FAILED_CODE_AND_NAME_DATA,
    UPDATE_SUCCESS_CODE_AND_NAME_DATA
} from 'store/constant/master/CodeAndNameConstant';
import { put, takeEvery, call } from 'redux-saga/effects';
import { create, get, getById, update } from 'apis/Apis';

export function* saveCodeAndNameDataHandler(action) {
    console.log(action.data);
    action.data.path = `${process.env.REACT_APP_OPERATOR_URL}/codeAndName/`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        yield put({
            type: ADD_SUCCESS_CODE_AND_NAME_DATA,
            data: responseData.data
        });
    } catch (e) {
        yield put({ type: ADD_FAILED_CODE_AND_NAME_DATA, data: responseData.data });
    }
}

export function* saveClusterAndMarketMappingDataSaga(action) {
    action.data.path = `${process.env.REACT_APP_OPERATOR_URL}/codeAndName/clusterMarketMapping/`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        yield put({
            type: SUCCESS_SAVE_CLUSTER_MARKET_MAPPING_DATA,
            data: responseData.data
        });
    } catch (e) {
        yield put({ type: FAILED_SAVE_CLUSTER_MARKET_MAPPING_DATA, data: responseData.data });
    }
}

export function* saveOperatorAndMarketMappingDataSaga(action) {
    action.data.path = `${process.env.REACT_APP_OPERATOR_URL}/codeAndName/marketOperatorMapping/`;
    let responseData = [];
    try {
        responseData = yield call(create, action.data);
        yield put({
            type: SUCCESS_SAVE_MARKET_OPERATOR_MAPPING_DATA,
            data: responseData.data
        });
    } catch (e) {
        yield put({ type: FAILED_SAVE_MARKET_OPERATOR_MAPPING_DATA, data: responseData.data });
    }
}

export function* getAllCodeAndNameSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_OPERATOR_URL}/codeAndName/`);
        yield put({ type: SUCCESS_ALL_CODE_AND_NAME_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_ALL_CODE_AND_NAME_DATA, data: responseData.data });
    }
}

export function* getAllClusterTypeData() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_OPERATOR_URL}/codeAndName/clusterTypes`);
        yield put({ type: SUCCESS_ALL_CLUSTER_TYPE_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_ALL_CLUSTER_TYPE_DATA, data: responseData.data });
    }
}

export function* getAllActiveOperatorSaga() {
    let responseData = [];
    try {
        responseData = yield call(get, `${process.env.REACT_APP_OPERATOR_URL}/codeAndName/operatorTypes`);
        yield put({ type: SUCCESS_GET_ALL_OPERATOR_DATA, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_ALL_OPERATOR_DATA, data: responseData.data });
    }
}

export function* getCodeAndNameByCodeSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_OPERATOR_URL}/codeAndName/${action.data.id}`);
        console.log('response data:' + responseData);
        yield put({ type: SUCCESS_GET_CODE_NAME_DATA_BY_CODE, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_CODE_NAME_DATA_BY_CODE, data: responseData.data });
    }
}

export function* getExisitngMarketCodesForCluster(action) {
    let responseData = [];
    try {
        responseData = yield call(
            getById,
            `${process.env.REACT_APP_OPERATOR_URL}/codeAndName/allMarketForCluster/${action.data.clusterId}`
        );
        yield put({ type: SUCCESS_GET_EXISITING_MARKETCODE_FOR_CLUSTER, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_EXISITING_MARKETCODE_FOR_CLUSTER, data: responseData.data });
    }
}

export function* getExisitngOperatorCodesForMarketSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(
            getById,
            `${process.env.REACT_APP_OPERATOR_URL}/codeAndName/allOperatorForMarket/${action.data.marketId}`
        );
        yield put({ type: SUCCESS_GET_EXISITING_OPERATOR_CODE_FOR_MARKET, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_EXISITING_OPERATOR_CODE_FOR_MARKET, data: responseData.data });
    }
}

export function* getAllCodeAndNameByTypeSaga(action) {
    console.log(action.data.type);
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_OPERATOR_URL}/codeAndName/codeAndNameDetails/${action.data.type}`);
        console.log('response data:' + responseData);
        yield put({ type: SUCCESS_GET_CODE_NAME_DATA_BY_TYPE, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_CODE_NAME_DATA_BY_TYPE, data: responseData.data });
    }
}

export function* updateCodeAndNameDataSaga(action) {
    action.data.path = `${process.env.REACT_APP_OPERATOR_URL}/codeAndName/${action.data.codeAndNameDetails[0].code}`;
    let responseData = [];
    try {
        responseData = yield call(update, action.data);

        yield put({
            type: UPDATE_SUCCESS_CODE_AND_NAME_DATA,
            data: responseData.data
        });
    } catch (e) {
        console.log(e);
        yield put({
            type: UPDATE_FAILED_CODE_AND_NAME_DATA,
            data: responseData.data
        });
    }
}

export function* checkDupicateCodeTypeSaga(action) {
    console.log('checkDupicateCodeTypeSaga');
    console.log(action);

    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_OPERATOR_URL}/codeAndName/codeTypeDuplicate/${action.data}`);
        console.log(responseData);
        yield put({ type: CODE_TYPE_DUPLICATE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: CODE_TYPE_DUPLICATE, data: responseData });
    }
}

export function* checkDupicateCodeSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(getById, `${process.env.REACT_APP_OPERATOR_URL}/codeAndName/codeDuplicate/${action.data}`);
        console.log(responseData);
        yield put({ type: CODE_DUPLICATE, data: responseData.data });
    } catch (e) {
        console.log(responseData);
        yield put({ type: CODE_DUPLICATE, data: responseData });
    }
}

export function* checkCodeLatestModifiedDateSaga() {
    console.log('latest date');
    let responseData = [];
    // action.data.path = `/product`;
    try {
        responseData = yield call(get, `${process.env.REACT_APP_OPERATOR_URL}/codeAndName/lastModifiedTime`);
        yield put({
            type: SUCCESS_CODE_LAST_MODIFIED_DATE,
            data: responseData.data
        });
    } catch (e) {
        console.log('Error:' + e);
        yield put({ type: FAILED_CODE_LAST_MODIFIED_DATE, data: '' });
    }
}

export function* getExisitngDataToTableSaga(action) {
    let responseData = [];
    try {
        responseData = yield call(
            getById,
            `${process.env.REACT_APP_OPERATOR_URL}/codeAndName/allMarketAndOperatorForCluster/${action.data.clusterId}`
        );
        console.log(responseData.data);
        yield put({ type: SUCCESS_GET_DATA_TO_TABLE_VIEW, data: responseData.data });
    } catch (e) {
        yield put({ type: FAILED_GET_DATA_TO_TABLE_VIEW, data: responseData.data });
    }
}
