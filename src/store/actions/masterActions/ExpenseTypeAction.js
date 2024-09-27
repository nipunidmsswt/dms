import {
    CHECK_EXPENSE_TYPES_CODE_DUPLICATE,
    GET_ALL_CURRENCY_LIST,
    GET_ALL_EXPENSE_TYPES,
    GET_EXPENSE_TYPES_BY_ID,
    GET_EXPENSE_TYPES_LAST_MODIFIED_DATE_TIME,
    SAVE_EXPENSE_TYPES,
    UPDATE_EXPENSE_TYPES,
    GET_ALL_ACTIVE_EXPENSE_TYPES,
    CHECK_EXPENSE_TYPES_DESCRIPTION_DUPLICATE
} from 'store/constant/master/ExpenseTypesConstant';

export const getAllCurrencyListData = (data) => {
    return {
        type: GET_ALL_CURRENCY_LIST,
        data
    };
};

export const saveExpenseTypesData = (data) => {
    return {
        type: SAVE_EXPENSE_TYPES,
        data
    };
};

export const getAllExpenseTypesData = () => {
    return {
        type: GET_ALL_EXPENSE_TYPES
    };
};

export const getExpenseTypesById = (id) => {
    return {
        type: GET_EXPENSE_TYPES_BY_ID,
        data: { id }
    };
};

export const updateExpenseTypesData = (data) => {
    return {
        type: UPDATE_EXPENSE_TYPES,
        data
    };
};

export const getLatestModifiedDetailsExpenseRates = () => {
    return {
        type: GET_EXPENSE_TYPES_LAST_MODIFIED_DATE_TIME
    };
};

export const checkDuplicateExpenseRateCode = (code) => {
    return {
        type: CHECK_EXPENSE_TYPES_CODE_DUPLICATE,
        data: { code }
    };
};

export const getAllActiveExpenseTypesData = () => {
    return {
        type: GET_ALL_ACTIVE_EXPENSE_TYPES
    };
};

export const checkDuplicateExpenseRateDescription = (code) => {
    return {
        type: CHECK_EXPENSE_TYPES_DESCRIPTION_DUPLICATE,
        data: { code }
    };
};
