import DynamicTabs from 'components/DynamicTabs';
import AddCrop from 'Pages/Crop/AddCrop';
import CropInfoPage from 'Pages/Crop/CropInfoPage';

import { useParams } from 'react-router';

const getTabToIndexMap = () => {
  let opToIndex = new Map();
  opToIndex.set('add', 0);
  opToIndex.set('info', 1);
  return opToIndex;
};

const CropTabs = () => {
  const { tab } = useParams();

  const tab0 = {
    component: AddCrop,
    name: 'add',
    location: '/crops/add',
    index: 0,
  };
  const tab1 = {
    component: CropInfoPage,
    name: 'info',
    location: '/crops/info',
    index: 1,
  };
  return (
    <DynamicTabs
      tabs={[tab0, tab1]}
      selectedIndex={getTabToIndexMap().get(tab)}
    />
  );
};
export default CropTabs;
