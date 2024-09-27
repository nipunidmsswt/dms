import {
    ADD_SUCCESS_BANK_DATA,
    ADD_FAILED_BANK_DATA,
    SUCCESS_BANK_LIST_DATA,
    FAILED_BANK_LIST_DATA,
    BANK_DUPLICATE
} from '../../constant/master/BankConstant';

const initialState = {
    bank: null,
    bankList: [],
    errorMsg: null,
    duplicateBank: null,
    lastModifiedDateTime: null
};

export const bankReducer = (state = initialState, action) => {
    const { data } = action;
    console.log(data);
    switch (action.type) {
        case ADD_SUCCESS_BANK_DATA:
            return { ...state, bank: data };

        case ADD_FAILED_BANK_DATA:
            return {
                ...state,
                bank: null,
                errorMsg: data ? data.errorMessages : 'netwok error'
            };
        case SUCCESS_BANK_LIST_DATA:
            return { ...state, bankList: data };

        case FAILED_BANK_LIST_DATA:
            return { ...state, bankList: data };

        case BANK_DUPLICATE:
            return { ...state, duplicateBank: data };

        default:
            return state;
    }
};
