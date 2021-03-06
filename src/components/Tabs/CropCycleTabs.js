import DynamicTabs from 'components/DynamicTabs';
import AddCropCycle from 'Pages/CropCycle/AddCropCycle';
import CropCycleInfoPage from 'Pages/CropCycle/CropCycleInfoPage';
import CropCycleTimeline from 'Pages/CropCycle/CropCycleTimeline';
import { useParams } from 'react-router';

const getTabToIndexMap = () => {
  let opToIndex = new Map();
  opToIndex.set('add', 0);
  opToIndex.set('info', 1);
  opToIndex.set('timeline', 2);
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
  const tab2 = {
    component: CropCycleTimeline,
    name: 'timeline',
    location: '/crop-cycles/timeline',
    index: 2,
  };
  return (
    <DynamicTabs
      tabs={[tab0, tab1, tab2]}
      selectedIndex={getTabToIndexMap().get(tab)}
    />
  );
};

export default CropCycleTabs;
