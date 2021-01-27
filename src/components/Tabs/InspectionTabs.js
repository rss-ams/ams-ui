import DynamicTabs from 'components/DynamicTabs';
import AddInspectionPage from 'Pages/AddInspectionPage';
import { useParams } from 'react-router';

const getTabToIndexMap = () => {
  let opToIndex = new Map();
  opToIndex.set('post', 0);
  return opToIndex;
};

const InspectionTabs = () => {
  const { tab } = useParams();
  const tab0 = {
    component: AddInspectionPage,
    name: 'post',
    location: '/inspections/post',
    index: 0,
  };

  return (
    <DynamicTabs tabs={[tab0]} selectedIndex={getTabToIndexMap().get(tab)} />
  );
};

export default InspectionTabs;
