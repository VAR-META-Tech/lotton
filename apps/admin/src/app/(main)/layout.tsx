import dynamic from 'next/dynamic';

const MainLayout = dynamic(() => import('@/components/main-layout'), { ssr: false });

export default MainLayout;
