import { CheckWinner } from './components/CheckWinner';
import { PoolList } from './components/PoolList';

export const CheckPage = () => {
  return (
    <div className="container py-10 pb-24 space-y-16">
      <CheckWinner />

      <div>
        <PoolList />
      </div>
    </div>
  );
};
