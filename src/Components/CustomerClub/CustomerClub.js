import React from "react";

import * as requests from '../../ApiRequests/requests'
import {CartesianGrid, Line, LineChart, XAxis, YAxis} from 'recharts';
import NavBar from "../navBar/navBar";
import medal from './assets/img/medal.png'
import './css/CustomerClub.css'
import {Avatar} from "@material-ui/core";
import moment from "jalali-moment";
import {Link} from "react-router-dom";
import {getRandomColor} from '../../functions/randomColor'
class CustomerClub extends React.Component {
    constructor(props) {
        super(props);
        this.mostOrderedFoodsContainerRef = React.createRef();
    }
    state = {
        mostOrderedFoods: [],
        mostOrderedFoodsUi: [],
        customersUI: [],
        startOrdersDate: 0,
        endOrdersDate: 0,
        chartData: [
            {name: 'شنبه', uv: 10, pv: 200, amt: 2400},
            {name: 'یکشنبه', uv: 5, pv: 2400, amt: 2400},
            {name: 'دوشنبه', uv: 10, pv: 2400, amt: 2400},
            {name: 'سه شنبه', uv: 5, pv: 2400, amt: 2400},
            {name: 'چهار شنبه', uv: 10, pv: 2400, amt: 2400},
            {name: 'پنج شنبه', uv: 5, pv: 2400, amt: 2400},
            {name: 'جمعه', uv: 10, pv: 2400, amt: 2400},
        ],
        nextWeekAnimateClass: 'invisible',
        ableToChangeWeekPrev: false,
        ableToChangeWeekNext: false,
        showAllFoods:false,
        allFoods:[]
    }

    componentDidMount() {
        requests.getAllCustomersInfo(this.getAllCustomersInfoCallback);
        this.getFoods();
        let startDate = (moment.unix(moment().unix() - moment().jDay() * 24 * 3600).unix())
        let endDate = startDate + 6 * 24 * 3600
        this.state.startOrdersDate = startDate
        this.state.endOrdersDate = endDate
        this.getOrders(startDate, endDate)
    }

    getOrders = (start, end) => {
        requests.getOrders(start, end, this.getOrdersCallback);
    }

    getOrdersCallback = (res) => {
        let orders = {};
        for (let u = 0; u < 7; u++) {
            let thisDayOrders = []
            for (let i = 0; i < res.data.length; i++) {
                if (moment.unix(res.data[i].ordered_date).jDay() === u) {
                    thisDayOrders.push(res.data[i])
                }
            }
            orders[u] = thisDayOrders;
        }
        this.setState({
            chartData: [
                {name: 'شنبه', uv: orders[0].length, pv: 200, amt: 2400},
                {name: 'یکشنبه', uv: orders[1].length, pv: 2400, amt: 2400},
                {name: 'دوشنبه', uv: orders[2].length, pv: 2400, amt: 2400},
                {name: 'سه شنبه', uv: orders[3].length, pv: 2400, amt: 2400},
                {name: 'چهار شنبه', uv: orders[4].length, pv: 2400, amt: 2400},
                {name: 'پنج شنبه', uv: orders[5].length, pv: 2400, amt: 2400},
                {name: 'جمعه', uv: orders[6].length, pv: 2400, amt: 2400},
            ]
        })


        let thisWeek = moment().unix() - (moment().jDay() * 24 * 3600)
        if (moment.unix(thisWeek).jWeek() === moment.unix(this.state.startOrdersDate).jWeek() && moment.unix(thisWeek).jMonth() === moment.unix(this.state.startOrdersDate).jMonth() && moment.unix(thisWeek).jYear() === moment.unix(this.state.startOrdersDate).jYear()) {
            this.setState({
                nextWeekAnimateClass: 'animate__fadeOut PED'
            })
        } else {
            this.setState({
                nextWeekAnimateClass: 'animate__fadeIn'
            })
            this.state.ableToChangeWeekNext = true;
        }
        this.state.ableToChangeWeekPrev = true;


    }


    handleUserClick = (customer)=>{
        this.props.history.push({
            pathname: '/EachUserCustomerClub',
            state: customer
        });
    }

    getAllCustomersInfoCallback = (res) => {
        let storable = []
        res.data.map(eachCustomer => {
            if (eachCustomer.phone[0] === "0")
                storable.push([parseInt(eachCustomer.score), eachCustomer])
        })
        storable.sort(function (a, b) {
            return a[0] - b[0]
        })
        let customersUI = storable.reverse().map(eachCustomer => {
            return (
                (


                    <tr onClick={()=>{
                        this.handleUserClick(eachCustomer)
                    }} className={'eachUserCustomerClub '} style={{borderSpacing: "0px 30px", cursor: "pointer"}}>
                        <td className={'text-center'} style={{borderRadius: '0 15px 15px 0 ', border: '0'}}><Avatar
                            style={{backgroundColor: getRandomColor()}} className={'m-auto'}
                            src="/broken-image.jpg"/>
                        </td>

                        {/*TODO change to name*/}
                        <td className={'text-center'} style={{border: '0'}}>{eachCustomer[1].name}</td>
                        <td className={'text-center'} style={{border: '0'}}>{eachCustomer[1].score}</td>
                        <td className={'text-center'} style={{border: '0'}}>{eachCustomer[1].order_times}</td>
                        <td className={'text-center'} style={{borderRadius: '15px 0 0px 15px', border: '0'}}>همبرگر
                            پنیری
                        </td>
                    </tr>
                )

            )

        })
        this.setState({
            customersUI: customersUI
        })
    }

