import {
    SAVE_AGENT_DATA,
    CHECK_AGENT_CODE_DUPLICATE,
    GET_ALL_ACTIVE_AGENT_DATA,
    GET_ALL_AGENT_DATA,
    GET_AGENT_DETAILS_BY_CODE,
    GET_AGENT_LAST_MODIFIED_DATE_TIME,
    UPDATE_AGENT_DATA
} from 'store/constant/master/AgentConstant';

export const saveAgentData = (data) => {
    console.log('saveAgentData action s called', data);
    return {
        type: SAVE_AGENT_DATA,
        data
    };
};

export const getAllAgentData = () => {
    return {
        type: GET_ALL_AGENT_DATA
    };
};

export const getAgentDetailsByCode = (id) => {
    console.log('action:' + id);
    return {
        type: GET_AGENT_DETAILS_BY_CODE,
        data: { id }
    };
};

export const getAgentDetailsByMarketCodeAndOperatorCode = (operatorCode, marketCode) => {
    return {
        type: GET_AGENT_DETAILS_BY_CODE,
        data: { operatorCode, marketCode }
    };
};

export const updateAgentData = (data) => {
    return {
        type: UPDATE_AGENT_DATA,
        data
    };
};

export const checkDuplicateAgentsCode = (data) => {
    return {
        type: CHECK_AGENT_CODE_DUPLICATE,
        data: data
    };
};

export const getLatestModifiedDetails = () => {
    return {
        type: GET_AGENT_LAST_MODIFIED_DATE_TIME
    };
};

export const getAllActiveAgentData = () => {
    return {
        type: GET_ALL_ACTIVE_AGENT_DATA
    };
};
