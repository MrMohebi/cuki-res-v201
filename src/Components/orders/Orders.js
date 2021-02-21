import React from "react";
import {connect} from 'react-redux';
import {Slide, Snackbar} from '@material-ui/core';
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker from '@hassanmojab/react-modern-calendar-datepicker';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import moment from 'moment';
import {
    faChevronDown,
    faCommentAlt,
    faMapMarkerAlt,
    faPhone,
    faTrash,
    faUtensils
} from "@fortawesome/free-solid-svg-icons";
import './css/stylesheet.css';
import * as actions from "../../Stores/reduxStore/actions";
import * as requests from '../../ApiRequests/requests';
import * as func from './js/function';
import {Link} from "react-router-dom";

const ReactSwal = withReactContent(Swal)

class Orders extends React.Component {

    nowTimestamp = Math.floor(Date.now() / 1000)
    isInDash = false
    isThereFood = false
    uiWaitToFetch = <div/>;
    state = {
        rows: false,
        orders: [],
        uiRender: this.uiWaitToFetch,
        datePikerDate: {},
        lastNumberOfOrders: 0,
        useSnackbar: true,
        snackbarOpen: false,
        orderStatusPersian: {
            inLine: 'در صف',
            done: 'انجام شده',
            delivered: 'تحویل شده',
            deleted: 'حذف شده'

        },
        scroll: 0
    }

    handleClick = (Transition) => () => {
        this.setState({
            snackbarOpen: true,
            snackbarTransiation: this.SlideTransition,
        });
    };

    componentDidMount() {
        if (!(this.props.ordersShowDates.from && true)) {
            this.props.setShowOrdersDates({
                from: func.todayDateJalali(),
                to: func.todayDateJalali(),
            })
            this.getOrders(this.nowTimestamp - func.todayPassedSeconds(), this.nowTimestamp)
        } else {
            let selectedDate = this.props.ordersShowDates
            let startDate = func.date2timestamp(func.JalaliDate.jalaliToGregorian(selectedDate.from.year, selectedDate.from.month, selectedDate.from.day).join("-")) / 1000;
            let endDate = (func.date2timestamp(func.JalaliDate.jalaliToGregorian(selectedDate.to.year, selectedDate.to.month, selectedDate.to.day).join("-")) / 1000) + 86400;
            this.getOrders(startDate, endDate)
        }
        this.refreshOrderList()

    }

    componentWillUnmount() {
        clearInterval(this.intervalId)
    }

    refreshOrderList = () => {
        let selectedDate = this.state.datePikerDate
        if (selectedDate.from && selectedDate.to) {
            let startDate = func.date2timestamp(func.JalaliDate.jalaliToGregorian(selectedDate.from.year, selectedDate.from.month, selectedDate.from.day).join("-")) / 1000;
            let endDate = (func.date2timestamp(func.JalaliDate.jalaliToGregorian(selectedDate.to.year, selectedDate.to.month, selectedDate.to.day).join("-")) / 1000) + 86400;
            this.getOrders(startDate, endDate)
        } else {
            let startDate = moment.now() / 1000 - (24 * 60 * 60) * 2
            let endDate = moment.now() / 1000
            this.getOrders(startDate, endDate)
        }

    }

    intervalId = setInterval(this.refreshOrderList, 3000);

    componentWillUpdate(nextProps, nextState, nextContext) {
    }

    checkOrders = (response) => {
        if (response.statusCode === 200) {
            if (this.state.lastNumberOfOrders !== response.data.length)
                this.setState({
                    snackbarOpen: true,
                })
            this.setState({
                uiRender: this.uiComponentBigDevice(),
                lastNumberOfOrders: response.data.length,
                orders: response.data
            });
        }
    }

    getOrders = (startDate, endDate) => {
        requests.getOrders(startDate, endDate, this.checkOrders)
    }

