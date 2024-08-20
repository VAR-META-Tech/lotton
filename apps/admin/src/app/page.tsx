import { LOGGED_IN_KEY, USER_COOKIES } from '@/lib/const';
import { ROUTES } from '@/lib/routes';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const HomePage = () => {
  const cookieStore = cookies();
  const accountStatus = cookieStore.get(USER_COOKIES.isLoggedIn)?.value;
  const isLoggedIn = accountStatus === LOGGED_IN_KEY;

  if (isLoggedIn) {
    return redirect(ROUTES.POOL);
  }

  return redirect(ROUTES.LOGIN);
};

export default HomePage;
