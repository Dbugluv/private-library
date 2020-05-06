import React from 'react';
import Login from './pages/Login';
import { BrowserRouter as Router,Route} from 'react-router-dom';

import Register from './pages/Register'
import Homepage from './pages/Homepage'
import './theme.scss'

class App extends React.Component {

  render() {
    
    return (
      <Router>
        <Route exact path="/" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/homepage/:userId" component={Homepage} />
      </Router>
    );
  }
}

export default App;