    onChangeCalender = (selectedDate) => {
        this.setState({
            datePikerDate: selectedDate,
        })
        if (selectedDate.from && selectedDate.to) {
            this.props.setShowOrdersDates(selectedDate)
            let startDate = func.date2timestamp(func.JalaliDate.jalaliToGregorian(selectedDate.from.year, selectedDate.from.month, selectedDate.from.day).join("-")) / 1000;
            let endDate = (func.date2timestamp(func.JalaliDate.jalaliToGregorian(selectedDate.to.year, selectedDate.to.month, selectedDate.to.day).join("-")) / 1000) + 86400;
            this.getOrders(startDate, endDate, this.checkOrders)
        }
    }

    callBackChangeOrderStatus = (res) => {
        this.refreshOrderList()
        if ((res.statusCode === 200) || (res.statusCode === 400 && res.info !== undefined)) {
            this.onChangeCalender(this.state.datePikerDate);
            ReactSwal.fire({
                title: <h2>!با موفقیت انجام شد</h2>,
                icon: "success",
                timer: 2000,
                timerProgressBar: true
            })
            this.refreshOrderList()
            document.documentElement.scrollTop = this.state.scroll

        }
    }

    handelChangeOrderStatus = (trakingId, newStatus, deleteReason) => {
        this.state.scroll = document.documentElement.scrollTop
        requests.changeOrderStatus(trakingId, newStatus, deleteReason, this.callBackChangeOrderStatus)
    }

    render() {
        return (
            <React.Fragment>

                {/*new order got*/}
                <Snackbar
                    open={this.state.snackbarOpen}
                    onClose={() => {
                        this.setState({snackbarOpen: false,})
                    }}
                    autoHideDuration={2000}
                    message="سفارش جدید دریافت شد"
                    TransitionComponent={(props) => {
                        return <Slide {...props} direction="up"/>
                    }}
                />

                <div className='navGap'/>
                <div className="smallBox mainContainerOrders">
                    {this.state.datePikerDate.from && true ? (
                        <div style={{marginBottom: '10px'}}>
                            <DatePicker value={this.state.datePikerDate} onChange={this.onChangeCalender} locale='fa'
                                        shouldHighlightWeekends/>
                        </div>

                    ) : (
                        <div style={{marginBottom: '10px'}}>
                            <DatePicker value={{
                                from: func.todayDateJalali(),
                                to: func.todayDateJalali()
                            }}
                                        onChange={this.onChangeCalender} locale='fa' shouldHighlightWeekends
                            />
                        </div>

                    )}
                    {this.isThereFood ? null : this.uiComponentNothinFound()}
                    {this.state.orders.length > 1 ? this.createRows() : <div/>}
                    {window.location.pathname === '/dashboard' ?
                        <Link style={{
                            color: 'blue',
                            width: '100%',
                            display: 'block',
                            textAlign: 'right',
                            marginTop: '20px'
                        }}
                              to={'/orders'}><span style={{width: '100$', textAlign: 'center', marginTop: '20px'}}>
نمایش لیست کامل ...
                    </span></Link>
                        : null}
                </div>
            </React.Fragment>

        )
    }

