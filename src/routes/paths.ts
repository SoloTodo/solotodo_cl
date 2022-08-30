
function path(root: string, sublink: string) {
    return `${root}${sublink}`;
  }

const ROOTS_AUTH = '/auth';
const ROOTS_MAIN = '/';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: '/login',
  register: '/register',
  change_password: path(ROOTS_AUTH, '/change_password'),
  reset_password: path(ROOTS_AUTH, '/reset_password'),
  verify: path(ROOTS_AUTH, '/verify')
};

export const PATH_MAIN = {
  root: ROOTS_MAIN,
  legal_information: path(ROOTS_MAIN, 'legal_information'),
  contacto: path(ROOTS_MAIN, 'contacto'),
  data_deletion: path(ROOTS_MAIN, 'data_deletion'),
  budgets: path(ROOTS_MAIN, 'budgets'),
  products: path(ROOTS_MAIN, 'products')
}