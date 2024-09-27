import { takeLatest } from 'redux-saga/effects';

import {
    saveTaxSaga,
    getTaxByIdSaga,
    getAllTaxSaga,
    updateTaxSaga,
    checkDupicateTaxCodeSaga,
    saveTaxGroupSaga,
    getAllTaxGroupSaga,
    getTaxGroupByIdSaga,
    updateTaxGroupSaga,
    checkDupicateTaxGroupCodeSaga,
    checkLatestTaxModifiedDateSaga,
    checkLatestTaxGrupModifiedDateSaga,
    getTaxByUniqueIdSaga,
    getAllActiveTaxGroups,
    getAllActiveTaxGroupsandTaxes
} from './mastersaga/TaxSaga';
import {
    SAVE_TAX_DATA,
    GET_TAX_DATA_BY_ID,
    GET_ALL_TAX_DATA,
    UPDATE_TAX_DATA,
    CHECK_TAX_DUPLICATE,
    SAVE_TAX_GROUP_DATA,
    GET_ALL_TAX_GROUP_DATA,
    GET_TAX_GROUP_DATA_BY_ID,
    UPDATE_TAX_GROUP_DATA,
    CHECK_TAX_GROUP_DUPLICATE,
    GET_LAST_MODIFIED_DATE_TIME_TAX,
    GET_LAST_MODIFIED_DATE_TIME_TAX_GROUP,
    GET_TAX_DATA_BY_UNIQUE_ID,
    GET_ACTIVE_TAX_GROUP_LIST,
    GET_TAX_GROUP_AND_TAX_LIST
} from 'store/constant/master/TaxMasterConstant';

import {
    saveTourCategoryHandler,
    getAllTourCategorySaga,
    getTourCategoryByIdSaga,
    updateTourCategorySaga,
    checkDupicateTourCategotyCodeSaga,
    checkLeatestModifiedDateSaga,
    getActiveTourCategoriesSaga
} from './mastersaga/TourCategorySaga';

import {
    CHECK_TOUR_CATEGORY_CODE_DUPLICATE,
    GET_ALL_TOUR_CATEGORY_DATA,
    GET_TOUR_CATEGORY_DATA_BY_ID,
    SAVE_TOUR_CATEGORY_DATA,
    UPDATE_TOUR_CATEGORY_DATA,
    GET_LAST_MODIFIED_DATE_TIME,
    GET_ACTIVE_TOUR_CATEGORY_DATA
} from 'store/constant/master/TourCategoryMasterConstant';

import { getAllCurrenciesSaga } from '../saga/ApiServiceSaga/ApiServiceSaga';
import { GET_ALL_CURRENCIES } from 'store/constant/apiServiceConstant/ApiServiceConstant';

import {
    SAVE_EXCHNAGE_RATE_TYPE_DATA,
    UPDATE_EXCHNAGE_RATE_TYPE_DATA,
    GET_ALL_EXCHNAGE_RATE_TYPE_DATA,
    GET_EXCHNAGE_RATE_TYPE_BY_ID,
    GET_LAST_MODIFIED_DATE_TIME_EXCHNAGE_RATE_TYPE,
    GET_EXCHNAGE_RATE_TYPE_DATA_BY_CURRENCY_ID,
    CONVERT_CURRENCY_TO_BASE_CURRENCY
} from 'store/constant/master/ExchangeRateConstant';

import {
    saveExchangeRateTypeSaga,
    updateExchangeRateTypeSaga,
    getAllExchnageRateTypeDataSaga,
    getExchangeRateTypeByIdSaga,
    checkLatestCurrencyModifiedDateSaga,
    getExChangeRateDataByCurrencyId,
    convertCurrencyToBaseCurrencySaga
} from './mastersaga/ExchangeRateTypeSaga';

import {
    saveProductDataHandler,
    getAllProductSaga,
    getProductByIdSaga,
    updateProductDataSaga,
    checkProductLatestModifiedDateSaga,
    checkDupicateProductCodeSaga
} from './mastersaga/ProductDataSaga';
import {
    CHECK_PRODUCT_CODE_DUPLICATE,
    GET_ALL_PRODUCT_DATA,
    GET_PRODUCT_DATA_BY_ID,
    GET_PRODUCT_LAST_MODIFIED_DATE_TIME,
    SAVE_PRODUCT_DATA,
    UPDATE_PRODUCT_DATA
} from 'store/constant/master/ProductDataMasterConstant';

import {
    SAVE_LOCATION_DATA,
    GET_LOCATION_DATA_BY_ID,
    GET_ALL_LOCATION_DATA,
    UPDATE_LOCATION_DATA,
    CHECK_LOCATION_DUPLICATE,
    GET_LAST_MODIFIED_DATE_TIME_LOCATION,
    GET_ACTIVE_LOCATIONS
} from 'store/constant/master/LocationConstant';

import {
    CHECK_CODE_DUPLICATE,
    CHECK_CODE_TYPE_DUPLICATE,
    GET_ALL_CLUSTER_DATA,
    GET_ALL_CODE_AND_NAME_DATA,
    GET_ALL_OPERATOR_DATA,
    GET_CODE_LAST_MODIFIED_DATE_TIME,
    GET_CODE_NAME_DATA_BY_CODE,
    GET_CODE_NAME_DATA_BY_TYPE,
    GET_DATA_TO_TABLE_VIEW,
    GET_EXISITING_MARKETCODE_FOR_CLUSTER,
    GET_EXISITING_OPERATOR_CODE_FOR_MARKET,
    SAVE_CLUSTER_MARKET_MAPPING_DATA,
    SAVE_CODE_AND_NAME_DATA,
    SAVE_MARKET_OPERATOR_MAPPING_DATA,
    UPDATE_CODE_AND_NAME_DATA
} from 'store/constant/master/CodeAndNameConstant';

import {
    saveCodeAndNameDataHandler,
    getAllCodeAndNameSaga,
    getCodeAndNameByCodeSaga,
    updateCodeAndNameDataSaga,
    checkDupicateCodeSaga,
    checkDupicateCodeTypeSaga,
    checkCodeLatestModifiedDateSaga,
    getAllClusterTypeData,
    getAllActiveOperatorSaga,
    getAllCodeAndNameByTypeSaga,
    saveClusterAndMarketMappingDataSaga,
    getExisitngMarketCodesForCluster,
    saveOperatorAndMarketMappingData,
    saveOperatorAndMarketMappingDataSaga,
    getExisitngOperatorCodesForMarketSaga,
    getExisitngDataToTableSaga
} from './mastersaga/CodeAndNameSaga';

import {
    CHECK_MANAGER_CODE_DUPLICATE,
    GET_ALL_ACTIVE_MANAGER_DATA,
    GET_ALL_MANAGER_DATA,
    GET_MANAGER_DETAILS_BY_CODE,
    GET_MANAGER_LAST_MODIFIED_DATE_TIME,
    SAVE_MANAGER_DATA,
    UPDATE_MANAGER_DATA
} from 'store/constant/master/ManagerConstant';

import {
    saveManagerDataHandler,
    getAllManagerDataSaga,
    getManagerDetailsByCodeSaga,
    getManagerLatestModifiedDateSaga,
    checkManagerDupicateCodeSaga,
    updateManagerDataSaga,
    getAllActiveManagerDataSaga
} from './mastersaga/ManagerSaga';

import {
    saveLocationSaga,
    getAllLocatonSaga,
    getLocationByIdSaga,
    updateLocationSaga,
    checkDupicateLocationSaga,
    checkLatestLocationModifiedDateSaga,
    getAllActiveLocations
} from './mastersaga/LocationSaga';

import {
    SAVE_HOTEL_CATEGORY_DATA,
    GET_HOTEL_CATEGORY_DATA_BY_ID,
    GET_ALL_HOTEL_CATEGORY_DATA,
    UPDATE_HOTEL_CATEGORY_DATA,
    CHECK_HOTEL_CATEGORY_DUPLICATE,
    GET_LAST_MODIFIED_DATE_TIME_HOTEL_CATEGORY,
    GET_ALL_ACTIVE_HOTEL_CATEGORY_DATA
} from 'store/constant/master/HotelCategoryConstant';

import {
    checkDupicateHotelCateogryCodeSaga,
    checkLatestHotelCateogryModifiedDateSaga,
    getAllActiveHotelCateogrySaga,
    getAllHotelCateogrySaga,
    getHotelCateogryByIdSaga,
    saveHotelCateogrySaga,
    updateHotelCateogrySaga
} from './mastersaga/HotelCategorySaga';

import {
    saveManagingCompanySaga,
    getAllManagingCompanySaga,
    getManagingCompanyByIdSaga,
    updateManagingCompanySaga,
    checkDupicateManagingCompanyCodeSaga,
    checkLatestManagingCompanyModifiedDateSaga,
    getAllActiveManagingCompanySaga
} from './mastersaga/ManagingCompanySaga';

