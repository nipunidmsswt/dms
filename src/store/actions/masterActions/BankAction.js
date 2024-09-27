import {
    SAVE_BANK_DATA,
    SAVE_BANK_DETAILS_DATA,
    SAVE_BRANCH_DATA,
    GET_ALL_BANK_DATA,
    GET_ALL_BRANCH_DATA,
    GET_ALL_BANK_DETAILS_DATA,
    GET_BANK_DETAILS_DATA_BY_ID,
    GET_BRANCH_DATA_BY_ID,
    UPDATE_BRANCH_DATA,
    UPDATE_BANK_DETAILS_DATA,
    CHECK_BANK_DETAILS_DUPLICATE,
    CHECK_BANK_DUPLICATE,
    CHECK_BRANCH_DUPLICATE,
    GET_LAST_MODIFIED_DATE_TIME_BANK,
    GET_LAST_MODIFIED_DATE_TIME_BRANCH,
    GET_LAST_MODIFIED_DATE_TIME_BANK_DETAILS,
    GET_BRANCHES_BY_BANK_ID,
    CHECKED_SAVED_BANK_AND_BRANCH
} from '../../constant/master/BankConstant';

// bank actions
export const saveBankData = (data) => {
    return {
        type: SAVE_BANK_DATA,
        data
    };
};

export const getAllbankData = () => {
    return {
        type: GET_ALL_BANK_DATA
    };
};

export const getLatestModifiedBankDetails = () => {
    return {
        type: GET_LAST_MODIFIED_DATE_TIME_BANK
    };
};

export const checkDuplicatebankBankCode = (code) => {
    return {
        type: CHECK_BANK_DUPLICATE,
        data: { code }
    };
};

// branch actions

export const saveBranchData = (data) => {
    return {
        type: SAVE_BRANCH_DATA,
        data
    };
};

export const getAllBranchData = () => {
    return {
        type: GET_ALL_BRANCH_DATA
    };
};

export const getLatestModifiedBranchDetails = () => {
    return {
        type: GET_LAST_MODIFIED_DATE_TIME_BRANCH
    };
};

export const getBranchDataById = (id) => {
    return {
        type: GET_BRANCH_DATA_BY_ID,
        data: { id }
    };
};

export const updateBranchData = (data) => {
    return {
        type: UPDATE_BRANCH_DATA,
        data
    };
};

export const checkDuplicateBranchCode = (code) => {
    return {
        type: CHECK_BRANCH_DUPLICATE,
        data: { code }
    };
};

export const getBranchesByBankId = (id) => {
    return {
        type: GET_BRANCHES_BY_BANK_ID,
        id
    };
};

export const checkedSavedBankandBranch = (data) => {
    return {
        type: CHECKED_SAVED_BANK_AND_BRANCH,
        data
    };
};

// bank details

export const saveBankDetailsData = (data) => {
    return {
        type: SAVE_BANK_DETAILS_DATA,
        data
    };
};

export const getAllBankDetailsData = () => {
    return {
        type: GET_ALL_BANK_DETAILS_DATA
    };
};

export const getLatestModifiedDetails = () => {
    return {
        type: GET_LAST_MODIFIED_DATE_TIME_BANK_DETAILS
    };
};

export const getBankDetailsDataById = (id) => {
    return {
        type: GET_BANK_DETAILS_DATA_BY_ID,
        data: { id }
    };
};

export const updateBankDetailsData = (data) => {
    return {
        type: UPDATE_BANK_DETAILS_DATA,
        data
    };
};

export const checkDuplicateBankDetailsCode = (code) => {
    return {
        type: CHECK_BANK_DETAILS_DUPLICATE,
        data: { code }
    };
};
