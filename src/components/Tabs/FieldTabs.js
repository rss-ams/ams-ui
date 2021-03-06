import DynamicTabs from 'components/DynamicTabs';
import AddField from 'Pages/Field/AddField';
import FieldInfoPage from 'Pages/Field/FieldInfoPage';
import { useParams } from 'react-router';

const getTabToIndexMap = () => {
  let opToIndex = new Map();
  opToIndex.set('add', 0);
  opToIndex.set('info', 1);
  opToIndex.set('timeline', 2);
  return opToIndex;
};

const FieldTabs = () => {
  const { tab } = useParams();
  const tab0 = {
    component: AddField,
    name: 'add',
    location: '/fields/add',
    index: 0,
  };
  const tab1 = {
    component: FieldInfoPage,
    name: 'info',
    location: '/fields/info',
    index: 1,
  };

  return (
    <DynamicTabs
      tabs={[tab0, tab1]}
      selectedIndex={getTabToIndexMap().get(tab)}
    />
  );
};
export default FieldTabs;
