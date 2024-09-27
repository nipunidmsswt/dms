import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ViewTax from 'views/pages/master/tax/ViewTax';
import ViewTaxGroup from 'views/pages/master/tax_group/ViewTaxGroup';
import ViewTourCategory from 'views/pages/master/tour_category/ViewTourCategory';
import ViewTourType from 'views/pages/master/tour_type/ViewTourType';
import ViewCodeAndName from 'views/pages/master/code_name/ViewCodeAndName';
import ViewManager from 'views/pages/master/operator/manager/ViewManager';
import ViewMarket from 'views/pages/master/operator/market/ViewMarket';
import ViewMarketGroup from 'views/pages/master/operator/maketGroup/ViewMarketGroup';
import ViewOperatorEntry from 'views/pages/master/operator/operatorEntry/ViewOperatorEntry';
import ViewSeason from 'views/pages/master/season/ViewSeason';
import ViewHotelBasis from 'views/pages/master/hotelMaster/hotelBasis/ViewHotelBasis';
import ViewRoomCategory from 'views/pages/master/hotelMaster/roomCategory/ViewRoomCategory';
import ViewHotelCategory from 'views/pages/master/hotelMaster/hotel_category/ViewHotelCategory';
import ViewHotelFacility from 'views/pages/master/hotelMaster/hotel_facility/ViewHotelacility';
import ViewOwner from 'views/pages/master/owner/ViewOwner';
import ViewProduct from 'views/pages/master/product/ViewProduct';
import ViewExchangeRateTypes from 'views/pages/master/exchange_rate_types/ViewExchangeRateTypes';
import ViewLocation from 'views/pages/master/transportMaster/location/ViewLocation';
import ViewFacilityCounter from 'views/pages/master/hotelMaster/facility_count/ViewFacilityCount';
import ViewGuideClass from 'views/pages/master/guideMaster/guide_class/ViewGuideClass';
import ViewExpenseTypes from 'views/pages/master/transportMaster/expensetypes/ViewExpenseTypes';
import ViewTransportRates from 'views/pages/master/transportMaster/transportRates/ViewTransportRates';
import ViewCompanyProfile from 'views/pages/master/company_profile/ViewCompanyProfile';
import ViewDepartmentDesignation from 'views/pages/master/department_designation/ViewDepartmentDesignation';
import ViewUserCreation from 'views/pages/authentication/userManagement/ViewUserCreation';
import ViewActivitySupplement from 'views/pages/master/activity_supplement/ViewActivitySupplement';
import VIewActualGuide from 'views/pages/master/guideMaster/actual_guide/VIewActualGuide';
import ViewHotelMaster from 'views/pages/master/hotelMaster/hotelMaster/ViewHotelMaster';
import ViewManagingComapany from 'views/pages/master/managing_company/ViewManagingCompnay';
import RoomBuyingRates from 'views/pages/master/hotelMaster/RoomBuyingRates/RoomBuyingRates';
import ViewBankDetail from 'views/pages/master/bank_detail/ViewBankDetail';
import ViewBranchDetails from 'views/pages/master/bank/ViewBranchDetails';
import TransportMainScreen from 'views/pages/master/transportMaster/transportMainScreen/TransportMainScreen';
import AuthGuard from 'utils/route-guard/AuthGuard';
import FacilityCounter from 'views/pages/master/hotelMaster/facility_count/FacilityCount';
import ViewRoomBuyingRate from 'views/pages/master/hotelMaster/RoomBuyingRates/ViewRoomBuyingRate';
import Landing from 'views/pages/landing';
import ViewMainScreen from 'views/pages/programmCreation/viewMainScreen';
// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    // element: (
    //     <AuthGuard>
    //         <MainLayout />
    //     </AuthGuard>
    // ),
    children: [
        // {
        //     path: '/',
        //     element: <DashboardDefault />
        // },
        {
            path: '/pages/usermanagement/usercreation',
            element: <ViewUserCreation />
        },
        {
            path: 'dashboard',
            children: [
                {
                    path: 'default',
                    element: <DashboardDefault />
                }
            ]
        },
        {
            path: 'utils',
            children: [
                {
                    path: 'util-typography',
                    element: <UtilsTypography />
                }
            ]
        },
        {
            path: 'utils',
            children: [
                {
                    path: 'util-color',
                    element: <UtilsColor />
                }
            ]
        },
        {
            path: 'utils',
            children: [
                {
                    path: 'util-shadow',
                    element: <UtilsShadow />
                }
            ]
        },
        {
            path: 'icons',
            children: [
                {
                    path: 'tabler-icons',
                    element: <UtilsTablerIcons />
                }
            ]
        },
        {
            path: 'icons',
            children: [
                {
                    path: 'material-icons',
                    element: <UtilsMaterialIcons />
                }
            ]
        },
        {
            path: 'sample-page',
            element: <SamplePage />
        },

        // iTos3
        {
            path: 'master',
            children: [
                {
                    path: 'taxview',
                    element: <ViewTax />
                },
                {
                    path: 'taxgroupview',
                    element: <ViewTaxGroup />
                },
                {
                    path: 'tourtypeview',
                    element: <ViewTourType />
                },
                {
                    path: 'tourcategoryview',
                    element: <ViewTourCategory />
                },
                {
                    path: 'codeandnameview',
                    element: <ViewCodeAndName />
                },
                {
                    path: 'managerview',
                    element: <ViewManager />
                },
                {
                    path: 'marketview',
                    element: <ViewMarket />
                },
                {
                    path: 'marketgroupview',
                    element: <ViewMarketGroup />
                },
                {
                    path: 'activitysupplementview',
                    element: <ViewActivitySupplement />
                },
                {
                    path: 'seasonview',
                    element: <ViewSeason />
                },
                {
                    path: 'hotelbasis',
                    element: <ViewHotelBasis />
                },
                {
                    path: 'roomcategory',
                    element: <ViewRoomCategory />
                },
                {
                    path: 'hotelcategoryview',
                    element: <ViewHotelCategory />
                },
                {
                    path: 'hotelFacilityview',
                    element: <ViewHotelFacility />
                },
                {
                    path: 'ownerview',
                    element: <ViewOwner />
                },
                {
                    path: 'productview',
                    element: <ViewProduct />
                },
                {
                    path: 'exchangeratetypeview',
                    element: <ViewExchangeRateTypes />
                },
                {
                    path: 'locationview',
                    element: <ViewLocation />
                },
                {
                    path: 'facilitycountview',
                    element: <ViewFacilityCounter />
                },
                {
                    path: 'facilitycount',
                    element: <FacilityCounter />
                },
                {
                    path: 'guideclassview',
                    element: <ViewGuideClass />
                },
                {
                    path: 'expensetypesview',
                    element: <ViewExpenseTypes />
                },
                {
                    path: 'trasportrateview',
                    element: <ViewTransportRates />
                },
                {
                    path: 'companyprofileview',
                    element: <ViewCompanyProfile />
                },
                {
                    path: 'designationdepartmentview',
                    element: <ViewDepartmentDesignation />
                },
                {
                    path: 'actualguide',
                    element: <VIewActualGuide />
                },
                {
                    path: 'hotelview',
                    element: <ViewHotelMaster />
                },
                {
                    path: 'managingCompanyview',
                    element: <ViewManagingComapany />
                },
                {
                    path: 'roombuyingrate',
                    element: <RoomBuyingRates />
                },
                {
                    path: 'bankDetails',
                    element: <ViewBankDetail />
                },
                {
                    path: 'bankbranches',
                    element: <ViewBranchDetails />
                },
                {
                    path: 'roombuyingrateview',
                    element: <ViewRoomBuyingRate />
                },
                {
                    path: 'transportmain',
                    element: <TransportMainScreen />
                },
                {
                    path: 'programmCreation',
                    element: <ViewMainScreen />
                }
            ]
        }
    ]
};

export default MainRoutes;
