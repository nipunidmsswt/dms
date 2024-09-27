import {
    SAVE_SEASON_DATA,
    GET_ALL_SEASON_DATA,
    GET_SEASON_DATA_BY_ID,
    UPDATE_SEASON_DATA,
    CHECK_SEASON_DUPLICATE,
    GET_LAST_MODIFIED_DATE_TIME_SEASON,
    ACTIVE_SEASON_LIST_DATA,
    ACTIVE_RATES_BY_SEASON_ID
} from '../../constant/master/SeasonConstant';

export const saveSeasonData = (data) => {
    return {
        type: SAVE_SEASON_DATA,
        data
    };
};

export const getAllSeasonData = () => {
    return {
        type: GET_ALL_SEASON_DATA
    };
};

export const getLatestModifiedDetails = () => {
    return {
        type: GET_LAST_MODIFIED_DATE_TIME_SEASON
    };
};

export const getSeasonDataById = (id) => {
    return {
        type: GET_SEASON_DATA_BY_ID,
        data: { id }
    };
};

export const updateSeasonData = (data) => {
    return {
        type: UPDATE_SEASON_DATA,
        data
    };
};

export const checkDuplicateSeasonCode = (SeasonCode) => {
    return {
        type: CHECK_SEASON_DUPLICATE,
        data: { SeasonCode }
    };
};

export const activeSeasonsData = () => {
    return {
        type: ACTIVE_SEASON_LIST_DATA
    };
};

export const activeRatesSeasonId = (id) => {
    return {
        type: ACTIVE_RATES_BY_SEASON_ID,
        data: { id }
    };
};
