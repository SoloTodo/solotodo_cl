
function path(root: string, sublink: string) {
    return `${root}${sublink}`;
  }

const ROOTS_AUTH = '/auth';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: '/login',
  change_password: path(ROOTS_AUTH, '/change_password'),
  reset_password: path(ROOTS_AUTH, '/reset_password'),
  verify: path(ROOTS_AUTH, '/verify')
};
