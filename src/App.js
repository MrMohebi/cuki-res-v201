import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import $ from 'jquery';
import '@popperjs/core/dist/cjs/popper'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle'
import Signin from "./Components/signin/Signin";
import Dashboard from "./Components/dashboard/Dashboard";
import Foods from "./Components/foods/Foods";
import EachFood from "./Components/eachFood/EachFood";
import Orders from "./Components/orders/Orders";

$("body").css({backgroundColor: '#b7b1c2'})

function App() {
  return (
    <div>
      <Router>
          <Route exact path='/' component={Signin}/>
          <Route exact path='/dashboard' component={Dashboard}/>
          <Route exact path='/foods' component={Foods}/>
          <Route path='/foodInfo' component={EachFood}/>
          <Route path='/orders' component={Orders}/>
      </Router>

    </div>
  );
}

export default App;
