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
import NavBar from "./Components/navBar/navBar";
import RestaurantInfo from "./Components/restaurantInfo/RestaurantInfo";
import NewFood from "./Components/NewFood/NewFood";

$("body").css({backgroundColor: '#b7b1c2'})

function App() {
  return (
    <div>
      <Router>
          <Route exact path='/' component={Signin}/>
          <Route exact path={['/dashboard','/foods','/orders','/resinfo','/foodinfo']} component={NavBar}/>
          <Route exact path='/dashboard' component={Dashboard}/>
          <Route exact path='/foods' component={Foods}/>
          <Route path='/foodInfo' component={EachFood}/>
          <Route path='/orders' component={Orders}/>
          <Route path='/resinfo' component={RestaurantInfo}/>
          <Route path='/newFood' component={NewFood}/>
      </Router>

    </div>
  );
}

export default App;
