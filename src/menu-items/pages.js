// assets
import { IconKey } from '@tabler/icons';

// constant
const icons = {
    IconKey
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
    id: 'pages',
    // title: 'Pages',
    caption: 'Pages Caption',
    type: 'group',
    children: [
        {
            id: 'authentication',
            title: 'Authentication',
            type: 'collapse',
            icon: icons.IconKey,

            children: [
                {
                    id: 'register3',
                    title: 'User Creation',
                    type: 'item',
                    url: '/pages/usermanagement/usercreation',
                    breadcrumbs: false
                }
            ]
        }
    ]
};

export default pages;
