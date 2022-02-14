import React from "react";
import {connect} from 'react-redux';
import {ButtonBase} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";   //true

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import * as requests from '../../ApiRequests/requests'
import {store} from "../../Stores/reduxStore/store";
import './css/style.css';
import './js/css/selectedHoursStylesheet.css'
import $ from 'jquery';

import IconButton from "@material-ui/core/IconButton";

const ReactSwal = withReactContent(Swal)

class RestaurantInfo extends React.Component {
    constructor(prop) {
        super(prop);
        this.resNameInput = React.createRef()
        this.numbersInput = React.createRef()
        this.addressInput = React.createRef()
        this.counterNumberInput = React.createRef()
        this.RestaurantAccountCode = React.createRef()
    }

    state = {
        selectedHours: this.props.resInfo.openTime ? this.props.resInfo.openTime : [],
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
        resPhones: [],
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
        resNumbersCounter: 2,
        openTimeShow: false
    }

    componentDidMount() {
        if (store.getState().reducerRestaurantUser.token.length < 20) {
            this.props.history.push("/")
        } else {
            requests.getRestaurantInfo(this.getInfoBack);
        }
    }

    getInfoBack = (e) => {
        let name = e.data.persianName
        this.setState({
            resName: name,
            resPhones: JSON.parse(e.data['phones']),
            resAddress: e.data.address
        })
        document.getElementById('resNameInput').value = name

        document.getElementById("resAddressInput").value = e.data.address ? e.data.address : ""
        document.getElementById("resCounterPhone").value = e.data.counterPhone ? e.data.counterPhone : ""
        this.setState({
            nOpenTime: JSON.parse(e.data.openTime)
        })
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
    }

    handleChangeAddress = (elem) => {
        let value = elem.target.value
        this.swalSureToChange(() => {
            requests.changeRestaurantAddress(value, this.checkInfoChanged);
        })
    }
    changeRestaurantAccountCode = (elem) => {
        let value = elem.target.value
        this.swalSureToChange(() => {
            // requests.changeRestaurantAddress(value, this.checkInfoChanged);
            //TODO add the request
        })
    }

