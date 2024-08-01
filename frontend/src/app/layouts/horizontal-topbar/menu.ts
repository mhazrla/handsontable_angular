import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'MENUITEMS.MENU.TEXT',
    isTitle: true,
  },
  {
    id: 2,
    label: 'MENUITEMS.DASHBOARD.TEXT',
    icon: 'ri-dashboard-2-line',
    subItems: [
      {
        id: 3,
        label: 'MENUITEMS.DASHBOARD.LIST.USER',
        link: '/user-data/user',
        parentId: 2,
      },
      {
        id: 4,
        label: 'MENUITEMS.DASHBOARD.LIST.ROLE',
        link: '/user-data/role',
        parentId: 2,
      },
    ],
  },
  {
    id: 55,
    label: 'MENUITEMS.AUTHENTICATION.TEXT',
    icon: 'ri-account-circle-line',
    subItems: [
      {
        id: 56,
        label: 'MENUITEMS.AUTHENTICATION.LIST.SIGNIN',
        parentId: 49,
        subItems: [
          {
            id: 57,
            label: 'MENUITEMS.AUTHENTICATION.LIST.BASIC',
            link: '/auth/signin/basic',
            parentId: 56,
          },
          {
            id: 58,
            label: 'MENUITEMS.AUTHENTICATION.LIST.COVER',
            link: '/auth/signin/cover',
            parentId: 56,
          },
        ],
      },
      {
        id: 59,
        label: 'MENUITEMS.AUTHENTICATION.LIST.SIGNUP',
        parentId: 49,
        subItems: [
          {
            id: 60,
            label: 'MENUITEMS.AUTHENTICATION.LIST.BASIC',
            link: '/auth/signup/basic',
            parentId: 59,
          },
          {
            id: 61,
            label: 'MENUITEMS.AUTHENTICATION.LIST.COVER',
            link: '/auth/signup/cover',
            parentId: 59,
          },
        ],
      },
      {
        id: 62,
        label: 'MENUITEMS.AUTHENTICATION.LIST.PASSWORDRESET',
        parentId: 49,
        subItems: [
          {
            id: 63,
            label: 'MENUITEMS.AUTHENTICATION.LIST.BASIC',
            link: '/auth/pass-reset/basic',
            parentId: 62,
          },
          {
            id: 64,
            label: 'MENUITEMS.AUTHENTICATION.LIST.COVER',
            link: '/auth/pass-reset/cover',
            parentId: 62,
          },
        ],
      },
      {
        id: 62,
        label: 'MENUITEMS.AUTHENTICATION.LIST.PASSWORDCREATE',
        parentId: 49,
        subItems: [
          {
            id: 63,
            label: 'MENUITEMS.AUTHENTICATION.LIST.BASIC',
            link: '/auth/pass-create/basic',
            parentId: 62,
          },
          {
            id: 64,
            label: 'MENUITEMS.AUTHENTICATION.LIST.COVER',
            link: '/auth/pass-create/cover',
            parentId: 62,
          },
        ],
      },
      {
        id: 65,
        label: 'MENUITEMS.AUTHENTICATION.LIST.LOCKSCREEN',
        parentId: 49,
        subItems: [
          {
            id: 66,
            label: 'MENUITEMS.AUTHENTICATION.LIST.BASIC',
            link: '/auth/lockscreen/basic',
            parentId: 65,
          },
          {
            id: 67,
            label: 'MENUITEMS.AUTHENTICATION.LIST.COVER',
            link: '/auth/lockscreen/cover',
            parentId: 65,
          },
        ],
      },
      {
        id: 68,
        label: 'MENUITEMS.AUTHENTICATION.LIST.LOGOUT',
        parentId: 49,
        subItems: [
          {
            id: 69,
            label: 'MENUITEMS.AUTHENTICATION.LIST.BASIC',
            link: '/auth/logout/basic',
            parentId: 68,
          },
          {
            id: 70,
            label: 'MENUITEMS.AUTHENTICATION.LIST.COVER',
            link: '/auth/logout/cover',
            parentId: 68,
          },
        ],
      },
      {
        id: 71,
        label: 'MENUITEMS.AUTHENTICATION.LIST.SUCCESSMESSAGE',
        parentId: 49,
        subItems: [
          {
            id: 72,
            label: 'MENUITEMS.AUTHENTICATION.LIST.BASIC',
            link: '/auth/success-msg/basic',
            parentId: 71,
          },
          {
            id: 73,
            label: 'MENUITEMS.AUTHENTICATION.LIST.COVER',
            link: '/auth/success-msg/cover',
            parentId: 71,
          },
        ],
      },
      {
        id: 74,
        label: 'MENUITEMS.AUTHENTICATION.LIST.TWOSTEPVERIFICATION',
        parentId: 49,
        subItems: [
          {
            id: 75,
            label: 'MENUITEMS.AUTHENTICATION.LIST.BASIC',
            link: '/auth/twostep/basic',
            parentId: 74,
          },
          {
            id: 76,
            label: 'MENUITEMS.AUTHENTICATION.LIST.COVER',
            link: '/auth/twostep/cover',
            parentId: 74,
          },
        ],
      },
      {
        id: 77,
        label: 'MENUITEMS.AUTHENTICATION.LIST.ERRORS',
        parentId: 49,
        subItems: [
          {
            id: 78,
            label: 'MENUITEMS.AUTHENTICATION.LIST.404BASIC',
            link: '/auth/errors/404-basic',
            parentId: 77,
          },
          {
            id: 79,
            label: 'MENUITEMS.AUTHENTICATION.LIST.404COVER',
            link: '/auth/errors/404-cover',
            parentId: 77,
          },
          {
            id: 80,
            label: 'MENUITEMS.AUTHENTICATION.LIST.404ALT',
            link: '/auth/errors/404-alt',
            parentId: 77,
          },
          {
            id: 81,
            label: 'MENUITEMS.AUTHENTICATION.LIST.500',
            link: '/auth/errors/page-500',
            parentId: 77,
          },
          {
            id: 81,
            label: 'MENUITEMS.AUTHENTICATION.LIST.OFFLINE',
            link: '/auth/errors/offline',
            parentId: 77,
          },
        ],
      },
    ],
  },
  {
    id: 82,
    label: 'MENUITEMS.PAGES.TEXT',
    icon: 'ri-pages-line',
    subItems: [
      {
        id: 83,
        label: 'MENUITEMS.PAGES.LIST.STARTER',
        link: '/pages/starter',
        parentId: 82,
      },
      {
        id: 84,
        label: 'MENUITEMS.PAGES.LIST.PROFILE',
        parentId: 82,
        subItems: [
          {
            id: 85,
            label: 'MENUITEMS.PAGES.LIST.SIMPLEPAGE',
            link: '/pages/profile',
            parentId: 84,
          },
          {
            id: 86,
            label: 'MENUITEMS.PAGES.LIST.SETTINGS',
            link: '/pages/profile-setting',
            parentId: 84,
          },
        ],
      },
      {
        id: 87,
        label: 'MENUITEMS.PAGES.LIST.TEAM',
        link: '/pages/team',
        parentId: 82,
      },
      {
        id: 88,
        label: 'MENUITEMS.PAGES.LIST.TIMELINE',
        link: '/pages/timeline',
        parentId: 82,
      },
      {
        id: 89,
        label: 'MENUITEMS.PAGES.LIST.FAQS',
        link: '/pages/faqs',
        parentId: 82,
      },
      {
        id: 90,
        label: 'MENUITEMS.PAGES.LIST.PRICING',
        link: '/pages/pricing',
        parentId: 82,
      },
      {
        id: 91,
        label: 'MENUITEMS.PAGES.LIST.GALLERY',
        link: '/pages/gallery',
        parentId: 82,
      },
      {
        id: 92,
        label: 'MENUITEMS.PAGES.LIST.MAINTENANCE',
        link: '/pages/maintenance',
        parentId: 82,
      },
      {
        id: 93,
        label: 'MENUITEMS.PAGES.LIST.COMINGSOON',
        link: '/pages/coming-soon',
        parentId: 82,
      },
      {
        id: 94,
        label: 'MENUITEMS.PAGES.LIST.SITEMAP',
        link: '/pages/sitemap',
        parentId: 82,
      },
      {
        id: 95,
        label: 'MENUITEMS.PAGES.LIST.SEARCHRESULTS',
        link: '/pages/search-results',
        parentId: 82,
      },
      {
        id: 96,
        label: 'MENUITEMS.PAGES.LIST.PRIVACYPOLICY',
        link: '/pages/privacy-policy',
        badge: {
          variant: 'bg-success',
          text: 'MENUITEMS.DASHBOARD.BADGE',
        },
        parentId: 82,
      },
      {
        id: 97,
        label: 'MENUITEMS.PAGES.LIST.TERMS&CONDITIONS',
        link: '/pages/terms-condition',
        badge: {
          variant: 'bg-success',
          text: 'MENUITEMS.DASHBOARD.BADGE',
        },
        parentId: 82,
      },
    ],
  },
  {
    id: 82,
    label: 'MENUITEMS.BASEUI.TEXT',
    icon: 'ri-pencil-ruler-2-line',
    subItems: [
      {
        id: 98,
        label: 'MENUITEMS.BASEUI.LIST.ALERTS',
        link: '/ui/alerts',
        parentId: 97,
      },
      {
        id: 99,
        label: 'MENUITEMS.BASEUI.LIST.BADGES',
        link: '/ui/badges',
        parentId: 97,
      },
      {
        id: 100,
        label: 'MENUITEMS.BASEUI.LIST.BUTTONS',
        link: '/ui/buttons',
        parentId: 97,
      },
      {
        id: 101,
        label: 'MENUITEMS.BASEUI.LIST.COLORS',
        link: '/ui/colors',
        parentId: 97,
      },
      {
        id: 102,
        label: 'MENUITEMS.BASEUI.LIST.CARDS',
        link: '/ui/cards',
        parentId: 97,
      },
      {
        id: 103,
        label: 'MENUITEMS.BASEUI.LIST.CAROUSEL',
        link: '/ui/carousel',
        parentId: 97,
      },
      {
        id: 104,
        label: 'MENUITEMS.BASEUI.LIST.DROPDOWNS',
        link: '/ui/dropdowns',
        parentId: 97,
      },
      {
        id: 105,
        label: 'MENUITEMS.BASEUI.LIST.GRID',
        link: '/ui/grid',
        parentId: 97,
      },
      {
        id: 106,
        label: 'MENUITEMS.BASEUI.LIST.IMAGES',
        link: '/ui/images',
        parentId: 97,
      },
      {
        id: 107,
        label: 'MENUITEMS.BASEUI.LIST.TABS',
        link: '/ui/tabs',
        parentId: 97,
      },
      {
        id: 108,
        label: 'MENUITEMS.BASEUI.LIST.ACCORDION&COLLAPSE',
        link: '/ui/accordions',
        parentId: 97,
      },
      {
        id: 109,
        label: 'MENUITEMS.BASEUI.LIST.MODALS',
        link: '/ui/modals',
        parentId: 97,
      },
      {
        id: 111,
        label: 'MENUITEMS.BASEUI.LIST.PLACEHOLDERS',
        link: '/ui/placeholder',
        parentId: 97,
      },
      {
        id: 112,
        label: 'MENUITEMS.BASEUI.LIST.PROGRESS',
        link: '/ui/progress',
        parentId: 97,
      },
      {
        id: 113,
        label: 'MENUITEMS.BASEUI.LIST.NOTIFICATIONS',
        link: '/ui/notifications',
        parentId: 97,
      },
      {
        id: 114,
        label: 'MENUITEMS.BASEUI.LIST.MEDIAOBJECT',
        link: '/ui/media',
        parentId: 97,
      },
      {
        id: 115,
        label: 'MENUITEMS.BASEUI.LIST.EMBEDVIDEO',
        link: '/ui/video',
        parentId: 97,
      },
      {
        id: 116,
        label: 'MENUITEMS.BASEUI.LIST.TYPOGRAPHY',
        link: '/ui/typography',
        parentId: 97,
      },
      {
        id: 117,
        label: 'MENUITEMS.BASEUI.LIST.LISTS',
        link: '/ui/list',
        parentId: 97,
      },
      {
        id: 118,
        label: 'MENUITEMS.BASEUI.LIST.GENERAL',
        link: '/ui/general',
        parentId: 97,
      },
      {
        id: 119,
        label: 'MENUITEMS.BASEUI.LIST.RIBBONS',
        link: '/ui/ribbons',
        parentId: 97,
      },
      {
        id: 120,
        label: 'MENUITEMS.BASEUI.LIST.UTILITIES',
        link: '/ui/utilities',
        parentId: 97,
      },
    ],
  },
];
