import ProcessTabs from 'components/Tabs/ProcessTabs';
import CropCycleTabs from 'components/Tabs/CropCycleTabs';
import CropTabs from 'components/Tabs/CropTabs';
import FieldTabs from 'components/Tabs/FieldTabs';
import VehicleTabs from 'components/Tabs/VehicleTabs';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import ApplnBar from './components/ApplnBar';

function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <ApplnBar />
        <Switch>
          <Route path='/fields/:tab' component={FieldTabs} />
          <Route path='/fields' component={FieldTabs} />
          <Route path='/crops/:tab' component={CropTabs} />
          <Route path='/crop-cycles/:tab' component={CropCycleTabs} />
          <Route path='/processes/:tab' component={ProcessTabs} />
          <Route path='/vehicles/:tab' component={VehicleTabs} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
