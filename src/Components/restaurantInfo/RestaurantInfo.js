import React from "react";
import {connect} from 'react-redux';
import {FormControl, Input, InputLabel, MenuItem, Select, TextField} from "@material-ui/core";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import * as requests from '../../ApiRequests/requests'
import {store} from "../../Stores/reduxStore/store";
import './css/style.css';
import $ from 'jquery';

import SelectHours from "./js/selectHours";
import IconButton from "@material-ui/core/IconButton";

const ReactSwal = withReactContent(Swal)

class RestaurantInfo extends React.Component {
    constructor(prop) {
        super(prop);
        this.resNameInput = React.createRef()
        this.numbersInput = React.createRef()
        this.addressInput = React.createRef()
    }
    state = {
        selectedHours: this.props.resInfo.open_time ? this.props.resInfo.open_time : [],
        days: ['0', '1', '2', '3', '4', '5', '6'],
        daysString: {
            '0': 'شنبه',
            '1': 'یکشنبه',
            '2': 'دوشنبه',
            '3': 'سه شنبه',
            '4': 'چهارشنبه',
            '5': 'پنج شنبه',
            '6': 'جمعه',
        },
        selectedDays: ['0'],
        daysDialogAnimateClass: 'd-none',
        resName: '',
        resPhones: '',
        resAddress: '',
        resType: '',
        nSelectedDay: '',
        nOpenTime: {
            '0': [],
            '1': [],
            '2': [],
            '3': [],
            '4': [],
            '5': [],
            '6': [],
        },
        openTimeShow:false
    }

    componentDidMount() {
        if (store.getState().reducerRestaurantUser.token.length < 20) {
            this.props.history.push("/")
        } else {
            requests.getRestaurantInfo(this.getInfoBack);
        }
    }

