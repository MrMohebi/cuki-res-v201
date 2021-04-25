import React from "react";
import * as requests from '../../ApiRequests/requests'
import NavBar from "../navBar/navBar";
import {Avatar} from "@material-ui/core";
import {getRandomColor} from "../../functions/randomColor";
import moment from "jalali-moment";

class EachUserCustomerClub extends React.Component {
    state = {
        name: 'در حال دریافت',
        phone: 'درحال دریافت',
        score: '0000',
        birthday: '0000/0/0',
        favFood: 'هنوز هیچی',
        userOrders: <div/>,
        showAll: false,
        allOrders: []
    }

    componentDidMount() {
        this.getUserInfo()
        this.setState({
            name: this.props.location.state[1].name,
            phone: this.props.location.state[1].phone,
            score: this.props.location.state[1].score,
            birthday: moment.unix(this.props.location.state[1].birthday).format("jYYYY/jMM/jDD"),
            job: this.props.location.state[1].job
        })

    }

    getUserInfo = () => {
        requests.getCustomerInfo(this.props.location.state[1].phone, this.getUserInfoCallback)
    }
    getUserInfoCallback = (res) => {

        let foods = {};
        let sortable = [];
        if (res.data.orderList) {
            for (let i = 0; i < res.data.orderList.length; i++) {
                JSON.parse(res.data.orderList[i].order_list).map(eachOrder => {
                    if (foods.hasOwnProperty(eachOrder.name)) {
                        foods[eachOrder.name]++
                    } else {
                        foods[eachOrder.name] = 1
                    }
                })
            }
            for (let y = 0; y < Object.keys(foods).length; y++) {
                let foodName = Object.keys(foods)[y]
                let count = foods[foodName]
                sortable.push([count, foodName])
            }
            sortable.sort(function (a, b) {
                return a[0] - b[0]
            })
            this.setState({
                favFood: sortable.reverse()[0][1]
            })
            this.state.allOrders = res.data.orderList

            this.prepareOrders(res.data.orderList)

        }
    }
    prepareOrders = (orderList) => {

        let orders = [];
        orders = orderList;
        let ordersUi = orders.slice(0, this.state.showAll ? orders.length : 5).map(eachOrder => {
            console.log(eachOrder)
            let foodsInOrder = JSON.parse(eachOrder.order_list).map(eachFood => {
                return (
                    <div
                        className={'mt-2 text-center pt-2 pb-2 eachCustomerOrderFoodNames'}>{eachFood.name + " " + eachFood.number}</div>
                )
            })
            return (
                <div className={'eachCustomerOrderContainer ml-2 mr-2 pb-2 mb-3 d-flex flex-column align-items-center'}>
                    <span className={'mt-2'}>{moment.unix(eachOrder.ordered_date).format("jYY/jMM/jDD")}</span>
                    <div className={'d-flex flex-row-reverse justify-content-center w-100 mt-2'}>
                        <span>:مبلغ سفارش</span>
                        <span>{parseInt(eachOrder.total_price) / 1000}</span>
                    </div>
                    <div className={'eachCustomerOrderFoods mt-1'}>
                        {foodsInOrder}
                    </div>
                </div>
            )
        })
        this.setState({
            userOrders: ordersUi
        })
    }

