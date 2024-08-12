import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 2,
    label: 'MENUITEMS.FIModule.TEXT',
    icon: 'ri-dashboard-2-line',
    subItems: [
      {
        id: 3,
        label: 'MENUITEMS.FIModule.LIST.Create Journal FB60',
        link: '/journal/fb60',
        parentId: 2,
      },
      {
        id: 4,
        label: 'MENUITEMS.FIModule.LIST.Create Journal F-02',
        link: '/journal/f02',
        parentId: 2,
      },
      {
        id: 5,
        label: 'MENUITEMS.FIModule.LIST.Create Journal FB50',
        link: '/journal/fb50',
        parentId: 2,
      },
    ],
  },
  {
    id: 6,
    label: 'MENUITEMS.DisplayModule.TEXT',
    icon: 'ri-dashboard-2-line',
    subItems: [
      {
        id: 7,
        label: 'MENUITEMS.DisplayModule.LIST.Display Document FB03',
        link: '/journal/fb03',
        parentId: 6,
      },
      {
        id: 7,
        label: 'MENUITEMS.DisplayModule.LIST.Vendor Line Item Display FBL1N',
        link: '/journal/fbl1n',
        parentId: 6,
      },
      {
        id: 8,
        label: 'MENUITEMS.DisplayModule.LIST.Display Master Vendor XK03',
        link: '/journal/xk03',
        parentId: 6,
      },
      {
        id: 9,
        label: 'MENUITEMS.DisplayModule.LIST.Display Asset AS03',
        link: '/journal/as03',
        parentId: 6,
      },
      {
        id: 9,
        label:
          'MENUITEMS.DisplayModule.LIST.Print Voucher Settlement YAIOFF003',
        link: '/journal/yaioff003',
        parentId: 6,
      },
      {
        id: 10,
        label: 'MENUITEMS.DisplayModule.LIST.Print Voucher Settlement ZFF001',
        link: '/journal/zff001',
        parentId: 6,
      },
    ],
  },
  {
    id: 10,
    label: 'MENUITEMS.MASTER.TEXT',
    icon: 'ri-dashboard-2-line',
    subItems: [
      {
        id: 11,
        label: 'MENUITEMS.MASTER.LIST.AUTHORIZATION',
        link: '/master/authorization',
        parentId: 10,
      },
      {
        id: 12,
        label: 'MENUITEMS.MASTER.LIST.USER',
        link: '/master/user',
        parentId: 10,
      },
      {
        id: 13,
        label: 'MENUITEMS.MASTER.LIST.ROLE',
        link: '/master/role',
        parentId: 10,
      },
      {
        id: 14,
        label: 'MENUITEMS.MASTER.LIST.PERMISSION',
        link: '/master/permission',
        parentId: 10,
      },
      {
        id: 15,
        label: 'MENUITEMS.MASTER.LIST.ROLE_TO_PERMISSION',
        link: '/master/role-permission',
        parentId: 10,
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
    id: 97,
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
  {
    id: 132,
    label: 'MENUITEMS.FORMS.TEXT',
    icon: 'ri-file-list-3-line',
    subItems: [
      {
        id: 133,
        label: 'MENUITEMS.FORMS.LIST.BASICELEMENTS',
        link: '/forms/basic',
        parentId: 132,
      },
      {
        id: 134,
        label: 'MENUITEMS.FORMS.LIST.FORMSELECT',
        link: '/forms/select',
        parentId: 132,
      },
      {
        id: 135,
        label: 'MENUITEMS.FORMS.LIST.CHECKBOXS&RADIOS',
        link: '/forms/checkboxs-radios',
        parentId: 132,
      },
      {
        id: 136,
        label: 'MENUITEMS.FORMS.LIST.PICKERS',
        link: '/forms/pickers',
        parentId: 132,
      },
      {
        id: 137,
        label: 'MENUITEMS.FORMS.LIST.INPUTMASKS',
        link: '/forms/masks',
        parentId: 132,
      },
      {
        id: 138,
        label: 'MENUITEMS.FORMS.LIST.ADVANCED',
        link: '/forms/advanced',
        parentId: 132,
      },
      {
        id: 139,
        label: 'MENUITEMS.FORMS.LIST.RANGESLIDER',
        link: '/forms/range-sliders',
        parentId: 132,
      },
      {
        id: 140,
        label: 'MENUITEMS.FORMS.LIST.VALIDATION',
        link: '/forms/validation',
        parentId: 132,
      },
      {
        id: 141,
        label: 'MENUITEMS.FORMS.LIST.WIZARD',
        link: '/forms/wizard',
        parentId: 132,
      },
      {
        id: 142,
        label: 'MENUITEMS.FORMS.LIST.EDITORS',
        link: '/forms/editors',
        parentId: 132,
      },
      {
        id: 143,
        label: 'MENUITEMS.FORMS.LIST.FILEUPLOADS',
        link: '/forms/file-uploads',
        parentId: 132,
      },
      {
        id: 144,
        label: 'MENUITEMS.FORMS.LIST.FORMLAYOUTS',
        link: '/forms/layouts',
        parentId: 132,
      },
    ],
  },
];
