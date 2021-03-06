import DynamicTabs from 'components/DynamicTabs';
import ProcessPage from 'Pages/Process/ProcessPage';
import { useParams } from 'react-router';

const getTabToIndexMap = () => {
  let opToIndex = new Map();
  opToIndex.set('update', 0);
  opToIndex.set('info', 1);
  return opToIndex;
};

const ProcessTabs = () => {
  const { tab } = useParams();
  const updateTab = {
    component: ProcessPage,
    name: 'update',
    location: '/processes/update',
    index: 0,
  };
  const infoTab = {
    component: ProcessPage,
    name: 'info',
    location: '/processes/info',
    index: 1,
  };

  return (
    <DynamicTabs
      tabs={[updateTab, infoTab]}
      selectedIndex={getTabToIndexMap().get(tab)}
    />
  );
};

export default ProcessTabs;