    onCloseSelectHours = () => {
        let openTime = {}
        for (let i = 0; i < this.state.selectedDays.length; i++) {
            openTime[this.state.selectedDays[i]] = this.state.selectedHours
        }
        this.swalSureToChange(() => {
            requests.changeRestaurantOpenHours(openTime, this.checkInfoChanged);
        })
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
    }
    changeRestaurantCounterPhone = (e) => {
        let phone = e.target.value

        this.swalSureToChange(() => {
            if (phone && phone.length === 11) {
                requests.changeRestaurantCounterPhone(phone, this.changeRestaurantCounterPhoneCallback)
            }
        })
    }
    changeRestaurantCounterPhoneCallback = () => {
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
    }
    handleChangeOpenTime = () => {
        if (this.state.nOpenTime) {
            requests.changeRestaurantOpenHours(this.state.nOpenTime, this.changeOpenTimeCallback)
        }
    }
    changeOpenTimeCallback = (res) => {
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
                    <span>لوگو</span>
                    <div className={'d-flex justify-content-center align-items-center flex-column'}>
                        <div className={'mt-3'} style={{
                            height: 100,
                            width: 100,
                            backgroundSize: 'cover',
                            backgroundImage: `url(${'https://img.freepik.com/free-vector/food-logo-design_139869-254.jpg?size=626&ext=jpg'})`,
                            backgroundPosition: 'center',
                            borderRadius: '100%'
                        }}/>
                        <ButtonBase className={'mt-2'}
                                    style={{
                                        border: '1px gray solid',
                                        borderRadius: '10px',
                                        width: 80,
                                        height: 40,
                                        fontSize: '0.9rem'
                                    }}
                        >
                            تغیر لوگو
                        </ButtonBase>
                    </div>
                    <div className={'mt-4'}></div>
                    <span>اطلاعات مجموعه</span>
                    <div className={'mt-1'}></div>


                    <div dir={'rtl'} className={'IranSansLight d-flex flex-column'}>
                        <TextField id={'resNameInput'} ref={this.resNameInput} style={{marginTop: '100px'}}
                                   defaultValue={'رستوران'}
                                   style={{width: "150px"}} label="نام رستوران" onBlur={this.handleChangeName}
                                   className='IranSansLight mt-3'
                        />
                        <TextField id={'resAddressInput'} ref={this.addressInput} defaultValue={'خیابان'}
                                   style={{width: "150px"}} label="آدرس" onBlur={this.handleChangeAddress}
                                   multiline
                                   className='mt-2'/>
                        <TextField id={'resInstaId'} ref={this.addressInput} defaultValue={'@'}
                                   onChange={(e)=>{
                                       e.currentTarget.value = '@'+e.currentTarget.value.slice(1)
                                   }}
                                   style={{width: "150px",direction:'ltr'}} label="ایدی اینستاگرام" onBlur={()=>{}}
                                   multiline
                                   className='mt-2'/>

                        {
                            this.state.resPhones?
                                this.state.resPhones.map((eachNumber, index) => {
                                    return (
                                        <TextField id={'resPhonesInput-' + index} ref={this.numbersInput}
                                                   style={{marginTop: '100px', width: "150px", transition: '.3s ease'}}
                                                   defaultValue={eachNumber}
                                                   label="شماره تماس "
                                                   onBlur={this.handleChangePhone}
                                                   onChange={(e) => {
                                                       this.state.resPhones[index] = e.currentTarget.value
                                                       this.setState({
                                                           resPhones: this.state.resPhones
                                                       })
                                                   }}
                                                   className='IranSansLight mt-3'
                                        />
                                    )
                                })
                                :<div></div>
                        }
                        {/*{*/}
                        {/*    this.state.resPhones.length < 5 ?*/}
                        {/*        <ButtonBase className={'mt-2'}*/}
                        {/*                    style={{*/}
                        {/*                        border: '1px gray solid',*/}
                        {/*                        borderRadius: '10px',*/}
                        {/*                        width: '100%',*/}
                        {/*                        height: 40,*/}
                        {/*                        fontSize: '0.9rem'*/}
                        {/*                    }}*/}
                        {/*                    onClick={() => {*/}
                        {/*                        if (this.state.resPhones[this.state.resPhones.length - 1]) {*/}
                        {/*                            this.state.resPhones.push('')*/}
                        {/*                            this.setState({*/}
                        {/*                                resPhones: this.state.resPhones*/}
                        {/*                            })*/}
                        {/*                        } else {*/}
                        {/*                            let textField = document.getElementById('resPhonesInput-' + (this.state.resPhones.length - 1)).parentElement.parentElement*/}
                        {/*                            if (!textField.classList.contains('phone-error')){*/}
                        {/*                                textField.classList.add("phone-error")*/}
                        {/*                                setTimeout(()=>{*/}
                        {/*                                    textField.classList.remove("phone-error")*/}
                        {/*                                },1000)*/}
                        {/*                            }*/}

                        {/*                            // document.getElementById('resPhonesInput-' + (this.state.resPhones.length - 1)).parentElement.classList.add('phone-error')*/}
                        {/*                            // document.getElementById('resPhonesInput-'+(this.state.resPhones.length-1)).classList.add('phone-error')*/}
                        {/*                        }*/}
                        {/*                    }}*/}

                        {/*        >*/}
                        {/*            افزودن شماره تماس*/}
                        {/*            <i style={{fontSize: '0.7rem'}} className={'fas fa-plus mx-2'}/>*/}
                        {/*        </ButtonBase>*/}
                        {/*        :*/}
                        {/*        null*/}
                        {/*}*/}


                        <TextField id={'resCounterPhone'} ref={this.counterNumberInput} style={{marginTop: '100px'}}
                                   defaultValue={'09'}
                                   style={{width: "150px", whiteSpace: 'nowrap'}} label="شماره تماس صندوق دار"
                                   onBlur={this.changeRestaurantCounterPhone}
                                   className='IranSansLight mt-3'/>



                        <TextField id={'resCounterPhone'} ref={this.RestaurantAccountCode} style={{marginTop: '100px'}}
                                   defaultValue={'00000000000000'}
                                   style={{width: "150px", whiteSpace: 'nowrap'}} label="شماره حساب"
                                   onBlur={this.changeRestaurantAccountCode}
                                   className='IranSansLight mt-3'/>
                        <ButtonBase onClick={() => {
                            this.setState({
                                openTimeShow: true
                            })
                        }} style={{
                            margin: '90px auto 30px auto',
                            border: '1px gray solid',
                            borderRadius: '10px',
                            width: '100%',
                            height: 40,
                            fontSize: '0.9rem'

                        }} className='btn btn-outline-dark mt-4'>روز های باز رستوران
                        </ButtonBase>



                    </div>


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
                         className={"shMainContainer openDays shadow " + (this.state.openTimeShow ? 'animate__animated animate__fadeInUp' : 'd-none')}>
                        <div className="shRow">
                            <IconButton color={this.state.nSelectedDay === '0' ? 'primary' : 'default'}
                                        onClick={(e) => {
                                            this.resetButtons(0)
                                            this.setState({
                                                nSelectedDay: '0'
                                            })
                                            this.state.nSelectedDay = '0'

                                        }} size="small"
                                        className="m-1">شنبه</IconButton>
                            <IconButton color={this.state.nSelectedDay === '1' ? 'primary' : 'default'}
                                        onClick={(e) => {
                                            this.setState({
                                                nSelectedDay: '1'
                                            })
                                            this.state.nSelectedDay = '1'
                                            this.resetButtons(1)

                                        }} size="small"
                                        className="m-1">یکشنبه</IconButton>
                            <IconButton color={this.state.nSelectedDay === '2' ? 'primary' : 'default'}
                                        onClick={(e) => {
                                            this.setState({
                                                nSelectedDay: '2'
                                            })
                                            this.resetButtons(2)

                                        }} size="small"
                                        className="m-1">دوشنبه</IconButton>
                            <IconButton color={this.state.nSelectedDay === '3' ? 'primary' : 'default'}
                                        onClick={(e) => {
                                            this.setState({
                                                nSelectedDay: '3'
                                            })
                                            this.resetButtons(3)

                                        }} size="small" className="m-1">سه
                                شنبه</IconButton>
                            <IconButton color={this.state.nSelectedDay === '4' ? 'primary' : 'default'}
                                        onClick={(e) => {
                                            this.setState({
                                                nSelectedDay: '4'
                                            })
                                            this.resetButtons(4)

                                        }} size="small" className="m-1">چهار
                                شنبه</IconButton>
                            <IconButton color={this.state.nSelectedDay === '5' ? 'primary' : 'default'}
                                        onClick={(e) => {
                                            this.setState({
                                                nSelectedDay: '5'
                                            })
                                            this.resetButtons(5)

                                        }} size="small" className="m-1">پنج
                                شنبه</IconButton>
                            <IconButton color={this.state.nSelectedDay === '6' ? 'primary' : 'default'}
                                        onClick={(e) => {
                                            this.setState({
                                                nSelectedDay: '6'
                                            })
                                            this.resetButtons(6)

                                        }} size="small"
                                        className="m-1">جمعه</IconButton>
                        </div>
                        <div className='hoursSelector'>
                            <div className="shRow">
                                {
                                    Array.apply(1, Array(24)).map((eachButton, index) => {
                                        return (
                                            <IconButton id={'h' + index}
                                                        onClick={this.handleButtonClickedNew} size="small"
                                                        className="m-1">{index < 10 ? '0' + index : index}</IconButton>
                                        )
                                    })
                                }
                            </div>
                            <div className='w-100 text-center'>
                                <div className='daysSubmitButton' onClick={() => {
                                    this.handleChangeOpenTime()
                                    this.setState({
                                        openTimeShow: false
                                    })
                                }}>تایید
                                </div>
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