    createRows = () => {
        this.isInDash = true
        let howManyToShow = window.location.pathname == '/dashboard' ? 4 : this.state.orders.length
        return (
            this.state.orders.slice(0, howManyToShow).map(eachOrder => {
                this.isThereFood = true
                let foodsDetails = JSON.parse(eachOrder.details)
                let orderList = JSON.parse(eachOrder.order_list)
                let sum = 0;
                let payStatus = func.numberWithCommas(eachOrder.paid_amount ? eachOrder.paid_amount : 0);
                orderList.forEach((item) => {
                    sum += item.number * item.priceAfterDiscount;
                });
                sum = func.numberWithCommas(sum);

                let orderStatus = eachOrder.order_status
                let twoOtherOption = orderStatus === 'inLine' ? [
                        'انجام شده'
                        , 'تحویل شده'
                    ]

                    : orderStatus === 'done' ? [
                            'در صف'
                            , 'تحویل شده'
                        ]
                        : [
                            'در صف'
                            , 'انجام شده'
                        ]
                let btnClasses = (eachOrder.order_status === 'done' ? 'btn-success' : eachOrder.order_status === 'inLine' ? 'btn-outline-primary' : eachOrder.order_status === 'delivered' ? 'btn-warning' : eachOrder.order_status === 'deleted' ? 'btn-outline-danger' : 'btn-outline-black')
                return (
                    [
                        <tr className="bg-white" id={"orderRowID_" + eachOrder.orders_id}
                            key={"orderRowID_" + eachOrder.orders_id}>
                            <td className="in-queue text-primary" href={"#MoreInfoID_" + eachOrder.orders_id}
                                data-toggle="collapse" style={{cursor: "pointer", userSelect: "text "}}>
                                <FontAwesomeIcon icon={faChevronDown}/> {eachOrder.tracking_id} </td>
                            <td>
                                {
                                    orderList.map(eachFood => {
                                        return (
                                            <div key={Math.floor(Math.random() * 10000)}>
                                                {eachFood.name} => {eachFood.number}
                                            </div>
                                        )
                                    })
                                }
                            </td>
                            <td className="d-none d-sm-table-cell">{func.days_passed(eachOrder.ordered_date) ? func.days_passed(eachOrder.ordered_date).split("\n").map(eachPart => {
                                return <p>{eachPart}</p>
                            }) : ''}</td>
                            <td className="d-none d-sm-table-cell">{sum} <br/><span
                                style={{color: "#0dec1a"}}>{payStatus}</span></td>
                            <td className="d-none d-sm-table-cell ltr IranSansMedium">
                                <div className="btn-group">
                                    <button type="button"
                                            className={'btn ' + btnClasses}
                                            onClick={() => {
                                                eachOrder.order_status === 'done' ? this.handelChangeOrderStatus(eachOrder.tracking_id, 'inLine') : this.handelChangeOrderStatus(eachOrder.tracking_id, 'done')
                                            }}>
                                        {this.state.orderStatusPersian[orderStatus.toString()]}

                                    </button>
                                    <button type="button"
                                            className={"btn dropdown-toggle dropdown-toggle-split " + btnClasses}
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <span className="sr-only">Toggle Dropdown</span>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item IranSansMedium" onClick={() => {
                                            this.handelChangeOrderStatus(eachOrder.tracking_id, (twoOtherOption[0] === 'انجام شده' ? 'done' : twoOtherOption[0] === 'تحویل شده' ? 'delivered' : twoOtherOption[0] === 'در صف' ? 'inLine' : ''))
                                        }} href="#">{twoOtherOption[0]}</a>
                                        <div className="dropdown-divider"/>
                                        <a className="dropdown-item IranSansMedium" href="#" onClick={() => {
                                            this.handelChangeOrderStatus(eachOrder.tracking_id, (twoOtherOption[1] === 'انجام شده' ? 'done' : twoOtherOption[1] === 'تحویل شده' ? 'delivered' : twoOtherOption[1] === 'در صف' ? 'inLine' : ''))
                                        }}>{twoOtherOption[1]}</a>
                                    </div>
                                </div>
                            </td>
                        </tr>

                        ,

                        <tr id={"MoreInfoID_" + eachOrder.orders_id} className="collapse bg-light"
                            style={{lineHeight: "40px"}} key={"MoreInfoID_" + eachOrder.orders_id}>
                            <td className="d-none d-sm-table-cell text-success"><a title="تماس مستقیم"
                                                                                   href={"tel:" + eachOrder.customer_phone}><FontAwesomeIcon
                                icon={faPhone}/> {eachOrder.customer_phone}</a></td>


                            <td className="d-none d-sm-table-cell text-center pr-2" colSpan="2">
                                {eachOrder.order_table ?
                                    <a title="میز"><img style={{width: "25px"}}
                                                        src="https://img.icons8.com/material/50/000000/table.png"/> {eachOrder.order_table ? eachOrder.order_table : 0}
                                    </a>

                                    :
                                    <div></div>
                                }

                                {eachOrder.address.length > 3 ?
                                    <div>
                                        <FontAwesomeIcon style={{marginRight: '20px'}} icon={faMapMarkerAlt}/>

                                        {eachOrder.address.length > 3 ? eachOrder.address : 'حضوری'}
                                    </div>

                                    :
                                    <div></div>
                                }

                            </td>

                            <td></td>
                            <td className="d-none d-sm-table-cell">
                                {eachOrder.order_status === 'deleted' ?
                                    <span
                                        className='IranSansMedium orderDeleteReason'>{eachOrder.delete_reason}</span>
                                    :
                                    <button className="IranSansMedium btn-sm btn-danger" onClick={() => {
                                        this.handelChangeOrderStatus(eachOrder.tracking_id, 'deleted')
                                    }} title="حذف" style={{cursor: "pointer"}} type="button"><FontAwesomeIcon
                                        style={{marginLeft: '10px'}} icon={faTrash}
                                        aria-hidden="true"/>{eachOrder.order_status === "deleted" ? "لغو حذف" : "حذف"}
                                    </button>
                                }
                            </td>
                        </tr>

                        ,

                        <tr id={"MoreInfoID_" + eachOrder.orders_id} className="collapse bg-light"
                            style={{lineHeight: "40px"}} key={"MoreInfo1ID_" + eachOrder.orders_id}>
                            <td className="d-none d-sm-table-cell text-right pr-2" colSpan="5"><FontAwesomeIcon
                                icon={faCommentAlt}/>{foodsDetails.general}</td>
                        </tr>

                        ,

                        <tr id={"MoreInfoID_" + eachOrder.orders_id} className="collapse bg-light"
                            style={{lineHeight: "40px"}} key={"MoreInfo2ID_" + eachOrder.orders_id}>
                            <td className="d-none d-sm-table-cell text-right pr-2" colSpan="5"><FontAwesomeIcon
                                icon={faUtensils}/>{
                                foodsDetails.eachFood ?
                                    Object.keys(foodsDetails.eachFood).map(eachFood => {
                                        return eachFood + " ==> " + foodsDetails[eachFood] + "\n"
                                    })
                                    :
                                    <div></div>
                            }</td>
                        </tr>
                    ]

                )
            })
        )


    }

    uiComponentBigDevice = () => {
        return (
            <table dir="rtl" id="searchable_table" className="col-sm-11 col-md-10 col-lg-9 col-xl-8 text-center m-auto"
                   style={{borderCollapse: "collapse"}}>
                <thead className="thead-light">
                <tr className="bg-white">
                    <th className="bg-light pt-2 pb-2" style={{borderTopRightRadius: "15px"}}>شماره سفارش</th>
                    <th className="bg-light pt-2 pb-2 mobile-radius">سفارش</th>
                    <th className="d-none d-sm-table-cell bg-light pt-2 pb-2">تاریخ</th>
                    <th className="d-none d-sm-table-cell bg-light pt-2 pb-2">وضعیت پرداخت</th>
                    <th className="d-none d-sm-table-cell bg-light pt-2 pb-2"
                        style={{borderTopLeftRadius: "15px"}}>وضعیت
                    </th>
                </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        );
    }

    uiComponentSmallDevice = () => {

    }

    uiComponentNothinFound = () => {
        return (
            <table dir="rtl" id="searchable_table" className="col-sm-11 col-md-10 col-lg-9 col-xl-8 text-center m-auto"
                   style={{borderCollapse: "collapse"}}>
                <thead className="thead-light">
                <tr className="bg-white">
                    <th className="bg-light pt-2 pb-2" style={{borderTopRightRadius: "15px"}}>شماره سفارش</th>
                    <th className="bg-light pt-2 pb-2 mobile-radius">سفارش</th>
                    <th className="d-none d-sm-table-cell bg-light pt-2 pb-2">تاریخ</th>
                    <th className="d-none d-sm-table-cell bg-light pt-2 pb-2">وضعیت پرداخت</th>
                    <th className="d-none d-sm-table-cell bg-light pt-2 pb-2"
                        style={{borderTopLeftRadius: "15px"}}>وضعیت
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td colSpan="5" style={{textAlign: "center"}}>چیزا واسه نمایش پیدا نشد!</td>
                </tr>
                </tbody>
            </table>
        );
    }
}

const mapStateToProps = (store) => {
    return {
        ordersList: store.reducerRestaurantInfo.orders,
        ordersShowDates: store.reducerTempStates.ordersShowDates,
    }
}

const mapDispatchToProps = () => {
    return {
        setShowOrdersDates: actions.setShowOrdersDates,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
