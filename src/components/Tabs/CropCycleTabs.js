import DynamicTabs from 'components/DynamicTabs';
import AddCropCycle from 'Pages/AddCropCycle';
import CropCycleInfoPage from 'Pages/CropCycleInfoPage';
import { useParams } from 'react-router';

const getTabToIndexMap = () => {
  let opToIndex = new Map();
  opToIndex.set('add', 0);
  opToIndex.set('info', 1);
  return opToIndex;
};

const CropCycleTabs = () => {
  const { tab } = useParams();

  const tab0 = {
    component: AddCropCycle,
    name: 'add',
    location: '/crop-cycles/add',
    index: 0,
  };
  const tab1 = {
    component: CropCycleInfoPage,
    name: 'info',
    location: '/crop-cycles/info',
    index: 1,
  };
  return (
    <DynamicTabs
      tabs={[tab0, tab1]}
      selectedIndex={getTabToIndexMap().get(tab)}
    />
  );
};

export default CropCycleTabs;
