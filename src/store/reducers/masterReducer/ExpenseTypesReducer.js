import {
    ADD_FAILED_EXPENSE_TYPES,
    ADD_SUCCESS_EXPENSE_TYPES,
    EXPENSE_TYPES_CODE_DUPLICATE,
    FAILED_EXPENSE_TYPES_LAST_MODIFIED_DATE,
    FAILED_EXPENSE_TYPES_LIST_DATA,
    FAILED_GET_ALL_CURRENCY_LIST,
    FAILED_GET_EXPENSE_TYPES_BY_ID,
    SUCCESS_EXPENSE_TYPES_LAST_MODIFIED_DATE,
    SUCCESS_EXPENSE_TYPES_LIST_DATA,
    SUCCESS_GET_EXPENSE_TYPES_BY_ID,
    SUCESS_GET_ALL_CURRENCY_LIST,
    UPDATE_FAILED_EXPENSE_TYPES,
    UPDATE_SUCCESS_EXPENSE_TYPES,
    SUCCESS_ACTIVE_EXPENSE_TYPES_LIST_DATA,
    FAILED_ACTIVE_EXPENSE_TYPES_LIST_DATA,
    EXPENSE_TYPES_DESCRIPTION_DUPLICATE
} from 'store/constant/master/ExpenseTypesConstant';

const initialState = {
    expenseType: null,
    currencyList: [],
    expenseTypes: [],
    expenseTypeToUpdate: null,
    errorMsg: null,
    duplicateExpenseType: null,
    lastModifiedDateTime: null,
    activeExpenseTypes: [],
    duplicateExpenseDescription: null
};

export const expenseTypesReducer = (state = initialState, action) => {
    const { data } = action;
    switch (action.type) {
        case ADD_SUCCESS_EXPENSE_TYPES:
            return { ...state, expenseType: data.payload[0] };

        case ADD_FAILED_EXPENSE_TYPES:
            return {
                ...state,
                expenseType: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCCESS_EXPENSE_TYPES_LIST_DATA:
            return { ...state, expenseTypes: data.payload[0] };

        case FAILED_EXPENSE_TYPES_LIST_DATA:
            return { ...state, expenseTypes: data };

        case SUCCESS_GET_EXPENSE_TYPES_BY_ID:
            console.log(data.payload[0]);
            return { ...state, expenseTypeToUpdate: data.payload[0] };

        case FAILED_GET_EXPENSE_TYPES_BY_ID:
            console.warn('FAILED_GET_TAX_DATA_BY_ID', action);
            console.log(data);
            return {
                ...state,
                expenseTypeToUpdate: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case UPDATE_SUCCESS_EXPENSE_TYPES:
            console.log(data.payload[0]);
            console.warn('UPDATE_SUCCESS_TAX_DATA', action);
            console.log(data.payload[0]);
            return { ...state, expenseType: data.payload[0] };

        case UPDATE_FAILED_EXPENSE_TYPES:
            console.warn('UPDATE_FAILED_TAX_DATA', action);
            console.log(data);
            return {
                ...state,
                expenseType: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };

        case SUCESS_GET_ALL_CURRENCY_LIST:
            console.log(data.payload[0]);
            return { ...state, currencyList: data.payload[0] };

        case FAILED_GET_ALL_CURRENCY_LIST:
            console.log(data);
            return { ...state, currencyList: data };

        case EXPENSE_TYPES_CODE_DUPLICATE:
            return { ...state, duplicateExpenseType: data };

        case SUCCESS_EXPENSE_TYPES_LAST_MODIFIED_DATE:
            console.log('reducer:' + data.payload[0]);
            return { ...state, lastModifiedDateTime: data.payload[0].dateTime };

        case FAILED_EXPENSE_TYPES_LAST_MODIFIED_DATE:
            return { ...state, lastModifiedDateTime: data };

        case SUCCESS_ACTIVE_EXPENSE_TYPES_LIST_DATA:
            return { ...state, activeExpenseTypes: data.payload[0] };

        case FAILED_ACTIVE_EXPENSE_TYPES_LIST_DATA:
            return { ...state, activeExpenseTypes: data };

        case EXPENSE_TYPES_DESCRIPTION_DUPLICATE:
            return { ...state, duplicateExpenseDescription: data };
        default:
            return state;
    }
};