    render() {
        return (
            <div className={"w-100 h-100"}>
                <NavBar/>
                <div className={'justForGap'}/>
                <div className={'justForGap'}/>
                <div className={'smallBox d-flex flex-column justify-content-center'}>
                    <span className={'text-center'}>پروفایل مشتری</span>
                    <div className={'justForGap'}/>
                    <div className={'d-flex w-100 flex-row-reverse justify-content-center'}>
                        <div className={'w-50'}>
                            <div className={'w-100 d-flex flex-row-reverse'}>
                                <div className={'d-flex flex-row-reverse align-items-center'} style={{width: '120px'}}>
                                    <Avatar
                                        style={{backgroundColor: getRandomColor(), width: '50px', height: '50px'}}
                                        className={'m-auto mt-5 ml-1'}
                                        src="/broken-image.jpg"/>
                                    <span className={'text-right mr-4'}
                                          style={{fontSize: '1.5rem', whiteSpace: 'nowrap'}}>{this.state.name}
                                    </span>
                                </div>
                            </div>

                            <div className={'d-flex flex-row-reverse justify-content-start   align-items-center mt-3'}>
                                <svg style={{marginLeft: '10px'}} xmlns="http://www.w3.org/2000/svg" width="30"
                                     height="30"
                                     fill="currentColor"
                                     className="bi bi-award" viewBox="0 0 16 16">
                                    <path
                                        d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68L9.669.864zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702 1.509.229z"/>
                                    <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z"/>
                                </svg>
                                <span>: امتیاز</span>
                                <span className={'mr-1'}> {this.state.score} </span>
                            </div>
                            <div className={'d-flex flex-row-reverse justify-content-start   align-items-center mt-3'}>
                                <svg style={{marginLeft: '5px'}} xmlns="http://www.w3.org/2000/svg" width="30"
                                     height="30"
                                     fill="currentColor"
                                     className="bi bi-phone" viewBox="0 0 16 16">
                                    <path
                                        d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z"/>
                                    <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                                </svg>
                                <span>  : شماره </span>
                                <span className={'mr-1'}> {this.state.phone} </span>
                            </div>
                            <div className={'d-flex flex-row-reverse justify-content-start   align-items-center mt-3'}>
                                <svg style={{marginLeft: '10px'}} xmlns="http://www.w3.org/2000/svg" width="30"
                                     height="30"
                                     fill="currentColor"
                                     className="bi bi-phone" viewBox="0 0 16 16">
                                    <path
                                        d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                                </svg>
                                <span>  : تاریخ تولد </span>
                                <span className={'mr-1'}> {this.state.birthday}</span>
                            </div>
                            <div className={'d-flex flex-row-reverse justify-content-start   align-items-center mt-3'}>
                                <svg style={{marginLeft: '10px'}} xmlns="http://www.w3.org/2000/svg" width="30"
                                     height="30"
                                     fill="currentColor"
                                     className="bi bi-phone" viewBox="0 0 16 16">
                                    <path
                                        d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                                </svg>
                                <span>  :  غذای مورد علاقه </span>
                                <span
                                    className={'mr-1'}> {this.state.favFood ? this.state.favFood : 'هنوز هیچی'} </span>
                            </div>
                            <div className={'d-flex flex-row-reverse justify-content-start   align-items-center mt-3'}>
                                <svg style={{marginLeft: '10px'}} xmlns="http://www.w3.org/2000/svg" width="30"
                                     height="30"
                                     fill="currentColor"
                                     className="bi bi-phone" viewBox="0 0 16 16">
                                    <path
                                        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                                </svg>
                                <span>: شغل</span>
                                <span
                                    className={'mr-1'}> {this.state.job ? this.state.job : 'هنوز هیچی'} </span>
                            </div>
                        </div>
                        <div className={'w-50 d-flex flex-row justify-content-center align-items-center'}/>
                    </div>

                </div>

                <div className={'smallBox mt-2 d-flex flex-column justify-content-center align-items-center'}>
                    <span className={'text-center'}>سفارش های مشتری</span>
                    <div className=" d-flex flex-row justify-content-center flex-wrap align-items-center mt-4">
                        {
                            this.state.userOrders
                        }
                        {this.state.showAll === false ?

                            <a onClick={() => {
                                this.state.showAll = true;
                                this.prepareOrders(this.state.allOrders)
                            }
                            } className={'w-100 text-center cursorPointer'}> نمایش همه</a>
                            :
                            <a onClick={() => {
                                this.state.showAll = false;
                                this.prepareOrders(this.state.allOrders)
                            }
                            } className={'w-100 text-center cursorPointer'}> نمایش 5 سفارش اخیر</a>
                        }
                    </div>
                </div>
            </div>
        )
    }
}


export default EachUserCustomerClub;