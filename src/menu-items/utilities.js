// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill } from '@tabler/icons';

// constant
const icons = {
    IconTypography,
    IconPalette,
    IconShadow,
    IconWindmill
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
    id: 'utilities',
    // title: 'Master Setup',
    type: 'group',
    children: [
        // {
        //     id: 'util-typography',
        //     title: 'Typography',
        //     type: 'item',
        //     url: '/utils/util-typography',
        //     icon: icons.IconTypography,
        //     breadcrumbs: false
        // },
        // {
        //     id: 'util-color',
        //     title: 'Color',
        //     type: 'item',
        //     url: '/utils/util-color',
        //     icon: icons.IconPalette,
        //     breadcrumbs: false
        // },
        // {
        //     id: 'util-shadow',
        //     title: 'Shadow',
        //     type: 'item',
        //     url: '/utils/util-shadow',
        //     icon: icons.IconShadow,
        //     breadcrumbs: false
        // },
        {
            id: 'icons',
            title: 'Pre Tour Master',
            type: 'collapse',
            icon: icons.IconWindmill,
            children: [
                {
                    id: 'tax-id',
                    title: 'Tax',
                    // icon: icons.IconTypography,
                    // type: 'collapse',
                    type: 'item',
                    url: '/master/taxview',
                    breadcrumbs: false
                },
                {
                    id: 'tax-group-id',
                    title: 'Tax Group',
                    type: 'item',
                    url: '/master/taxgroupview',
                    breadcrumbs: false
                },
                {
                    id: 'exchange-rate-id',
                    title: 'Exchange Rate Types',
                    type: 'item',
                    url: '/master/exchangeratetypeview',
                    breadcrumbs: false
                },
                {
                    id: 'operators',
                    type: 'collapse',
                    title: 'Operators',
                    children: [
                        {
                            id: 'codename',
                            title: 'Code And Name',
                            type: 'item',
                            url: '/master/codeandnameview',
                            breadcrumbs: false
                            // icon: "bi bi-journal-code",
                            // path: "/master/codeAndName",
                        },
                        {
                            id: 'manager',
                            title: 'Manager',
                            type: 'item',
                            url: '/master/managerview',
                            breadcrumbs: false
                            // icon: "bi bi-journal-code",
                            // path: "/master/codeAndName",
                        },

                        {
                            id: 'market',
                            title: 'Market',
                            type: 'item',
                            url: '/master/marketview',
                            breadcrumbs: false
                            // icon: "bi bi-journal-code",
                            // path: "/master/codeAndName",
                        },
                        {
                            id: 'market-group',
                            title: 'Operator / Market Group',
                            type: 'item',
                            url: '/master/marketgroupview',
                            breadcrumbs: false
                            // icon: "bi bi-journal-code",
                            // path: "/master/codeAndName",
                        }
                        // {
                        //     id: 'operator-entry',
                        //     title: 'Operator Entry',
                        //     type: 'item',
                        //     url: '/master/operatorentryview',
                        //     breadcrumbs: false
                        //     // icon: "bi bi-journal-code",
                        //     // path: "/master/codeAndName",
                        // },
                        // {
                        //     id: 'Color',
                        //     title: 'Color',
                        //     type: 'item',
                        //     url: '/utils/util-color',
                        //     breadcrumbs: false
                        //     // icon: "bi bi-journal-code",
                        //     // path: "/master/codeAndName",
                        // }
                        //   {
                        //     title: "Manager",
                        //     icon: "bi bi-file-earmark-person",
                        //     path: "/master/manager",
                        //   },
                        //   {
                        //     title: "Market",
                        //     icon: "bi bi-shop-window",
                        //     path: "/master/market",
                        //   },
                        //   {
                        //     title: "Operator/Market Group",
                        //     icon: "bi bi-terminal-dash",
                        //     path: "/master/marketGroup",
                        //   },
                    ]
                },

                {
                    id: 'tour-type-id',
                    title: 'Tour Type',
                    type: 'item',
                    url: '/master/tourtypeview',
                    breadcrumbs: false
                },

                {
                    id: 'tour-category-id',
                    title: 'Tour Category',
                    type: 'item',
                    url: '/master/tourcategoryview',
                    breadcrumbs: false
                },
                {
                    id: 'product-id',
                    title: 'Product',
                    type: 'item',
                    url: '/master/productview',
                    breadcrumbs: false
                },
                {
                    id: 'season-id',
                    title: 'Season',
                    type: 'item',
                    url: '/master/seasonview',
                    breadcrumbs: false
                },
                {
                    id: 'owner-id',
                    title: 'Owner',
                    type: 'item',
                    url: '/master/ownerview',
                    breadcrumbs: false
                },
                {
                    id: 'company-profile-id',
                    title: 'Company Profile',
                    type: 'item',
                    url: '/master/companyprofileview',
                    breadcrumbs: false
                },
                {
                    id: 'department-designation-id',
                    title: 'Designation / Department',
                    type: 'item',
                    url: '/master/designationdepartmentview',
                    breadcrumbs: false
                },

                {
                    id: 'Hotel-master',
                    type: 'collapse',
                    title: 'Hotel Master',
                    children: [
                        {
                            id: 'hotel-category',
                            title: 'Hotel Category',
                            type: 'item',
                            url: '/master/hotelcategoryview',
                            breadcrumbs: false
                            // icon: "bi bi-journal-code",
                            // path: "/master/codeAndName",
                        },
                        {
                            id: 'managing-company',
                            title: 'Managing Compnay',
                            type: 'item',
                            url: '/master/managingCompanyview',
                            breadcrumbs: false
                            // icon: "bi bi-journal-code",
                            // path: "/master/codeAndName",
                        },
                        {
                            id: 'hotel-facility',
                            title: 'Hotel Facility',
                            type: 'item',
                            url: '/master/hotelFacilityview',
                            breadcrumbs: false
                            // icon: "bi bi-journal-code",
                            // path: "/master/codeAndName",
                        },
                        {
                            id: 'room-category',
                            title: 'Room Category',
                            type: 'item',
                            url: '/master/roomcategory',
                            breadcrumbs: false
                            // icon: "bi bi-journal-code",
                            // path: "/master/codeAndName",
                        },

                        {
                            id: 'hotelbasis',
                            title: 'Hotel Basis',
                            type: 'item',
                            url: '/master/hotelbasis',
                            breadcrumbs: false
                            // icon: "bi bi-journal-code",
                            // path: "/master/codeAndName",
                        },

                        {
                            id: 'facility-count',
                            title: 'Facility Count',
                            type: 'item',
                            url: '/master/facilitycountview',
                            breadcrumbs: false
                            // icon: "bi bi-journal-code",
                            // path: "/master/codeAndName",
                        },

                        {
                            id: 'hotel-main-master',
                            title: 'Hotel Main Details',
                            type: 'item',
                            url: '/master/hotelview',
                            breadcrumbs: false
                            // icon: "bi bi-journal-code",
                            // path: "/master/codeAndName",
                        }
                        // {
                        //     id: 'room-buying-rate',
                        //     title: 'Room Buying Rates',
                        //     type: 'item',
                        //     url: '/master/roombuyingrate',
                        //     breadcrumbs: false
                        //     // icon: "bi bi-journal-code",
                        //     // path: "/master/codeAndName",
                        // }
                        // {
                        //     id: 'Color',
                        //     title: 'Color',
                        //     type: 'item',
                        //     url: '/utils/util-color',
                        //     breadcrumbs: false
                        //     // icon: "bi bi-journal-code",
                        //     // path: "/master/codeAndName",
                        // }
                        //   {
                        //     title: "Manager",
                        //     icon: "bi bi-file-earmark-person",
                        //     path: "/master/manager",
                        //   },
                        //   {
                        //     title: "Market",
                        //     icon: "bi bi-shop-window",
                        //     path: "/master/market",
                        //   },
                        //   {
                        //     title: "Operator/Market Group",
                        //     icon: "bi bi-terminal-dash",
                        //     path: "/master/marketGroup",
                        //   },
                    ]
                },

                {
                    id: 'transport-master',
                    type: 'collapse',
                    title: 'Transport Master',
                    children: [
                        {
                            id: 'location',
                            title: 'Location',
                            type: 'item',
                            url: '/master/locationview',
                            breadcrumbs: false
                            // icon: "bi bi-journal-code",
                            // path: "/master/codeAndName",
                        },

                        {
                            id: 'expensetypes',
                            title: 'Expense Types',
                            type: 'item',
                            url: '/master/expensetypesview',
                            breadcrumbs: false
                        },
                        {
                            id: 'transport-rate',
                            title: 'Transport Rate',
                            type: 'item',
                            url: '/master/trasportrateview',
                            breadcrumbs: false
                            // icon: "bi bi-journal-code",
                            // path: "/master/codeAndName",
                        },
                        {
                            id: 'main-transport-category',
                            title: 'Transport Main',
                            type: 'item',
                            url: '/master/transportmain',
                            breadcrumbs: false
                            // icon: "bi bi-journal-code",
                            // path: "/master/codeAndName",
                        }
                    ]
                },

                {
                    id: 'guide-master',
                    type: 'collapse',
                    title: 'Guide Master',
                    children: [
                        {
                            id: 'guide-class',
                            title: 'Guide Class',
                            type: 'item',
                            url: '/master/guideclassview',
                            breadcrumbs: false
                            // icon: "bi bi-journal-code",
                            // path: "/master/codeAndName",
                        },
                        {
                            id: 'actual-guide',
                            title: 'Actual Guide',
                            type: 'item',
                            url: '/master/actualguide',
                            breadcrumbs: false
                        }
                    ]
                },
                {
                    id: 'activitysupplement-id',
                    title: 'Activity / Supplement',
                    type: 'item',
                    url: '/master/activitysupplementview',
                    breadcrumbs: false
                },
                {
                    id: 'bank-branch-id',
                    title: 'Bank & Branches',
                    type: 'item',
                    url: '/master/bankbranches',
                    breadcrumbs: false
                },
                {
                    id: 'bank-detail-id',
                    title: 'Bank Details',
                    type: 'item',
                    url: '/master/bankDetails',
                    breadcrumbs: false
                },

                {
                    id: 'programm-creation-id',
                    title: 'Programm Creation',
                    type: 'item',
                    url: '/master/programmCreation',
                    breadcrumbs: false
                }
            ]
        }
    ]
};

export default utilities;
