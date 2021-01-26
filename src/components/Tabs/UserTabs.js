import DynamicTabs from 'components/DynamicTabs';
import User from 'Pages/User';
import { useParams } from 'react-router';

const getTabToIndexMap = () => {
  let opToIndex = new Map();
  opToIndex.set('add', 0);
  return opToIndex;
};

const UserTabs = () => {
  const { tab } = useParams();
  const tab0 = {
    component: User,
    name: 'add',
    location: '/users/add',
    index: 0,
  };

  return (
    <DynamicTabs tabs={[tab0]} selectedIndex={getTabToIndexMap().get(tab)} />
  );
};

export default UserTabs;
