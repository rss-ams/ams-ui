import ProcessTabs from 'components/Tabs/ProcessTabs';
import CropCycleTabs from 'components/Tabs/CropCycleTabs';
import CropTabs from 'components/Tabs/CropTabs';
import FieldTabs from 'components/Tabs/FieldTabs';
import UserTabs from 'components/Tabs/UserTabs';
import React from 'react';
import Home from 'Pages/Home';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import ApplnBar from './components/ApplnBar';

function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <ApplnBar />
        <Switch>
          <Route path='/home' component={Home} />
          <Route path='/fields/:tab' component={FieldTabs} />
          <Route path='/crops/:tab' component={CropTabs} />
          <Route path='/crop-cycles/:tab' component={CropCycleTabs} />
          <Route path='/processes/:tab' component={ProcessTabs} />
          <Route path='/users/:tab' component={UserTabs} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
