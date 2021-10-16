import React from 'react';
import {useSelector} from "react-redux"
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
import TurnPhone from "./Components/TurnPhone/TurnPhone";
import CustomerClub from './Components/CustomerClub/CustomerClub'
import EachUserCustomerClub from "./Components/CustomerClub/EachUserCustomerClub";
import Tutorials from "./Components/Tutorials/Tutorials";


import {getCacheToken} from "./Stores/cache/cacheData"
import * as actions from "./Stores/reduxStore/actions"



$("body").css({backgroundColor: '#b7b1c2'})

function App() {

    useSelector((state)=>{
        const cacheToken = getCacheToken()
        if(state.reducerRestaurantUser.token !== cacheToken && cacheToken !== undefined && cacheToken.length > 10){
            actions.setToken(cacheToken)
        }
    })

    return (
    <div>
      <Router>
          <Route exact path='/' component={Signin}/>
          <Route exact path={['/dashboard','/foods','/orders','/resinfo','/foodinfo','/newFood']} component={NavBar}/>
          <Route exact path={['/dashboard','/foods','/orders','/resinfo','/foodinfo','/newFood']} component={TurnPhone}/>
          <Route exact path='/dashboard' component={Dashboard}/>
          <Route exact path='/foods' component={Foods}/>
          <Route path='/CustomerClub' component={CustomerClub}/>
          <Route path='/foodInfo' component={EachFood}/>
          <Route path='/tutorials' component={Tutorials}/>
          <Route path='/EachUserCustomerClub' component={EachUserCustomerClub}/>
          <Route path='/orders' component={Orders}/>
          <Route path='/resinfo' component={RestaurantInfo}/>
          <Route path='/newFood' component={NewFood}/>
      </Router>

    </div>
  );
}

export default App;