import {
    CHECK_MANAGING_COMAPANY_DUPLICATE,
    GET_ALL_ACTIVE_MANAGING_COMAPANY_DATA,
    GET_ALL_MANAGING_COMAPANY_DATA,
    GET_LAST_MODIFIED_DATE_TIME_MANAGING_COMAPANY,
    GET_MANAGING_COMAPANY_DATA_BY_ID,
    SAVE_MANAGING_COMAPANY_DATA,
    UPDATE_MANAGING_COMAPANY_DATA
} from 'store/constant/master/ManagingCompanyConstant';

import {
    saveMarketDataHandler,
    getMarketLatestModifiedDateSaga,
    getAllMarketDataSaga,
    getMarketDetailsByCodeSaga,
    updateMarketDataSaga,
    checkMarketDupicateCodeSaga,
    getAllActiveMarketDataSaga
} from './mastersaga/MarketSaga';
import {
    CHECK_MARKET_CODE_DUPLICATE,
    GET_ALL_ACTIVE_MARKET_DATA,
    GET_ALL_MARKET_DATA,
    GET_MARKET_DETAILS_BY_CODE,
    GET_MARKET_LAST_MODIFIED_DATE_TIME,
    SAVE_MARKET_DATA,
    UPDATE_MARKET_DATA
} from 'store/constant/master/MarketConstant';

import {
    CHECK_TOURTYPE_CODE_DUPLICATE,
    GET_ALL_TOURTYPE_DATA,
    GET_TOURTYPE_DATA_BY_ID,
    GET_TOURTYPE_LAST_MODIFIED_DATE_TIME,
    SAVE_TOURTYPE_DATA,
    UPDATE_TOURTYPE_DATA,
    GET_ACTIVE_TOURTYPE_DATA
} from 'store/constant/master/TourTypeConstant';
import {
    checkDupicateTourTypeCodeSaga,
    checkTourTypeLatestModifiedDateSaga,
    getAllTourTypeSaga,
    getTourTypeByIdSaga,
    saveTourType,
    updateTourTypeSaga,
    getActiveTourTypes
} from './mastersaga/TourTypeSaga';
import { checkDuplicateTourTypeCode } from 'store/actions/masterActions/TourTypeAction';

import {
    CHECK_OWNER_CODE_DUPLICATE,
    GET_ALL_OWNER_DATA,
    GET_OWNER_DATA_BY_ID,
    GET_OWNER_LAST_MODIFIED_DATE_TIME,
    SAVE_OWNER_DATA,
    UPDATE_OWNER_DATA
} from 'store/constant/master/OwnerConstant';
import {
    checkDupicateOwnerCodeSaga,
    checkOwnerLatestModifiedDateSaga,
    getAllOwnerSaga,
    getOwnerByIdSaga,
    saveOwner,
    updateOwnerSaga
} from './mastersaga/OwnerSaga';

import {
    CHECK_SEASON_DUPLICATE,
    GET_ALL_SEASON_DATA,
    GET_SEASON_DATA_BY_ID,
    GET_LAST_MODIFIED_DATE_TIME_SEASON,
    SAVE_SEASON_DATA,
    UPDATE_SEASON_DATA,
    ACTIVE_SEASON_LIST_DATA,
    ACTIVE_RATES_BY_SEASON_ID
} from 'store/constant/master/SeasonConstant';

import {
    saveSeasonSaga,
    checkLatestSeasonModifiedDateSaga,
    getSeasonByIdSaga,
    getAllSeasonSaga,
    updateSeasonSaga,
    checkDupicateSeasonSaga,
    getAllActiveRatesBySeasonSaga,
    getAllActiveSeasonSaga
} from './mastersaga/SeasonSaga';

import {
    GET_ALL_HOTEL_FACILITY_DATA,
    GET_HOTEL_FACILITY_DATA_BY_ID,
    GET_LAST_MODIFIED_DATE_TIME_HOTEL_FACILITY,
    SAVE_HOTEL_FACILITY_DATA,
    UPDATE_HOTEL_FACILITY_DATA,
    GET_ALL_HOTEL_FACILITY_TYPES_DATA,
    CHECK_HOTEL_FACILITY_DUPLICATE,
    GET_ALL_ACTIVE_ROOM_RECREATION_DATA,
    GET_ALL_ACTIVE_SERVICE_OFFERED_DATA,
    GET_ALL_ACTIVE_CHILDREN_FACILITIES_DATA,
    GET_ALL_ACTIVE_FACILITIES_OFFERED_DATA
} from 'store/constant/master/HotelFacilityConstant';

import {
    saveHotelFacilitySaga,
    checkDupicateHotelFacilitySaga,
    getAllHotelFacilitySaga,
    getFacilityByIdSaga,
    updateHotelFacilitySaga,
    checkLatestHotelFacilityModifiedDateSaga,
    getAllHotelFacilityTypesSaga,
    getAllActiveRoomRecreationSaga,
    getAllActiveFacilitiesOfferedSaga,
    getAllActiveChildrenFacilitiesSaga,
    getAllActiveServiceOfferedSaga
} from './mastersaga/HotelFacilitySaga';

import {
    CHECK_MARKET_GROUP_CODE_DUPLICATE,
    GET_ALL_ACTIVE_MARKET_GROUP_DATA,
    GET_ALL_MARKET_GROUP_DATA,
    GET_MARKET_GROUP_DETAILS_BY_CODE,
    GET_MARKET_GROUP_LAST_MODIFIED_DATE_TIME,
    SAVE_MARKET_GROUP_DATA,
    UPDATE_MARKET_GROUP_DATA,
    GET_ALL_ACTIVE_OPERATOR_GROUP_DATA,
    GET_ALL_ACTIVE_OPERATOR_LIST_BY_OPERATOR_GROUP
} from 'store/constant/master/MarketGroupConstant';

import {
    checkMarketGroupDupicateCodeSaga,
    getAllMarketGroupDataSaga,
    getMarketGroupDetailsByCodeSaga,
    getMarketGroupLatestModifiedDateSaga,
    saveMarketGroupDataHandler,
    updateMarketGroupDataSaga,
    getAllActiveOperatorListByOperatorGroup,
    getAllActiveOperatorGroupDataSaga
} from './mastersaga/MarketGroupSaga';
import {
    CHECK_HOTEL_BASIS_CODE_DUPLICATE,
    GET_ALL_HOTEL_BASIS,
    GET_HOTEL_BASIS_BY_ID,
    GET_HOTEL_BASIS_LAST_MODIFIED_DATE_TIME,
    SAVE_HOTEL_BASIS,
    UPDATE_HOTEL_BASIS,
    GET_ACTIVE_HOTEL_BASIS
} from 'store/constant/master/HotelBasisConstant';
import {
    checkHotelBasisDupicateCodeSaga,
    getAllHotelBasisDataSaga,
    getHotelBasisByCodeSaga,
    getHotelBasisLatestModifiedDateSaga,
    saveHotelBasisDataHandler,
    updateHotelBasisDataSaga,
    getActiveHotelBasisListSaga
} from './mastersaga/HotelBasisSaga';

import {
    checkRoomCategoryDupicateCodeSaga,
    getAllRoomCategoryDataSaga,
    getRoomCategoryByCodeSaga,
    getRoomCategoryLatestModifiedDateSaga,
    saveRoomCategoryDataHandler,
    updateRoomCategoryDataSaga,
    getActiveRoomCategoryListSaga
} from './mastersaga/RoomCategorySaga';

import {
    CHECK_ROOM_CATEGORY_CODE_DUPLICATE,
    GET_ALL_ROOM_CATEGORY,
    GET_ROOM_CATEGORY_BY_ID,
    GET_ROOM_CATEGORY_LAST_MODIFIED_DATE_TIME,
    SAVE_ROOM_CATEGORY,
    UPDATE_ROOM_CATEGORY,
    GET_ACTIVE_ROOM_CATEGORY
} from 'store/constant/master/RoomCategoryConstant';
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
import {
    checkExpenseTypesDupicateCodeSaga,
    getAllCurrencyListData,
    getAllExpenseTypesDataSaga,
    getExpenseTypesByCodeSaga,
    getExpenseTypesLatestModifiedDateSaga,
    saveExpenseTypesDataHandler,
    updateExpenseTypesDataSaga,
    getAllActiveExpenseTypesDataSaga,
    checkExpenseTypesDupicateDescriptionSaga
} from './mastersaga/ExpenseTypesSaga';

import { getAllChargeMethods, getAllModeOfTransort } from './mastersaga/TransportRateSaga';

