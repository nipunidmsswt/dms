import {
    ADD_FAILED_AGENT_DATA,
    ADD_SUCCESS_AGENT_DATA,
    FAILED_GET_ALL_AGENT_DATA,
    FAILED_GET_AGENT_DETAILS_BY_CODE,
    FAILED_GET_AGENT_LAST_MODIFIED_DATE_TIME,
    AGENT_CODE_DUPLICATE,
    SUCCESS_GET_ALL_ACTIVE_AGENT_DATA,
    SUCCESS_GET_ALL_AGENT_DATA,
    SUCCESS_GET_AGENT_DETAILS_BY_CODE,
    SUCCESS_GET_AGENT_LAST_MODIFIED_DATE_TIME,
    UPDATE_FAILED_AGENT_DATA,
    UPDATE_SUCCESS_AGENT_DATA,
    FAILED_GET_ALL_ACTIVE_AGENT_DATA
} from 'store/constant/master/AgentConstant';

const initialState = {
    agent: null,
    agentList: [],
    agentToUpdate: null,
    errorMsg: null,
    duplicateCodeType: null,
    duplicateCode: null,
    lastModifiedDateTime: null
};

export const agentReducer = (state = initialState, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case ADD_SUCCESS_AGENT_DATA:
            console.warn('ADD_SUCCESS_CODE_AND_NAME_DATA', action.payload);
            console.log(data.payload[0]);
            return { ...state, agent: data.payload[0] };

        case ADD_FAILED_AGENT_DATA:
            console.warn('ADD_FAILED_CODE_AND_NAME_DATA', action);
            console.log(data);
            return {
                ...state,
                agent: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_AGENT_DETAILS_BY_CODE:
            console.log(data.errorMessages);
            return { ...state, agentToUpdate: data };

        case FAILED_GET_AGENT_DETAILS_BY_CODE:
            return {
                ...state,
                agentToUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case UPDATE_SUCCESS_AGENT_DATA:
            return { ...state, agent: data.payload[0] };

        case UPDATE_FAILED_AGENT_DATA:
            return {
                ...state,
                agent: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_ALL_AGENT_DATA:
            return { ...state, agentList: data };

        case FAILED_GET_ALL_AGENT_DATA:
            return { ...state, agentList: data };

        case AGENT_CODE_DUPLICATE:
            return { ...state, duplicateCode: data };

        case SUCCESS_GET_AGENT_LAST_MODIFIED_DATE_TIME:
            return { ...state, lastModifiedDateTime: data.payload[0].dateTime };

        case FAILED_GET_AGENT_LAST_MODIFIED_DATE_TIME:
            return { ...state, lastModifiedDateTime: data };

        // case SUCCESS_GET_ALL_ACTIVE_AGENT_DATA:
        //     return { ...state, activeAgentList: data.payload[0] };

        // case FAILED_GET_ALL_ACTIVE_AGENT_DATA:
        //     return { ...state, activeAgentList: data.payload[0] };

        default:
            return state;
    }
};