    checkFoods = (response) => {

        if (response.statusCode === 200) {
            this.state.allFoods = response
            let sortable = []

            this.state.allFoods.data.map(eachFood => {
                sortable.push([parseInt(eachFood.order_times), eachFood])
            })
            sortable.sort(function (a, b) {
                return a[0] - b[0];
            });
            let firstFood = true;
            let mostOrderedFoodsUi = sortable.reverse().slice(0, this.state.showAllFoods ? 20 : 5).map(eachFood => {
                return (
                    <div
                        className={' animate__animated invisible eachMFoodContainer mr-3 mb-4 d-flex flex-column align-items-center justify-content-around '}>
                        <div className={'eachMFoodImage'} style={{
                            background: `url(${eachFood[1].thumbnail})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}>
                            <div className={'w-50 h-50'} style={firstFood ? {
                                background: `url(${medal})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                marginTop: '-10px',
                                marginLeft: '-10px'
                            } : {display: 'none'}}/>
                        </div>
                        {firstFood = false}
                        <span className={'eachMFoodName IranSansMedium w-'}>{eachFood[1].name}</span>
                        <div
                            className={'eachMFoodOrderedTimesContainer w-100 pl-3 pr-3 d-flex flex-row justify-content-around'}>
                            <span>{eachFood[1].order_times}</span>
                            <span>تعداد سفارش</span>
                        </div>
                    </div>

                )
            })

            this.setState({
                mostOrderedFoodsUi: mostOrderedFoodsUi
            },()=>{
                console.log(this.mostOrderedFoodsContainerRef.current.childNodes[0].classList)

                for (let i = 0 ;i<this.mostOrderedFoodsContainerRef.current.childNodes.length;i++){
                    setTimeout(()=>{
                        if (this.mostOrderedFoodsContainerRef.current.childNodes[i].classList.contains("invisible")){
                            this.mostOrderedFoodsContainerRef.current.childNodes[i].classList.remove("invisible")
                            this.mostOrderedFoodsContainerRef.current.childNodes[i].classList.add("animate__fadeInUp")
                        }
                    },i*80)
                }
            });
        }
    }

    getFoods = () => {
        requests.getFoods(this.checkFoods)
    }
    weekChangeHandler = (week) => {
        this.state.ableToChangeWeekPrev = false;
        this.state.ableToChangeWeekNext = false;
        if (week === 'next') {
            this.state.startOrdersDate = this.state.startOrdersDate + 7 * 24 * 3600
            this.state.endOrdersDate = this.state.startOrdersDate + 7 * 24 * 3600
            this.getOrders(this.state.startOrdersDate, this.state.endOrdersDate)
        } else {
            this.state.startOrdersDate = this.state.startOrdersDate - 7 * 24 * 3600
            this.state.endOrdersDate = this.state.startOrdersDate + 7 * 24 * 3600
            this.getOrders(this.state.startOrdersDate, this.state.endOrdersDate)
        }

    }
    previousWeek = () => {
        if (this.state.ableToChangeWeekPrev) {
            this.weekChangeHandler('pre')
        }
    }
    nextWeek = () => {
        if (this.state.ableToChangeWeekNext) {
            this.weekChangeHandler('next')
        }
    }

    render() {

        return (
            <div>
                <NavBar/>
                <div className={'justForGap'}/>
                <div className={'justForGap'}/>
                <div className="smallBox d-flex flex-column align-items-center mb-2">
                    <span className={'IranSansMedium mb-3'}>
                        غذا های برتر رستوران
                    </span>
                    <div ref={this.mostOrderedFoodsContainerRef} className={'w-100 d-flex flex-row-reverse mostOrderedHolder overflow-hidden flex-wrap justify-content-center align-items-center pb-3'}>
                        {this.state.mostOrderedFoodsUi}
                    </div>
                    <a className={'cursorPointer w-100 text-center'} onClick={()=>{
                        if (this.state.showAllFoods){
                            this.setState({
                                showAllFoods : false,
                            },()=>{
                                this.checkFoods(this.state.allFoods)

                            })
                        }else{
                            this.setState({
                                showAllFoods : true,
                            },()=>{
                                this.checkFoods(this.state.allFoods)

                            })
                        }

                    }}>{this.state.showAllFoods===false?"نمایش 20 غذای برتر":"نمایش کمتر"} </a>

                </div>
                <div className="smallBox d-flex flex-column align-items-center">
                    <div className={'w-100 d-flex flex-row justify-content-around align-items-center'}>
                        <span onClick={this.previousWeek} className={'IranSans mb-3 cursorPointer'}>هفته قبل</span>
                        <span className={'IranSans mb-3'}>نمودار فروش</span>
                        <span onClick={this.nextWeek}
                              className={'IranSans mb-3 cursorPointer animate__animated ' + this.state.nextWeekAnimateClass}>هفته بعد</span>
                    </div>
                    <LineChart width={600} height={400} data={this.state.chartData}>
                        <Line type="monotone" dataKey="uv" stroke="#8884d8"/>
                        <CartesianGrid stroke="#ccc"/>
                        <XAxis dataKey="name"/>
                        <YAxis/>
                    </LineChart>
                </div>

                <div className="smallBox d-flex flex-column align-items-center mt-2">
                    <table className={'w-100'}
                           style={{direction: 'rtl', borderCollapse: 'separate', borderSpacing: '0 10px'}}>
                        <tr className={'mb-3'}>
                            <th className={'text-center'}>پروفایل</th>
                            <th className={'text-center'}>شماره</th>
                            <th className={'text-center'}>امتیاز</th>
                            <th className={'text-center'}>تعداد سفارش</th>
                            <th className={'text-center'}>غذای مورد علاقه</th>
                        </tr>

                        {this.state.customersUI}


                    </table>
                </div>
            </div>


        )
    }
}

export default CustomerClub;