import { GET_ALL_CHARGE_METHOD_DATA, GET_ALL_MODE_OF_TRANSPORT_DATA } from 'store/constant/master/TransportRateConstant';
import {
    CHECK_GUIDE_CLASS_CODE_DUPLICATE,
    GET_ALL_ACTIVE_GUIDE_CLASS_DATA,
    GET_ALL_GUIDE_CLASS_DATA,
    GET_GUIDE_CLASS_DETAILS_BY_CODE,
    GET_GUIDE_CLASS_LAST_MODIFIED_DATE_TIME,
    SAVE_GUIDE_CLASS_DATA,
    UPDATE_GUIDE_CLASS_DATA
} from 'store/constant/master/GuideClassConstant';
import {
    checkGuideClassDupicateCodeSaga,
    getAllActiveGuideClassDataSaga,
    getAllGuideClassDataSaga,
    getGuideClassDetailsByCodeSaga,
    getGuideClassLatestModifiedDateSaga,
    saveGuideClassDataHandler,
    updateGuideClassDataSaga
} from './mastersaga/GuideClassSaga';
import {
    CHECK_USER_DUPLICATE,
    GET_ACTIVE_USERS,
    GET_ALL_USER_DATA,
    GET_ALL_USER_ROLES,
    GET_LAST_MODIFIED_DATE_TIME_USER,
    GET_USER_DATA_BY_ID,
    SAVE_USER_DATA,
    UPDATE_USER_DATA,
    CHECK_USER_LOGIN_CREDENTIALS,
    FORGOT_PASSWORD_CREDENTIALS,
    RESET_PASSWORD_CREDENTIALS,
    GET_PROFILE_DATA_BY_ID,
    UPDATE_MY_PROFILE,
    CLEAR_USER
} from 'store/constant/authentication/UserConstant';
import {
    checkDupicateUserSaga,
    checkLatestUserModifiedDateSaga,
    getAllActiveUsers,
    getAllRolesSaga,
    getAllUserSaga,
    getUserByIdSaga,
    saveUserSaga,
    updateUserSaga,
    userLoginSaga,
    forgotPasswordSaga,
    resetPasswordSaga,
    getProfileDataByIdSaga,
    updateMyProfileData,
    clearUserDataSaga
} from './authenticationSaga/UserSaga';

import {
    saveDepartMentDesignationSaga,
    getAllDepartMentDesignationDataSaga,
    checkDupicateDepartMentDesignationSaga,
    updateDepartMentDesignationSaga,
    getDepartMentDesignationByIdSaga,
    checkLatestDepartMentDesignationModifiedDateSaga,
    getAllDepartmentDataSaga,
    getAllDesignationDataSaga
} from '../saga/mastersaga/DepartmentDesignationSaga';

import {
    SAVE_DEPARTMENT_DESIGNATION,
    GET_ALL_DEPARTMENT_DESIGNATION,
    GET_DEPARTMENT_DESIGNATION_BY_ID,
    UPDATE_DEPARTMENT_DESIGNATION,
    CHECK_DEPARTMENT_DESIGNATION_CODE_DUPLICATE,
    GET_DEPARTMENT_DESIGNATION_LAST_MODIFIED_DATE_TIME,
    GET_ALL_DEPARTMENT_ACTIVE,
    GET_ALL_DESIGNATION_ACTIVE
} from '../constant/master/DepartmentDesignationConstant';

import {
    SAVE_COMPANY_PROFILE,
    GET_ALL_COMPANY_PROFILE,
    GET_COMPANY_PROFILE_BY_ID,
    UPDATE_COMPANY_PROFILE,
    CHECK_COMPANY_PROFILE_CODE_DUPLICATE,
    GET_COMPANY_PROFILE_LAST_MODIFIED_DATE_TIME,
    GET_AVAILABLE_LICENSE_COUNT
} from '../constant/master/CompanyProfilrConstant';

import {
    saveCompanyProfileSaga,
    getAllCompanyProfileDataSaga,
    checkDupicateCompanyProfileSaga,
    updateCompanyProfileSaga,
    getCompanyProfileByIdSaga,
    checkLatestCompanyPrfileModifiedDateSaga,
    avaliableLicenseCountSaga
} from '../saga/mastersaga/CompanyProfileSaga';
import {
    CHECK_AGENT_CODE_DUPLICATE,
    GET_AGENT_DETAILS_BY_CODE,
    GET_AGENT_LAST_MODIFIED_DATE_TIME,
    GET_ALL_ACTIVE_AGENT_DATA,
    GET_ALL_AGENT_DATA,
    SAVE_AGENT_DATA,
    UPDATE_AGENT_DATA
} from 'store/constant/master/AgentConstant';
import {
    checkAgentDupicateCodeSaga,
    getAgentDetailsByCodeSaga,
    getAgentLatestModifiedDateSaga,
    getAllActiveAgentDataSaga,
    getAllAgentDataSaga,
    saveAgentDataHandler,
    updateAgentDataSaga
} from './mastersaga/AgentSaga';

import {
    CHECK_ACTUAL_GUIDE_CODE_DUPLICATE,
    GET_ACTUAL_GUIDE_DETAILS_BY_ID,
    GET_ALL_ACTUAL_GUIDE_DATA,
    SAVE_ACTUAL_GUIDE_DATA,
    UPDATE_ACTUAL_GUIDE_DATA,
    GET_ACTUAL_GUIDE_LAST_MODIFIED_DATE_TIME
} from 'store/constant/master/ActualGuideConstant';

import {
    saveActualGuideDataHandler,
    getAllActiveActualGuideDataSaga,
    updateActualGuideDataSaga,
    getActualGuideDetailsByIdeSaga,
    getAllActualGuideDataSaga,
    getActualGuideLatestModifiedDateSaga,
    checkActualGuideDupicateCodeSaga
} from '../saga/mastersaga/ActualGuideSaga';
import {
    CHECK_ACTIVITY_SUPPLIMENT_CODE_DUPLICATE,
    GET_ACTIVITY_SUPPLIMENT_DETAILS_BY_CODE,
    GET_ACTIVITY_SUPPLIMENT_LAST_MODIFIED_DATE_TIME,
    GET_ALL_ACTIVE_ACTIVITY_SUPPLIMENT_DATA,
    GET_ALL_ACTIVITY_SUPPLIMENT_DATA,
    SAVE_ACTIVITY_SUPPLIMENT_DATA,
    UPDATE_ACTIVITY_SUPPLIMENT_DATA,
    GET_ALL_ACTIVE_ACT_SUP_MIS_DATA_BY_LOCATION_AND_TYPE
} from 'store/constant/master/Activity_SupplimentConstant';
import {
    checkActivity_SupplimentDupicateCodeSaga,
    getActivity_SupplimentDetailsByCodeSaga,
    getActivity_SupplimentLatestModifiedDateSaga,
    getAllActiveActivity_SupplimentDataSaga,
    getAllActivity_SupplimentDataSaga,
    saveActivity_SupplimentDataHandler,
    updateActivity_SupplimentDataSaga,
    getActSupMisListByLocationAndTypSaga
} from './mastersaga/Activity_SupplimentSage';
import { getAllActiveRecreationData } from 'store/actions/masterActions/HotelFacilityAction';
import {
    checkDupicateHotelMainCodeSaga,
    checkLatestHotelMainModifiedDateSaga,
    getAllActiveHotelMainSaga,
    getAllHotelMainSaga,
    getHotelMainByIdSaga,
    saveHotelMainSaga,
    updateHotelMainSaga,
    getHotelsByLocationCurrencyMinMaxRates
} from './mastersaga/HotelMainSaga';
import {
    CHECK_HOTEL_MAIN_DUPLICATE,
    GET_ALL_ACTIVE_HOTEL_MAIN_DATA,
    GET_ALL_HOTEL_MAIN_DATA,
    GET_HOTEL_MAIN_DATA_BY_ID,
    GET_LAST_MODIFIED_DATE_TIME_HOTEL_MAIN,
    SAVE_HOTEL_MAIN_DATA,
    UPDATE_HOTEL_MAIN_DATA,
    GET_HOTELS_BY_LOCATION_CURRENCY_MIN_MAX
} from 'store/constant/master/HotelMasterConstant';

import {
    CHECK_BRANCH_DUPLICATE,
    GET_ALL_BANK_DATA,
    GET_ALL_BRANCH_DATA,
    GET_BRANCH_DATA_BY_ID,
    GET_LAST_MODIFIED_DATE_TIME_BRANCH,
    SAVE_BANK_DATA,
    SAVE_BRANCH_DATA,
    UPDATE_BRANCH_DATA,
    SAVE_BANK_DETAILS_DATA,
    UPDATE_BANK_DETAILS_DATA,
    GET_ALL_BANK_DETAILS_DATA,
    CHECK_BANK_DETAILS_DUPLICATE,
    GET_LAST_MODIFIED_DATE_TIME_BANK_DETAILS,
    GET_BANK_DETAILS_DATA_BY_ID,
    GET_BRANCHES_BY_BANK_ID,
    CHECKED_SAVED_BANK_AND_BRANCH
} from 'store/constant/master/BankConstant';
import {
    saveBankSaga,
    getAllBankSaga,
    saveBranchSaga,
    getAllBranchesSaga,
    checkDupicateBranchesSaga,
    updateBranchSaga,
    getBranchByIdSaga,
    checkLatestBranchModifiedDateSaga,
    saveBankDetailsSaga,
    updateBankDetailsSaga,
    checkLatestBankDetailsModifiedDateSaga,
    checkDupicateBankDetailsSaga,
    getAllBankDetailsSaga,
    checkDupicateBankSaga,
    getBranchesByBankId,
    getSavedBankBrachData,
    getBankDetailsByIdSaga
} from './mastersaga/Bank&BranchSaga';

