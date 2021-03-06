import DynamicTabs from 'components/DynamicTabs';
import AddInspectionPage from 'Pages/Inspection/AddInspectionPage';
import { useParams } from 'react-router';

const getTabToIndexMap = () => {
  let opToIndex = new Map();
  opToIndex.set('update', 0);
  return opToIndex;
};

const InspectionTabs = () => {
  const { tab } = useParams();
  const tab0 = {
    component: AddInspectionPage,
    name: 'update',
    location: '/inspections/update',
    index: 0,
  };

  return (
    <DynamicTabs tabs={[tab0]} selectedIndex={getTabToIndexMap().get(tab)} />
  );
};

export default InspectionTabs;