    getInfoBack = (e) => {
        console.log(e.data)
        let name = e.data.persian_name
        this.setState({
            resName: name,
            resPhones: e.data.phone,
            resAddress: e.data.address
        })
        document.getElementById('resNameInput').value = name
        document.getElementById("resPhonesInput").value = e.data.phone.length >1? JSON.parse(e.data.phone).join(" + "):JSON.parse(e.data.phone)[0]
        document.getElementById("resAddressInput").value = e.data.address ? e.data.address : ""
        let openTimeArray = JSON.parse(e.data.open_time)
        for (let i =0;i<openTimeArray.length;i++){
            this.state.nOpenTime[i.toString()] = openTimeArray[i]
        }
        console.log(this.state.nOpenTime)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    swalSureToChange = (funcOnSubmit = () => {
    }, funcOnCancel = () => {
    }) => {
        ReactSwal.fire({
            titleText: "؟آیا از ایجاد تغیرات اطمینان دارید",
            icon: "warning",
            showConfirmButton: true,
            confirmButtonText: "!آره تغییرش بده",
            showCancelButton: true,
            cancelButtonText: "نه دستم خورد",
        }).then((result) => {
            if (result.isConfirmed) {
                funcOnSubmit()
            } else {
                ReactSwal.fire({
                    title: <h2>تغییرات ثبت نشد!</h2>,
                    icon: "warning",
                    timer: 2000,
                    timerProgressBar: true
                })
                funcOnCancel()
            }
        })
    }


    checkInfoChanged = (res) => {
        console.log(res)
        if (res.statusCode === 200) {
            ReactSwal.fire({
                title: <h2>!با موفقیت انجام شد</h2>,
                icon: "success",
                timer: 2000,
                timerProgressBar: true
            }).then(() => {
                // requests.getRestaurantInfo();
                //this.props.history.go(0);
            })
        } else {
            ReactSwal.fire({
                title: <h2>تغییرات ثبت نشد!</h2>,
                icon: "warning",
                timer: 2000,
                timerProgressBar: true
            })
        }
    }
    toggleDay = (day) => {
        if (this.state.selectedDays.indexOf(day) === -1) {
            this.state.selectedDays.push(day)
        } else {
            let days = this.state.selectedDays.filter(eachDay => {
                return eachDay !== day
            })
            this.setState({
                selectedDays: days
            })

        }
    }

    handleChangeName = (elem) => {
        let value = elem.target.value
        this.swalSureToChange(() => {
            requests.changeRestaurantName(value, this.checkInfoChanged);
        })
    }

    handleChangePhone = (elem) => {
        let value = elem.target.value
        let phoneArr = value.split(/[\s\n\rA-Za-z+.]+/).filter(eachInp => eachInp.length === 11 && parseInt(eachInp[0]) === 0);
        if (phoneArr.length < 4 && phoneArr.length > 0) {
            console.log("number are correct")
            this.swalSureToChange(() => {
                requests.changeRestaurantPhone(phoneArr, this.checkInfoChanged);
            })
        } else {

            ReactSwal.fire({
                title: <h2>تغییرات ثبت نشد!</h2>,
                text: "ورودی نامعتبر لطفا مجددا اطلاعات را برسی کنید",
                icon: "error",
                timer: 1500,
                timerProgressBar: true
            })
        }
        console.log(phoneArr);
    }

    handleChangeAddress = (elem) => {
        let value = elem.target.value
        this.swalSureToChange(() => {
            requests.changeRestaurantAddress(value, this.checkInfoChanged);
        })
    }

    setSelectedHours = (shList) => {
        let shListNew = [...shList];
        this.state.selectedHours = shListNew
    }

    onCloseSelectHours = () => {
        console.log(this.state.selectedHours)
        console.log(this.state.selectedDays)
        let openTime = {}
        for (let i = 0; i < this.state.selectedDays.length; i++) {
            openTime[this.state.selectedDays[i]] = this.state.selectedHours
        }
        console.log(JSON.stringify(openTime))
        this.swalSureToChange(() => {
            requests.changeRestaurantOpenHours(openTime, this.checkInfoChanged);
        })
    }

    getStyle = (day) => {

    }
    handelChangeType = (event) => {
        let typeNew = event.target.value
        this.swalSureToChange(() => {
            requests.changeRestaurantType(typeNew, this.checkInfoChanged);
        })
    }
    getStyles = (name, personName, theme) => {
        return {
            fontWeight:
                personName.indexOf(name) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }
    daysOnSubmit = () => {
        this.setState({
            daysDialogAnimateClass: 'd-none'
        })
        this.onCloseSelectHours()
    }
    handleButtonClickedNew = (event) => {
        if (this.state.nOpenTime[this.state.nSelectedDay]) {
            let number = parseInt(event.target.innerText);
            let arr = this.state.nOpenTime[this.state.nSelectedDay]
            if (arr.includes(number)) {
                arr = arr.filter((eachNumber) => {
                    return eachNumber !== number
                })
            } else {
                arr.push(number)
            }
            this.state.nOpenTime[this.state.nSelectedDay] = arr
            this.resetButtons()
            for (let i = 0; i < arr.length; i++) {
                document.getElementById('h' + arr[i]).style.color = '#5A4A9A'
            }
        }
        console.log(this.state.nOpenTime)


    }
    resetButtons = (day) => {
        $('.hoursSelector button').css({color: 'rgba(0, 0, 0, 0.54)'})
        let arr = this.state.nOpenTime[day]
        if (arr && arr.length > 0) {
            for (let i = 0; i < arr.length; i++) {
                document.getElementById('h' + arr[i]).style.color = '#5A4A9A'
            }
        }

    }
    handleDaySelected = (event) => {
        this.state.nSelectedDay = event
    }
    buttonColor = (event) => {
        console.log(event)
    }
    handleChangeOpenTime = ()=>{
        if (this.state.nOpenTime){
            requests.changeRestaurantOpenHours(this.state.nOpenTime,this.changeOpenTimeCallback)
        }
    }
    changeOpenTimeCallback = (res)=>{
        console.log(res)
        if (res.statusCode === 200) {
            ReactSwal.fire({
                title: <h2>!با موفقیت انجام شد</h2>,
                icon: "success",
                timer: 2000,
                timerProgressBar: true
            }).then(() => {
                // requests.getRestaurantInfo();
                //this.props.history.go(0);
            })
        } else {
            ReactSwal.fire({
                title: <h2>تغییرات ثبت نشد!</h2>,
                icon: "warning",
                timer: 2000,
                timerProgressBar: true
            })
        }
    }


    render() {

        return (
                <React.Fragment>
                    <div className='navGap'/>
                    <div className='IranSansLight smallBox d-flex flex-column justify-content-center align-items-md-center'>
                        <TextField id={'resNameInput'} ref={this.resNameInput} style={{marginTop: '100px'}}
                                   defaultValue={'رستوران'}
                                   style={{width: "150px"}} label="نام رستوران" onBlur={this.handleChangeName}
                                   className='IranSansLight mt-2'/>
                        <TextField id={'resPhonesInput'} ref={this.numbersInput} style={{marginTop: '100px'}} helperText="با + از هم جدا کنید"
                                   defaultValue={'09'}
                                   style={{width: "150px"}} label="شماره تماس ها" onBlur={this.handleChangePhone}
                                   className='IranSansLight mt-2'/>
                        <TextField id={'resAddressInput'} ref={this.addressInput} defaultValue={'خیابان'}
                                   style={{width: "150px"}} label="آدرس" onBlur={this.handleChangeAddress}
                                   className='mt-2'/>
                        {/*<SelectHours style={{backgroundColor: 'red'}} defaultSh={this.state.selectedHours}*/}
                        {/*             onClose={this.onCloseSelectHours} setSh={this.setSelectedHours}/>*/}
                        <button onClick={() => {
                            this.setState({
                                openTimeShow:true
                            })
                        }} style={{margin: '90px auto 30px auto'}} className='btn btn-outline-dark mt-4'>روز های باز رستوران
                        </button>

                        {/*<FormControl style={{minWidth: "120px"}}>*/}
                        {/*    <InputLabel id="demo-simple-select-helper-label">نوع</InputLabel>*/}
                        {/*    <Select labelId="demo-simple-select-helper-label"*/}
                        {/*            defaultValue={this.props.resInfo.type ? JSON.parse(this.props.resInfo.type) : ""}*/}
                        {/*            onChange={this.handelChangeType}>*/}
                        {/*        <MenuItem value={this.state.resType}>*/}
                        {/*            <em>انتخاب نشده</em>*/}
                        {/*        </MenuItem>*/}
                        {/*        <MenuItem value={['coffeeshop']}>کافه</MenuItem>*/}
                        {/*        <MenuItem value={['restaurant']}>رستوران</MenuItem>*/}
                        {/*        <MenuItem value={['coffeeshop', 'restaurant']}>کافه رستوران</MenuItem>*/}
                        {/*    </Select>*/}
                        {/*</FormControl>*/}
                        <div style={{position: 'absolute',}}
                             className={"shMainContainer shadow " + (this.state.openTimeShow ? 'animate__animated animate__fadeInUp' : 'd-none')}>
                            <div className="shRow">
                                <IconButton color={this.state.nSelectedDay === '0' ? 'primary' : ''} onClick={(e) => {
                                    this.resetButtons(0)
                                    this.setState({
                                        nSelectedDay: '0'
                                    })
                                    this.state.nSelectedDay = '0'

                                }} size="small"
                                            className="m-1">شنبه</IconButton>
                                <IconButton color={this.state.nSelectedDay === '1' ? 'primary' : ''} onClick={(e) => {
                                    this.setState({
                                        nSelectedDay: '1'
                                    })
                                    this.state.nSelectedDay = '1'
                                    this.resetButtons(1)

                                }} size="small"
                                            className="m-1">یکشنبه</IconButton>
                                <IconButton color={this.state.nSelectedDay === '2' ? 'primary' : ''} onClick={(e) => {
                                    this.setState({
                                        nSelectedDay: '2'
                                    })
                                    this.resetButtons(2)

                                }} size="small"
                                            className="m-1">دوشنبه</IconButton>
                                <IconButton color={this.state.nSelectedDay === '3' ? 'primary' : ''} onClick={(e) => {
                                    this.setState({
                                        nSelectedDay: '3'
                                    })
                                    this.resetButtons(3)

                                }} size="small" className="m-1">سه
                                    شنبه</IconButton>
                                <IconButton color={this.state.nSelectedDay === '4' ? 'primary' : ''} onClick={(e) => {
                                    this.setState({
                                        nSelectedDay: '4'
                                    })
                                    this.resetButtons(4)

                                }} size="small" className="m-1">چهار
                                    شنبه</IconButton>
                                <IconButton color={this.state.nSelectedDay === '5' ? 'primary' : ''} onClick={(e) => {
                                    this.setState({
                                        nSelectedDay: '5'
                                    })
                                    this.resetButtons(5)

                                }} size="small" className="m-1">پنج
                                    شنبه</IconButton>
                                <IconButton color={this.state.nSelectedDay === '6' ? 'primary' : ''} onClick={(e) => {
                                    this.setState({
                                        nSelectedDay: '6'
                                    })
                                    this.resetButtons(6)

                                }} size="small"
                                            className="m-1">جمعه</IconButton>
                            </div>
                            <div className='hoursSelector'>
                                <div className="shRow">
                                    <IconButton id='h0'
                                                onClick={this.handleButtonClickedNew} size="small"
                                                className="m-1">00</IconButton>
                                    <IconButton id='h1' onClick={this.handleButtonClickedNew} size="small"
                                                className="m-1">01</IconButton>
                                    <IconButton id='h2' onClick={this.handleButtonClickedNew} size="small"
                                                className="m-1">02</IconButton>
                                    <IconButton id='h3' onClick={this.handleButtonClickedNew} size="small"
                                                className="m-1">03</IconButton>
                                    <IconButton id='h4' onClick={this.handleButtonClickedNew} size="small"
                                                className="m-1">04</IconButton>
                                    <IconButton id='h5' onClick={this.handleButtonClickedNew} size="small"
                                                className="m-1">05</IconButton>
                                </div>
                                <div className="shRow">
                                    <IconButton id='h6' onClick={this.handleButtonClickedNew} size="small"
                                                className="m-1">06</IconButton>
                                    <IconButton id='h7' onClick={this.handleButtonClickedNew} size="small"
                                                className="m-1">07</IconButton>
                                    <IconButton id='h8' onClick={this.handleButtonClickedNew} size="small"
                                                className="m-1">08</IconButton>
                                    <IconButton id='h9' onClick={this.handleButtonClickedNew} size="small"
                                                className="m-1">09</IconButton>
                                    <IconButton id='h10' onClick={this.handleButtonClickedNew} size="small"
                                                className="m-1">10</IconButton>
                                    <IconButton id='h11' onClick={this.handleButtonClickedNew} size="small"
                                                className="m-1">11</IconButton>
                                </div>
                                <div className="shRow">
                                    <IconButton id='h12' onClick={this.handleButtonClickedNew} size="small"
                                                className="m-1">12</IconButton>
                                    <IconButton id='h13' onClick={this.handleButtonClickedNew} size="small"
                                                className="m-1">13</IconButton>
                                    <IconButton id='h14' onClick={this.handleButtonClickedNew} size="small"
                                                className="m-1">14</IconButton>
                                    <IconButton id='h15' onClick={this.handleButtonClickedNew} size="small"
                                                className="m-1">15</IconButton>
                                    <IconButton id='h16' onClick={this.handleButtonClickedNew} size="small"
                                                className="m-1">16</IconButton>
                                    <IconButton id='h17' onClick={this.handleButtonClickedNew} size="small"
                                                className="m-1">17</IconButton>
                                </div>
                                <div className="shRow">
                                    <IconButton id='h18' onClick={this.handleButtonClickedNew} size="small"
                                                className="m-1">18</IconButton>
                                    <IconButton id='h19' onClick={this.handleButtonClickedNew} size="small"
                                                className="m-1">19</IconButton>
                                    <IconButton id='h20' onClick={this.handleButtonClickedNew} size="small"
                                                className="m-1">20</IconButton>
                                    <IconButton id='h21' onClick={this.handleButtonClickedNew} size="small"
                                                className="m-1">21</IconButton>
                                    <IconButton id='h22' onClick={this.handleButtonClickedNew} size="small"
                                                className="m-1">22</IconButton>
                                    <IconButton id='h23' onClick={this.handleButtonClickedNew} size="small"
                                                className="m-1">23</IconButton>
                                </div>
                                <div className='w-100 text-center'>
                                    <div className='daysSubmitButton' onClick={() => {
                                        this.handleChangeOpenTime()
                                        this.setState({
                                            openTimeShow:false
                                        })
                                    }}>تایید</div>
                                </div>
                            </div>

                        </div>
                    </div>


                </React.Fragment>
        )

    }
}


const mapStateToProps = (store) => {
    return {
        resInfo: store.reducerRestaurantInfo.info,
    }
}

const mapDispatchToProps = () => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantInfo);
