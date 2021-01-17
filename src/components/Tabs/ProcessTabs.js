import DynamicTabs from 'components/DynamicTabs';
import ProcessPage from 'Pages/ProcessPage';
import { useParams } from 'react-router';

const getTabToIndexMap = () => {
  let opToIndex = new Map();
  opToIndex.set('update', 0);
  return opToIndex;
};

const ProcessTabs = () => {
  const { tab } = useParams();
  const tab0 = {
    component: ProcessPage,
    name: 'update',
    location: '/processes/update',
    index: 0,
  };

  return (
    <DynamicTabs tabs={[tab0]} selectedIndex={getTabToIndexMap().get(tab)} />
  );
};

export default ProcessTabs;
