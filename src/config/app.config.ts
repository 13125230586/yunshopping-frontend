export const APP_CONFIG = {
  title: '网上商城系统',
  description: '云商城系统 - 多店铺B2C电商平台',
  logo: '/logo.png',
  defaultAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',

  layout: {
    headerHeight: 64,
    footerHeight: 200,
    sidebarWidth: 200,
  },

  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: ['10', '20', '50', '100'],
    showSizeChanger: true,
    showQuickJumper: true,
  },

  upload: {
    maxSize: 2 * 1024 * 1024,
    accept: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    acceptText: 'jpg/jpeg/png/webp',
  },
}