import {
    SAVE_ROOM_BUYING_RATE,
    GET_ALL_ROOM_BUYING_RATE,
    GET_ROOM_BUYING_RATE_BY_ID,
    UPDATE_ROOM_BUYING_RATE,
    CHECK_ROOM_BUYING_RATE_CODE_DUPLICATE,
    GET_ROOM_BUYING_RATE_LAST_MODIFIED_DATE_TIME,
    GET_ROOM_BUYING_RATE_LIST_BY_HOTEL,
    CLEAR_ROOM_BUYING_RATE
} from 'store/constant/master/RoomBuyingRateConstant';

import {
    saveRoomBuyingRateSaga,
    getRoomBuyingRateByIdSaga,
    updateRoomBuyingRateSaga,
    getAllRoomBuyingRateSaga,
    checkDupicateRoomBuyingRateSaga,
    checkLatestRoomBuyingRateModifiedDateSaga,
    getBuyingRoomRatesByHotelSaga,
    clearRoomBuyingRateSaga
} from './mastersaga/RoomBuyingRateSaga';

import {
    GET_ALL_FACILITYCOUNTER_DATA,
    GET_ALL_FACILITY_COUNTER_DATA_HOTEL_WISE,
    GET_FACILITYCOUNTER_LAST_MODIFIED_DATE_TIME,
    SAVE_FACILITYCOUNTER_DATA,
    UPDATE_FACILITYCOUNTER_DATA
} from 'store/constant/master/FacilityCounterConstant';
import {
    checkLatestFacilityCountModifiedDateSaga,
    getAllFacilityCountHotelWiseSaga,
    getAllFacilityCountSaga,
    saveFacilityCountSaga,
    updateFacilityCountSaga
} from './mastersaga/FacilityCountSaga';
import {
    CHECK_MAIN_TRANSPORT_DETAILS_DUPLICATE,
    GET_ACTIVE_TRANSPORT_MAIN_CATEGORY_DATA_BY_TYPE,
    GET_ALL_MAIN_TRANSPORT_DETAILS_DATA,
    GET_LAST_MODIFIED_DATE_TIME_MAIN_TRANSPORT_DETAILS,
    GET_MAIN_TRANSPORT_DETAILS_BY_ID,
    GET_TRANSPORT_MAIN_CATEGORY_DATA_BY_TYPE,
    SAVE_MAIN_TRANSPORT_DETAILS_DATA,
    UPDATE_MAIN_TRANSPORT_DETAILS_DATA,
    GET_ACTIVE_VEHICLE_CATEGORY_DATA_BY_TYPE,
    GET_ACTIVE_VEHICLE_TYPE_DATA_BY_TYPE
} from 'store/constant/master/TransportMasterConstant/MainTransportCategoryConstant';
import {
    checkDupicateMainTransportCategoriesSaga,
    checkLatestMainTransportCategoriesModifiedDateSaga,
    getActiveTransportMainCategoryDataByTypeSaga,
    getAllMainTransportCategoriesSaga,
    getMainTransportCategoriesByIdSaga,
    getTransportMainCategoryDataByTypeSaga,
    saveMainTransportCategoriesSaga,
    updateMainTransportCategoriesSaga,
    getActiveVehicleTypeDataByTypeSaga,
    getActiveVehicleCategoryDataByTypeSaga
} from './mastersaga/transportSaga/MainTransportCategorySaga';

// import {
//     CHECK_PAX_VEHICLE_RATE_CODE_DUPLICATE,
//     CLEAR_PAX_VEHICLE_RATE,
//     GET_ALL_PAX_VEHICLE_RATE,
//     GET_PAX_VEHICLE_RATE_BY_ID,
//     GET_PAX_VEHICLE_RATE_LAST_MODIFIED_DATE_TIME,
//     SAVE_PAX_VEHICLE_RATE,
//     UPDATE_PAX_VEHICLE_RATE
// } from 'store/constant/master/TransportMasterConstant/PaxVehicleRateConstant';

import {
    SAVE_BAGGAGE_TRANSPORT_RATE,
    GET_BAGGAGE_TRANSPORT_RATE_BY_ID,
    UPDATE_BAGGAGE_TRANSPORT_RATE
    // CLEAR_PAX_VEHICLE_RATE,
    // GET_ALL_PAX_VEHICLE_RATE,
    // GET_PAX_VEHICLE_RATE_BY_ID,
    // GET_PAX_VEHICLE_RATE_LAST_MODIFIED_DATE_TIME,
    // SAVE_PAX_VEHICLE_RATE,
} from 'store/constant/master/TransportMasterConstant/BaggageTransportRateConstant';

import {
    saveBaggageTransportRateSaga,
    getBaggageTransportRateByIdSaga,
    updateBaggageTransportRateSaga
} from './mastersaga/transportSaga/BaggageTransportRateSaga';

import {
    CHECK_PAX_VEHICLE_RATE_CODE_DUPLICATE,
    CLEAR_PAX_VEHICLE_RATE,
    GET_ALL_PAX_VEHICLE_RATE,
    GET_PAX_VEHICLE_RATE_BY_ID,
    GET_PAX_VEHICLE_RATE_LAST_MODIFIED_DATE_TIME,
    SAVE_PAX_VEHICLE_RATE,
    UPDATE_PAX_VEHICLE_RATE
} from 'store/constant/master/TransportMasterConstant/PaxVehicleRateConstant';

import {
    checkDupicatePaxVehicleRateSaga,
    checkLatestPaxVehicleRateModifiedDateSaga,
    getAllPaxVehicleRateSaga,
    getPaxVehicleRateByIdSaga,
    savePaxVehicleRateSaga,
    updatePaxVehicleRateSaga
} from './mastersaga/transportSaga/PaxVehicleRateSaga';

