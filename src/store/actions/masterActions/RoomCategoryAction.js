import {
    CHECK_ROOM_CATEGORY_CODE_DUPLICATE,
    GET_ALL_ROOM_CATEGORY,
    GET_ROOM_CATEGORY_BY_ID,
    GET_ROOM_CATEGORY_LAST_MODIFIED_DATE_TIME,
    SAVE_ROOM_CATEGORY,
    UPDATE_ROOM_CATEGORY,
    GET_ACTIVE_ROOM_CATEGORY
} from '../../constant/master/RoomCategoryConstant';

export const saveRoomCategoryData = (data) => {
    return {
        type: SAVE_ROOM_CATEGORY,
        data
    };
};

export const getAllRoomCategoryData = () => {
    return {
        type: GET_ALL_ROOM_CATEGORY
    };
};

export const getRoomCategoryDataById = (id) => {
    return {
        type: GET_ROOM_CATEGORY_BY_ID,
        data: { id }
    };
};

export const updateRoomCategoryData = (data) => {
    return {
        type: UPDATE_ROOM_CATEGORY,
        data
    };
};

export const getRoomCategoryLatestModifiedDetails = () => {
    return {
        type: GET_ROOM_CATEGORY_LAST_MODIFIED_DATE_TIME
    };
};

export const checkDuplicateRoomCategoryCodee = (RoomCategoryCode) => {
    return {
        type: CHECK_ROOM_CATEGORY_CODE_DUPLICATE,
        data: { RoomCategoryCode }
    };
};

export const getActiveRoomcategory = () => {
    return {
        type: GET_ACTIVE_ROOM_CATEGORY
    };
};
