import { LOGGED_IN_KEY, USER_COOKIES } from '@/lib/const';
import { ROUTES } from '@/lib/routes';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const HomePage = () => {
  return redirect(ROUTES.POOL);
};

export default HomePage;