import {
    GET_ALL_ACTIVE_DISTANCE_DATA_TBY_TRANSPORT_TYPE,
    GET_ALL_DISTANCE_DATA,
    GET_DISTANCE_DATA_BY_ID,
    SAVE_DISTANCE_DATA,
    UPDATE_DISTANCE_DATA,
    GET_CALCULATED_DISTANCE_AND_DURATION
} from 'store/constant/master/TransportMasterConstant/DistanceConstant';
import {
    getAllActiveDistanceDataByTransportTypeSaga,
    getDistanceByIdSaga,
    saveDistanceDataHandler,
    saveDistanceSaga,
    updateDistanceSaga,
    getDistanceAndDurationSaga
} from './mastersaga/transportSaga/DistanceSaga';
export function* wacherSaga() {
    // tax setup
    yield takeLatest(SAVE_TAX_DATA, saveTaxSaga);
    yield takeLatest(GET_TAX_DATA_BY_ID, getTaxByIdSaga);
    yield takeLatest(GET_ALL_TAX_DATA, getAllTaxSaga);
    yield takeLatest(UPDATE_TAX_DATA, updateTaxSaga);
    yield takeLatest(CHECK_TAX_DUPLICATE, checkDupicateTaxCodeSaga);
    yield takeLatest(GET_LAST_MODIFIED_DATE_TIME_TAX, checkLatestTaxModifiedDateSaga);
    yield takeLatest(GET_TAX_DATA_BY_UNIQUE_ID, getTaxByUniqueIdSaga);

    //tax group setup
    yield takeLatest(SAVE_TAX_GROUP_DATA, saveTaxGroupSaga);
    yield takeLatest(GET_ALL_TAX_GROUP_DATA, getAllTaxGroupSaga);
    yield takeLatest(GET_TAX_GROUP_DATA_BY_ID, getTaxGroupByIdSaga);
    yield takeLatest(UPDATE_TAX_GROUP_DATA, updateTaxGroupSaga);
    yield takeLatest(CHECK_TAX_GROUP_DUPLICATE, checkDupicateTaxGroupCodeSaga);
    yield takeLatest(GET_LAST_MODIFIED_DATE_TIME_TAX_GROUP, checkLatestTaxGrupModifiedDateSaga);
    yield takeLatest(GET_ACTIVE_TAX_GROUP_LIST, getAllActiveTaxGroups);
    yield takeLatest(GET_TAX_GROUP_AND_TAX_LIST, getAllActiveTaxGroupsandTaxes);

    // //tour category setup
    yield takeLatest(SAVE_TOUR_CATEGORY_DATA, saveTourCategoryHandler);
    yield takeLatest(GET_ALL_TOUR_CATEGORY_DATA, getAllTourCategorySaga);
    yield takeLatest(GET_TOUR_CATEGORY_DATA_BY_ID, getTourCategoryByIdSaga);
    yield takeLatest(UPDATE_TOUR_CATEGORY_DATA, updateTourCategorySaga);
    yield takeLatest(CHECK_TOUR_CATEGORY_CODE_DUPLICATE, checkDupicateTourCategotyCodeSaga);
    yield takeLatest(GET_LAST_MODIFIED_DATE_TIME, checkLeatestModifiedDateSaga);
    yield takeLatest(GET_ACTIVE_TOUR_CATEGORY_DATA, getActiveTourCategoriesSaga);

    // //currency
    yield takeLatest(GET_ALL_CURRENCIES, getAllCurrenciesSaga);

    //exchange rate type
    yield takeLatest(SAVE_EXCHNAGE_RATE_TYPE_DATA, saveExchangeRateTypeSaga);
    yield takeLatest(GET_EXCHNAGE_RATE_TYPE_BY_ID, getExchangeRateTypeByIdSaga);
    yield takeLatest(GET_ALL_EXCHNAGE_RATE_TYPE_DATA, getAllExchnageRateTypeDataSaga);
    yield takeLatest(UPDATE_EXCHNAGE_RATE_TYPE_DATA, updateExchangeRateTypeSaga);
    yield takeLatest(GET_LAST_MODIFIED_DATE_TIME_EXCHNAGE_RATE_TYPE, checkLatestCurrencyModifiedDateSaga);
    yield takeLatest(GET_EXCHNAGE_RATE_TYPE_DATA_BY_CURRENCY_ID, getExChangeRateDataByCurrencyId);
    yield takeLatest(CONVERT_CURRENCY_TO_BASE_CURRENCY, convertCurrencyToBaseCurrencySaga);

    // //product  setup

    yield takeLatest(SAVE_PRODUCT_DATA, saveProductDataHandler);
    yield takeLatest(GET_ALL_PRODUCT_DATA, getAllProductSaga);
    yield takeLatest(GET_PRODUCT_DATA_BY_ID, getProductByIdSaga);
    yield takeLatest(UPDATE_PRODUCT_DATA, updateProductDataSaga);
    yield takeLatest(GET_PRODUCT_LAST_MODIFIED_DATE_TIME, checkProductLatestModifiedDateSaga);
    yield takeLatest(CHECK_PRODUCT_CODE_DUPLICATE, checkDupicateProductCodeSaga);

    // //code&Name setup

    yield takeLatest(SAVE_CODE_AND_NAME_DATA, saveCodeAndNameDataHandler);
    yield takeLatest(GET_ALL_CODE_AND_NAME_DATA, getAllCodeAndNameSaga);
    yield takeLatest(GET_CODE_NAME_DATA_BY_CODE, getCodeAndNameByCodeSaga);
    yield takeLatest(UPDATE_CODE_AND_NAME_DATA, updateCodeAndNameDataSaga);
    yield takeLatest(CHECK_CODE_DUPLICATE, checkDupicateCodeSaga);
    yield takeLatest(CHECK_CODE_TYPE_DUPLICATE, checkDupicateCodeTypeSaga);
    yield takeLatest(GET_CODE_LAST_MODIFIED_DATE_TIME, checkCodeLatestModifiedDateSaga);
    yield takeLatest(GET_ALL_CLUSTER_DATA, getAllClusterTypeData);
    yield takeLatest(GET_ALL_OPERATOR_DATA, getAllActiveOperatorSaga);
    yield takeLatest(GET_CODE_NAME_DATA_BY_TYPE, getAllCodeAndNameByTypeSaga);
    yield takeLatest(SAVE_CLUSTER_MARKET_MAPPING_DATA, saveClusterAndMarketMappingDataSaga);

    yield takeLatest(SAVE_MARKET_OPERATOR_MAPPING_DATA, saveOperatorAndMarketMappingDataSaga);
    // //location data
    yield takeLatest(SAVE_LOCATION_DATA, saveLocationSaga);
    yield takeLatest(GET_LOCATION_DATA_BY_ID, getLocationByIdSaga);
    yield takeLatest(GET_ALL_LOCATION_DATA, getAllLocatonSaga);
    yield takeLatest(UPDATE_LOCATION_DATA, updateLocationSaga);
    yield takeLatest(CHECK_LOCATION_DUPLICATE, checkDupicateLocationSaga);
    yield takeLatest(GET_LAST_MODIFIED_DATE_TIME_LOCATION, checkLatestLocationModifiedDateSaga);
    yield takeLatest(GET_ACTIVE_LOCATIONS, getAllActiveLocations);

    yield takeLatest(UPDATE_CODE_AND_NAME_DATA, updateCodeAndNameDataSaga);
    yield takeLatest(CHECK_CODE_DUPLICATE, checkDupicateCodeSaga);
    yield takeLatest(CHECK_CODE_TYPE_DUPLICATE, checkDupicateCodeTypeSaga);
    yield takeLatest(GET_CODE_LAST_MODIFIED_DATE_TIME, checkCodeLatestModifiedDateSaga);
    yield takeLatest(GET_EXISITING_MARKETCODE_FOR_CLUSTER, getExisitngMarketCodesForCluster);
    yield takeLatest(GET_EXISITING_OPERATOR_CODE_FOR_MARKET, getExisitngOperatorCodesForMarketSaga);
    yield takeLatest(GET_DATA_TO_TABLE_VIEW, getExisitngDataToTableSaga);
    //hotel category
    yield takeLatest(SAVE_HOTEL_CATEGORY_DATA, saveHotelCateogrySaga);
    yield takeLatest(GET_HOTEL_CATEGORY_DATA_BY_ID, getHotelCateogryByIdSaga);
    yield takeLatest(GET_ALL_HOTEL_CATEGORY_DATA, getAllHotelCateogrySaga);
    yield takeLatest(UPDATE_HOTEL_CATEGORY_DATA, updateHotelCateogrySaga);
    yield takeLatest(CHECK_HOTEL_CATEGORY_DUPLICATE, checkDupicateHotelCateogryCodeSaga);
    yield takeLatest(GET_LAST_MODIFIED_DATE_TIME_HOTEL_CATEGORY, checkLatestHotelCateogryModifiedDateSaga);
    yield takeLatest(GET_ALL_ACTIVE_HOTEL_CATEGORY_DATA, getAllActiveHotelCateogrySaga);
    // //room recreation
    // yield takeLatest(SAVE_ROOM_RECREATION_DATA, saveRoomRecreationSaga);
    // yield takeLatest(GET_ROOM_RECREATION_DATA_BY_ID, getRoomRecreationByIdSaga);
    // yield takeLatest(GET_ALL_ROOM_RECREATION_DATA, getAllRoomRecreationSaga);
    // yield takeLatest(UPDATE_ROOM_RECREATION_DATA, updateRoomRecreationSaga);
    // yield takeLatest(CHECK_ROOM_RECREATION_DUPLICATE, checkDupicateRoomRecreationCodeSaga);
    // yield takeLatest(GET_LAST_MODIFIED_DATE_TIME_ROOM_RECREATION, checkLatestRoomCreationModifiedDateSaga);

    //Agent

    yield takeLatest(SAVE_AGENT_DATA, saveAgentDataHandler);
    yield takeLatest(GET_ALL_AGENT_DATA, getAllAgentDataSaga);
    yield takeLatest(GET_AGENT_DETAILS_BY_CODE, getAgentDetailsByCodeSaga);
    yield takeLatest(GET_AGENT_LAST_MODIFIED_DATE_TIME, getAgentLatestModifiedDateSaga);
    yield takeLatest(CHECK_AGENT_CODE_DUPLICATE, checkAgentDupicateCodeSaga);
    yield takeLatest(UPDATE_AGENT_DATA, updateAgentDataSaga);
    yield takeLatest(GET_ALL_ACTIVE_AGENT_DATA, getAllActiveAgentDataSaga);

    // //Market

    yield takeLatest(SAVE_MARKET_DATA, saveMarketDataHandler);
    yield takeLatest(GET_ALL_MARKET_DATA, getAllMarketDataSaga);
    yield takeLatest(GET_MARKET_DETAILS_BY_CODE, getMarketDetailsByCodeSaga);
    yield takeLatest(GET_MARKET_LAST_MODIFIED_DATE_TIME, getMarketLatestModifiedDateSaga);
    yield takeLatest(CHECK_MARKET_CODE_DUPLICATE, checkMarketDupicateCodeSaga);
    yield takeLatest(UPDATE_MARKET_DATA, updateMarketDataSaga);
    yield takeLatest(GET_ALL_ACTIVE_MARKET_DATA, getAllActiveMarketDataSaga);

    // //hotel service offered setup
    // yield takeLatest(SAVE_SERVICEOFFERED_DATA, saveServiceOffered);
    // yield takeLatest(GET_ALL_SERVICEOFFERED_DATA, getAllServiceOfferedSaga);
    // yield takeLatest(GET_SERVICEOFFERED_DATA_BY_ID, getServiceOfferedByIdSaga);
    // yield takeLatest(UPDATE_SERVICEOFFERED_DATA, updateServiceOfferedSaga);
    // yield takeLatest(GET_SERVICEOFFERED_LAST_MODIFIED_DATE_TIME, checkServiceOfferedLatestModifiedDateSaga);
    // yield takeLatest(CHECK_SERVICEOFFERED_CODE_DUPLICATE, checkDupicateServiceOfferedCodeSaga);

    //tour type setup
    yield takeLatest(SAVE_TOURTYPE_DATA, saveTourType);
    yield takeLatest(GET_ALL_TOURTYPE_DATA, getAllTourTypeSaga);
    yield takeLatest(GET_TOURTYPE_DATA_BY_ID, getTourTypeByIdSaga);
    yield takeLatest(UPDATE_TOURTYPE_DATA, updateTourTypeSaga);
    yield takeLatest(GET_TOURTYPE_LAST_MODIFIED_DATE_TIME, checkTourTypeLatestModifiedDateSaga);
    yield takeLatest(CHECK_TOURTYPE_CODE_DUPLICATE, checkDupicateTourTypeCodeSaga);
    yield takeLatest(GET_ACTIVE_TOURTYPE_DATA, getActiveTourTypes);

    // // Market Group
    yield takeLatest(GET_ALL_ACTIVE_OPERATOR_GROUP_DATA, getAllActiveOperatorGroupDataSaga);
    yield takeLatest(SAVE_MARKET_GROUP_DATA, saveMarketGroupDataHandler);
    yield takeLatest(GET_ALL_MARKET_GROUP_DATA, getAllMarketGroupDataSaga);
    yield takeLatest(GET_MARKET_GROUP_DETAILS_BY_CODE, getMarketGroupDetailsByCodeSaga);
    yield takeLatest(GET_MARKET_GROUP_LAST_MODIFIED_DATE_TIME, getMarketGroupLatestModifiedDateSaga);
    yield takeLatest(CHECK_MARKET_GROUP_CODE_DUPLICATE, checkMarketGroupDupicateCodeSaga);
    yield takeLatest(UPDATE_MARKET_GROUP_DATA, updateMarketGroupDataSaga);
    yield takeLatest(GET_ALL_ACTIVE_OPERATOR_LIST_BY_OPERATOR_GROUP, getAllActiveOperatorListByOperatorGroup);

    //managing company
    yield takeLatest(SAVE_MANAGING_COMAPANY_DATA, saveManagingCompanySaga);
    yield takeLatest(GET_MANAGING_COMAPANY_DATA_BY_ID, getManagingCompanyByIdSaga);
    yield takeLatest(GET_ALL_MANAGING_COMAPANY_DATA, getAllManagingCompanySaga);
    yield takeLatest(UPDATE_MANAGING_COMAPANY_DATA, updateManagingCompanySaga);
    yield takeLatest(CHECK_MANAGING_COMAPANY_DUPLICATE, checkDupicateManagingCompanyCodeSaga);
    yield takeLatest(GET_LAST_MODIFIED_DATE_TIME_MANAGING_COMAPANY, checkLatestManagingCompanyModifiedDateSaga);
    yield takeLatest(GET_ALL_ACTIVE_MANAGING_COMAPANY_DATA, getAllActiveManagingCompanySaga);
    // //owner setup
    yield takeLatest(SAVE_OWNER_DATA, saveOwner);
    yield takeLatest(GET_ALL_OWNER_DATA, getAllOwnerSaga);
    yield takeLatest(GET_OWNER_DATA_BY_ID, getOwnerByIdSaga);
    yield takeLatest(UPDATE_OWNER_DATA, updateOwnerSaga);
    yield takeLatest(GET_OWNER_LAST_MODIFIED_DATE_TIME, checkOwnerLatestModifiedDateSaga);
    yield takeLatest(CHECK_OWNER_CODE_DUPLICATE, checkDupicateOwnerCodeSaga);
    // //season data
    yield takeLatest(SAVE_SEASON_DATA, saveSeasonSaga);
    yield takeLatest(GET_SEASON_DATA_BY_ID, getSeasonByIdSaga);
    yield takeLatest(GET_ALL_SEASON_DATA, getAllSeasonSaga);
    yield takeLatest(UPDATE_SEASON_DATA, updateSeasonSaga);
    yield takeLatest(CHECK_SEASON_DUPLICATE, checkDupicateSeasonSaga);
    yield takeLatest(GET_LAST_MODIFIED_DATE_TIME_SEASON, checkLatestSeasonModifiedDateSaga);
    yield takeLatest(ACTIVE_RATES_BY_SEASON_ID, getAllActiveRatesBySeasonSaga);
    // yield takeLatest(ACTIVE_SEASON_LIST_DATA, getAllActiveSeasonSaga);

    // //hotel facility data
    yield takeLatest(SAVE_HOTEL_FACILITY_DATA, saveHotelFacilitySaga);
    yield takeLatest(GET_HOTEL_FACILITY_DATA_BY_ID, getFacilityByIdSaga);
    yield takeLatest(GET_ALL_HOTEL_FACILITY_DATA, getAllHotelFacilitySaga);
    yield takeLatest(UPDATE_HOTEL_FACILITY_DATA, updateHotelFacilitySaga);
    yield takeLatest(CHECK_HOTEL_FACILITY_DUPLICATE, checkDupicateHotelFacilitySaga);
    yield takeLatest(GET_LAST_MODIFIED_DATE_TIME_HOTEL_FACILITY, checkLatestHotelFacilityModifiedDateSaga);

    //hotel facility types
    yield takeLatest(GET_ALL_HOTEL_FACILITY_TYPES_DATA, getAllHotelFacilityTypesSaga);

    // //Hotel Basis

    yield takeLatest(SAVE_HOTEL_BASIS, saveHotelBasisDataHandler);
    yield takeLatest(GET_ALL_HOTEL_BASIS, getAllHotelBasisDataSaga);
    yield takeLatest(GET_HOTEL_BASIS_BY_ID, getHotelBasisByCodeSaga);
    yield takeLatest(GET_HOTEL_BASIS_LAST_MODIFIED_DATE_TIME, getHotelBasisLatestModifiedDateSaga);
    yield takeLatest(CHECK_HOTEL_BASIS_CODE_DUPLICATE, checkHotelBasisDupicateCodeSaga);
    yield takeLatest(UPDATE_HOTEL_BASIS, updateHotelBasisDataSaga);
    yield takeLatest(GET_ACTIVE_HOTEL_BASIS, getActiveHotelBasisListSaga);

    // //Room Category

    yield takeLatest(SAVE_ROOM_CATEGORY, saveRoomCategoryDataHandler);
    yield takeLatest(GET_ALL_ROOM_CATEGORY, getAllRoomCategoryDataSaga);
    yield takeLatest(GET_ROOM_CATEGORY_BY_ID, getRoomCategoryByCodeSaga);
    yield takeLatest(GET_ROOM_CATEGORY_LAST_MODIFIED_DATE_TIME, getRoomCategoryLatestModifiedDateSaga);
    yield takeLatest(CHECK_ROOM_CATEGORY_CODE_DUPLICATE, checkRoomCategoryDupicateCodeSaga);
    yield takeLatest(UPDATE_ROOM_CATEGORY, updateRoomCategoryDataSaga);
    yield takeLatest(GET_ACTIVE_ROOM_CATEGORY, getActiveRoomCategoryListSaga);

    //EXPENSE TYPES
    yield takeLatest(GET_ALL_CURRENCY_LIST, getAllCurrencyListData);
    yield takeLatest(SAVE_EXPENSE_TYPES, saveExpenseTypesDataHandler);
    yield takeLatest(GET_ALL_EXPENSE_TYPES, getAllExpenseTypesDataSaga);
    yield takeLatest(GET_EXPENSE_TYPES_BY_ID, getExpenseTypesByCodeSaga);
    yield takeLatest(UPDATE_EXPENSE_TYPES, updateExpenseTypesDataSaga);
    yield takeLatest(GET_EXPENSE_TYPES_LAST_MODIFIED_DATE_TIME, getExpenseTypesLatestModifiedDateSaga);
    yield takeLatest(CHECK_EXPENSE_TYPES_CODE_DUPLICATE, checkExpenseTypesDupicateCodeSaga);
    yield takeLatest(GET_ALL_ACTIVE_EXPENSE_TYPES, getAllActiveExpenseTypesDataSaga);

    //charge method
    yield takeLatest(GET_ALL_CHARGE_METHOD_DATA, getAllChargeMethods);
    yield takeLatest(CHECK_EXPENSE_TYPES_DESCRIPTION_DUPLICATE, checkExpenseTypesDupicateDescriptionSaga);

    //mode of transport
    yield takeLatest(GET_ALL_MODE_OF_TRANSPORT_DATA, getAllModeOfTransort);

    //Guide Class

    yield takeLatest(SAVE_GUIDE_CLASS_DATA, saveGuideClassDataHandler);
    yield takeLatest(GET_ALL_GUIDE_CLASS_DATA, getAllGuideClassDataSaga);
    yield takeLatest(GET_GUIDE_CLASS_DETAILS_BY_CODE, getGuideClassDetailsByCodeSaga);
    yield takeLatest(GET_GUIDE_CLASS_LAST_MODIFIED_DATE_TIME, getGuideClassLatestModifiedDateSaga);
    yield takeLatest(CHECK_GUIDE_CLASS_CODE_DUPLICATE, checkGuideClassDupicateCodeSaga);
    yield takeLatest(UPDATE_GUIDE_CLASS_DATA, updateGuideClassDataSaga);
    yield takeLatest(GET_ALL_ACTIVE_GUIDE_CLASS_DATA, getAllActiveGuideClassDataSaga);

    // //User data
    yield takeLatest(SAVE_USER_DATA, saveUserSaga);
    yield takeLatest(GET_USER_DATA_BY_ID, getUserByIdSaga);
    yield takeLatest(GET_ALL_USER_DATA, getAllUserSaga);
    yield takeLatest(UPDATE_USER_DATA, updateUserSaga);
    yield takeLatest(CHECK_USER_DUPLICATE, checkDupicateUserSaga);
    yield takeLatest(GET_LAST_MODIFIED_DATE_TIME_USER, checkLatestUserModifiedDateSaga);
    yield takeLatest(GET_ACTIVE_USERS, getAllActiveUsers);
    yield takeLatest(GET_ALL_USER_ROLES, getAllRolesSaga);
    yield takeLatest(GET_PROFILE_DATA_BY_ID, getProfileDataByIdSaga);
    yield takeLatest(CLEAR_USER, clearUserDataSaga);

    //company profile
    yield takeLatest(SAVE_COMPANY_PROFILE, saveCompanyProfileSaga);
    yield takeLatest(GET_COMPANY_PROFILE_BY_ID, getCompanyProfileByIdSaga);
    yield takeLatest(GET_ALL_COMPANY_PROFILE, getAllCompanyProfileDataSaga);
    yield takeLatest(UPDATE_COMPANY_PROFILE, updateCompanyProfileSaga);
    yield takeLatest(CHECK_COMPANY_PROFILE_CODE_DUPLICATE, checkDupicateCompanyProfileSaga);
    yield takeLatest(GET_COMPANY_PROFILE_LAST_MODIFIED_DATE_TIME, checkLatestCompanyPrfileModifiedDateSaga);
    yield takeLatest(GET_AVAILABLE_LICENSE_COUNT, avaliableLicenseCountSaga);

    //designation / department
    yield takeLatest(SAVE_DEPARTMENT_DESIGNATION, saveDepartMentDesignationSaga);
    yield takeLatest(GET_DEPARTMENT_DESIGNATION_BY_ID, getDepartMentDesignationByIdSaga);
    yield takeLatest(GET_ALL_DEPARTMENT_DESIGNATION, getAllDepartMentDesignationDataSaga);
    yield takeLatest(UPDATE_DEPARTMENT_DESIGNATION, updateDepartMentDesignationSaga);
    yield takeLatest(CHECK_DEPARTMENT_DESIGNATION_CODE_DUPLICATE, checkDupicateDepartMentDesignationSaga);
    yield takeLatest(GET_DEPARTMENT_DESIGNATION_LAST_MODIFIED_DATE_TIME, checkLatestDepartMentDesignationModifiedDateSaga);
    yield takeLatest(GET_ALL_DEPARTMENT_ACTIVE, getAllDepartmentDataSaga);
    yield takeLatest(GET_ALL_DESIGNATION_ACTIVE, getAllDesignationDataSaga);

    //login
    yield takeLatest(CHECK_USER_LOGIN_CREDENTIALS, userLoginSaga);

    //forgot password
    yield takeLatest(FORGOT_PASSWORD_CREDENTIALS, forgotPasswordSaga);

    //reset password
    yield takeLatest(RESET_PASSWORD_CREDENTIALS, resetPasswordSaga);

    //my profile
    yield takeLatest(UPDATE_MY_PROFILE, updateMyProfileData);

    //actual guide
    yield takeLatest(SAVE_ACTUAL_GUIDE_DATA, saveActualGuideDataHandler);
    yield takeLatest(GET_ACTUAL_GUIDE_DETAILS_BY_ID, getActualGuideDetailsByIdeSaga);
    yield takeLatest(GET_ALL_ACTUAL_GUIDE_DATA, getAllActualGuideDataSaga);
    yield takeLatest(UPDATE_ACTUAL_GUIDE_DATA, updateActualGuideDataSaga);
    yield takeLatest(CHECK_ACTUAL_GUIDE_CODE_DUPLICATE, checkActualGuideDupicateCodeSaga);
    yield takeLatest(GET_ACTUAL_GUIDE_LAST_MODIFIED_DATE_TIME, getActualGuideLatestModifiedDateSaga);

    //manager
    yield takeLatest(SAVE_MANAGER_DATA, saveManagerDataHandler);
    yield takeLatest(GET_ALL_MANAGER_DATA, getAllManagerDataSaga);
    yield takeLatest(GET_MANAGER_DETAILS_BY_CODE, getManagerDetailsByCodeSaga);
    yield takeLatest(GET_MANAGER_LAST_MODIFIED_DATE_TIME, getManagerLatestModifiedDateSaga);
    yield takeLatest(CHECK_MANAGER_CODE_DUPLICATE, checkManagerDupicateCodeSaga);
    yield takeLatest(UPDATE_MANAGER_DATA, updateManagerDataSaga);
    yield takeLatest(GET_ALL_ACTIVE_MANAGER_DATA, getAllActiveManagerDataSaga);

    // activity/suppliment
    yield takeLatest(SAVE_ACTIVITY_SUPPLIMENT_DATA, saveActivity_SupplimentDataHandler);
    yield takeLatest(GET_ALL_ACTIVITY_SUPPLIMENT_DATA, getAllActivity_SupplimentDataSaga);
    yield takeLatest(GET_ACTIVITY_SUPPLIMENT_DETAILS_BY_CODE, getActivity_SupplimentDetailsByCodeSaga);
    yield takeLatest(GET_ACTIVITY_SUPPLIMENT_LAST_MODIFIED_DATE_TIME, getActivity_SupplimentLatestModifiedDateSaga);
    yield takeLatest(CHECK_ACTIVITY_SUPPLIMENT_CODE_DUPLICATE, checkActivity_SupplimentDupicateCodeSaga);
    yield takeLatest(UPDATE_ACTIVITY_SUPPLIMENT_DATA, updateActivity_SupplimentDataSaga);
    yield takeLatest(GET_ALL_ACTIVE_ACTIVITY_SUPPLIMENT_DATA, getAllActiveActivity_SupplimentDataSaga);
    yield takeLatest(GET_ALL_ACTIVE_ACT_SUP_MIS_DATA_BY_LOCATION_AND_TYPE, getActSupMisListByLocationAndTypSaga);

    //bank
    yield takeLatest(SAVE_BANK_DATA, saveBankSaga);
    yield takeLatest(GET_ALL_BANK_DATA, getAllBankSaga);

    // branch
    yield takeLatest(SAVE_BRANCH_DATA, saveBranchSaga);
    yield takeLatest(GET_ALL_BRANCH_DATA, getAllBranchesSaga);
    yield takeLatest(GET_BRANCH_DATA_BY_ID, getBranchByIdSaga);
    yield takeLatest(GET_LAST_MODIFIED_DATE_TIME_BRANCH, checkLatestBranchModifiedDateSaga);
    yield takeLatest(CHECK_BRANCH_DUPLICATE, checkDupicateBranchesSaga);
    yield takeLatest(UPDATE_BRANCH_DATA, updateBranchSaga);
    yield takeLatest(GET_BRANCHES_BY_BANK_ID, getBranchesByBankId);
    yield takeLatest(CHECKED_SAVED_BANK_AND_BRANCH, getSavedBankBrachData);
    // yield takeLatest(GET_ALL_ACTIVE_BRANCH, getAllActiveActivity_SupplimentDataSaga);

    // active facilies
    yield takeLatest(GET_ALL_ACTIVE_ROOM_RECREATION_DATA, getAllActiveRoomRecreationSaga);
    yield takeLatest(GET_ALL_ACTIVE_FACILITIES_OFFERED_DATA, getAllActiveFacilitiesOfferedSaga);
    yield takeLatest(GET_ALL_ACTIVE_CHILDREN_FACILITIES_DATA, getAllActiveChildrenFacilitiesSaga);
    yield takeLatest(GET_ALL_ACTIVE_SERVICE_OFFERED_DATA, getAllActiveServiceOfferedSaga);

    //hotel main
    yield takeLatest(SAVE_HOTEL_MAIN_DATA, saveHotelMainSaga);
    yield takeLatest(GET_HOTEL_MAIN_DATA_BY_ID, getHotelMainByIdSaga);
    yield takeLatest(GET_ALL_HOTEL_MAIN_DATA, getAllHotelMainSaga);
    yield takeLatest(UPDATE_HOTEL_MAIN_DATA, updateHotelMainSaga);
    yield takeLatest(CHECK_HOTEL_MAIN_DUPLICATE, checkDupicateHotelMainCodeSaga);
    yield takeLatest(GET_LAST_MODIFIED_DATE_TIME_HOTEL_MAIN, checkLatestHotelMainModifiedDateSaga);
    yield takeLatest(GET_ALL_ACTIVE_HOTEL_MAIN_DATA, getAllActiveHotelMainSaga);
    yield takeLatest(GET_HOTELS_BY_LOCATION_CURRENCY_MIN_MAX, getHotelsByLocationCurrencyMinMaxRates);

    //bank Details
    yield takeLatest(SAVE_BANK_DETAILS_DATA, saveBankDetailsSaga);
    yield takeLatest(GET_BANK_DETAILS_DATA_BY_ID, getBankDetailsByIdSaga);
    yield takeLatest(GET_ALL_BANK_DETAILS_DATA, getAllBankDetailsSaga);
    yield takeLatest(UPDATE_BANK_DETAILS_DATA, updateBankDetailsSaga);
    yield takeLatest(CHECK_BANK_DETAILS_DUPLICATE, checkDupicateBankSaga);
    yield takeLatest(GET_LAST_MODIFIED_DATE_TIME_BANK_DETAILS, checkLatestBankDetailsModifiedDateSaga);

    //facility count
    yield takeLatest(SAVE_FACILITYCOUNTER_DATA, saveFacilityCountSaga);
    // yield takeLatest(GET_HOTEL_CATEGORY_DATA_BY_ID, getHotelCateogryByIdSaga);
    yield takeLatest(GET_ALL_FACILITYCOUNTER_DATA, getAllFacilityCountSaga);
    yield takeLatest(GET_ALL_FACILITY_COUNTER_DATA_HOTEL_WISE, getAllFacilityCountHotelWiseSaga);
    yield takeLatest(UPDATE_FACILITYCOUNTER_DATA, updateFacilityCountSaga);
    // yield takeLatest(CHECK_HOTEL_CATEGORY_DUPLICATE, checkDupicateHotelCateogryCodeSaga);
    yield takeLatest(GET_FACILITYCOUNTER_LAST_MODIFIED_DATE_TIME, checkLatestFacilityCountModifiedDateSaga);
    // yield takeLatest(GET_ALL_ACTIVE_HOTEL_CATEGORY_DATA, getAllActiveHotelCateogrySaga);

    //transport category

    yield takeLatest(SAVE_MAIN_TRANSPORT_DETAILS_DATA, saveMainTransportCategoriesSaga);
    yield takeLatest(GET_MAIN_TRANSPORT_DETAILS_BY_ID, getMainTransportCategoriesByIdSaga);
    yield takeLatest(GET_ALL_MAIN_TRANSPORT_DETAILS_DATA, getAllMainTransportCategoriesSaga);
    yield takeLatest(UPDATE_MAIN_TRANSPORT_DETAILS_DATA, updateMainTransportCategoriesSaga);
    yield takeLatest(CHECK_MAIN_TRANSPORT_DETAILS_DUPLICATE, checkDupicateMainTransportCategoriesSaga);
    yield takeLatest(GET_LAST_MODIFIED_DATE_TIME_MAIN_TRANSPORT_DETAILS, checkLatestMainTransportCategoriesModifiedDateSaga);
    yield takeLatest(GET_TRANSPORT_MAIN_CATEGORY_DATA_BY_TYPE, getTransportMainCategoryDataByTypeSaga);
    yield takeLatest(GET_ACTIVE_TRANSPORT_MAIN_CATEGORY_DATA_BY_TYPE, getActiveTransportMainCategoryDataByTypeSaga);
    yield takeLatest(GET_ACTIVE_VEHICLE_CATEGORY_DATA_BY_TYPE, getActiveVehicleCategoryDataByTypeSaga);
    yield takeLatest(GET_ACTIVE_VEHICLE_TYPE_DATA_BY_TYPE, getActiveVehicleTypeDataByTypeSaga);

    //room buying rate
    yield takeLatest(SAVE_ROOM_BUYING_RATE, saveRoomBuyingRateSaga);
    yield takeLatest(GET_ALL_ROOM_BUYING_RATE, getAllRoomBuyingRateSaga);
    yield takeLatest(GET_ROOM_BUYING_RATE_BY_ID, getRoomBuyingRateByIdSaga);
    yield takeLatest(GET_ROOM_BUYING_RATE_LAST_MODIFIED_DATE_TIME, checkLatestRoomBuyingRateModifiedDateSaga);
    yield takeLatest(CHECK_ROOM_BUYING_RATE_CODE_DUPLICATE, checkDupicateRoomBuyingRateSaga);
    yield takeLatest(UPDATE_ROOM_BUYING_RATE, updateRoomBuyingRateSaga);
    yield takeLatest(GET_ROOM_BUYING_RATE_LIST_BY_HOTEL, getBuyingRoomRatesByHotelSaga);
    yield takeLatest(CLEAR_ROOM_BUYING_RATE, clearRoomBuyingRateSaga);

    //pax vehicle rate
    yield takeLatest(SAVE_PAX_VEHICLE_RATE, savePaxVehicleRateSaga);
    yield takeLatest(GET_ALL_PAX_VEHICLE_RATE, getAllPaxVehicleRateSaga);
    yield takeLatest(GET_PAX_VEHICLE_RATE_BY_ID, getPaxVehicleRateByIdSaga);
    yield takeLatest(GET_PAX_VEHICLE_RATE_LAST_MODIFIED_DATE_TIME, checkLatestPaxVehicleRateModifiedDateSaga);
    yield takeLatest(CHECK_PAX_VEHICLE_RATE_CODE_DUPLICATE, checkDupicatePaxVehicleRateSaga);
    yield takeLatest(UPDATE_PAX_VEHICLE_RATE, updatePaxVehicleRateSaga);
    yield takeLatest(CLEAR_PAX_VEHICLE_RATE, clearRoomBuyingRateSaga);
    // yield takeLatest(GET_ALL_ACTIVE_GUIDE_CLASS_DATA, getAllActiveGuideClassDataSaga);

    //distance

    yield takeLatest(SAVE_DISTANCE_DATA, saveDistanceSaga);
    yield takeLatest(GET_ALL_DISTANCE_DATA, getAllRoomBuyingRateSaga);
    yield takeLatest(GET_DISTANCE_DATA_BY_ID, getDistanceByIdSaga);
    yield takeLatest(GET_ALL_ACTIVE_DISTANCE_DATA_TBY_TRANSPORT_TYPE, getAllActiveDistanceDataByTransportTypeSaga);
    // yield takeLatest(CHECK_ROOM_BUYING_RATE_CODE_DUPLICATE, checkDupicateRoomBuyingRateSaga);
    yield takeLatest(UPDATE_DISTANCE_DATA, updateDistanceSaga);
    yield takeLatest(GET_CALCULATED_DISTANCE_AND_DURATION, getDistanceAndDurationSaga);

    //baggage
    yield takeLatest(SAVE_BAGGAGE_TRANSPORT_RATE, saveBaggageTransportRateSaga);
    //  yield takeLatest(GET_ALL_PAX_VEHICLE_RATE, getAllPaxVehicleRateSaga);
    yield takeLatest(GET_BAGGAGE_TRANSPORT_RATE_BY_ID, getBaggageTransportRateByIdSaga);
    //  yield takeLatest(GET_PAX_VEHICLE_RATE_LAST_MODIFIED_DATE_TIME, checkLatestPaxVehicleRateModifiedDateSaga);
    //  yield takeLatest(CHECK_PAX_VEHICLE_RATE_CODE_DUPLICATE, checkDupicatePaxVehicleRateSaga);
    yield takeLatest(UPDATE_BAGGAGE_TRANSPORT_RATE, updateBaggageTransportRateSaga);
    //  yield takeLatest(CLEAR_PAX_VEHICLE_RATE, clearRoomBuyingRateSaga);
}
