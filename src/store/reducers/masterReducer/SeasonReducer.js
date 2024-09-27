import {
    ADD_SUCCESS_SEASON_DATA,
    ADD_FAILED_SEASON_DATA,
    SUCCESS_GET_SEASON_DATA_BY_ID,
    FAILED_GET_SEASON_DATA_BY_ID,
    SUCCESS_SEASON_LIST_DATA,
    FAILED_SEASON_LIST_DATA,
    UPDATE_FAILED_SEASON_DATA,
    UPDATE_SUCCESS_SEASON_DATA,
    SEASON_DUPLICATE,
    FAILED_LAST_MODIFIED_DATE_SEASON,
    SUCCESS_LAST_MODIFIED_DATE_SEASON,
    SUCCESS_ACTIVE_SEASON_LIST_DATA,
    FAILED_ACTIVE_SEASON_LIST_DATA,
    SUCCESS_ACTIVE_RATES_BY_SEASON_ID,
    FAILED_ACTIVE_RATES_BY_SEASON_ID
} from '../../constant/master/SeasonConstant';

const initialState = {
    season: null,
    seasons: [],
    seasonToUpdate: null,
    errorMsg: null,
    duplicateSeason: null,
    lastModifiedDateTime: null,
    activeSeasons: [],
    activeRatesBySeason: []
};

export const seasonReducer = (state = initialState, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case ADD_SUCCESS_SEASON_DATA:
            return { ...state, season: data.payload[0] };

        case ADD_FAILED_SEASON_DATA:
            return {
                ...state,
                season: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_GET_SEASON_DATA_BY_ID:
            return { ...state, seasonToUpdate: data.payload[0] };

        case FAILED_GET_SEASON_DATA_BY_ID:
            return {
                ...state,
                seasonToUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case UPDATE_SUCCESS_SEASON_DATA:
            return { ...state, season: data.payload[0] };

        case UPDATE_FAILED_SEASON_DATA:
            return {
                ...state,
                season: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_SEASON_LIST_DATA:
            return { ...state, seasons: data };

        case FAILED_SEASON_LIST_DATA:
            return { ...state, seasons: data };

        case SEASON_DUPLICATE:
            return { ...state, duplicateSeason: data };

        case SUCCESS_LAST_MODIFIED_DATE_SEASON:
            return { ...state, lastModifiedDateTime: data.payload[0].dateTime };

        case FAILED_LAST_MODIFIED_DATE_SEASON:
            return { ...state, lastModifiedDateTime: data };

        case SUCCESS_ACTIVE_SEASON_LIST_DATA:
            return { ...state, activeSeasons: data.payload[0] };

        case FAILED_ACTIVE_SEASON_LIST_DATA:
            return { ...state, activeSeasons: data.payload[0] };

        case SUCCESS_ACTIVE_RATES_BY_SEASON_ID:
            return { ...state, activeRatesBySeason: data.payload[0] };

        case FAILED_ACTIVE_RATES_BY_SEASON_ID:
            return { ...state, activeRatesBySeason: data.payload[0] };

        default:
            return state;
    }
};
