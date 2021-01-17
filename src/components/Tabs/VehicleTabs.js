import DynamicTabs from 'components/DynamicTabs';
import AddVehicle from 'Pages/AddVehicle';

const VehicleTabs = () => {
  return <DynamicTabs component1={AddVehicle} />;
};
export default VehicleTabs;
