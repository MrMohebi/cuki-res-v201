import React from "react";
import {connect} from 'react-redux';
import {FormControl, Input, InputLabel, MenuItem, Select, TextField} from "@material-ui/core";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import * as requests from '../../ApiRequests/requests'
import {store} from "../../Stores/reduxStore/store";
import './css/style.css'

import SelectHours from "./js/selectHours";

const ReactSwal = withReactContent(Swal)

class RestaurantInfo extends React.Component {
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
        resName:'',
        resPhones:'',
        resAddress:'',
        resType:''
    }

    componentDidMount() {
        if (store.getState().reducerRestaurantUser.token.length < 20) {
            this.props.history.push("/")
        } else {
            requests.getRestaurantInfo(this.getInfoBack);
        }
    }
    getInfoBack = (e)=>{
        console.log(e.data)
        let name = e.data.persian_name
        this.setState({
            resName:name,
            resPhones:e.data.phone,
            resAddress:e.data.address
        })
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


    render() {

            return this.state.resName.length>1? (
                <React.Fragment>
                    <div className='navGap'></div>
                    <div className='IranSansLight smallBox d-flex flex-column justify-content-center align-items-md-center'>
                        <TextField style={{marginTop: '100px'}} helperText="با + از هم جدا کنید"
                                   defaultValue={this.state.resName}
                                   style={{width: "150px"}} label="نام رستوران" onBlur={this.handleChangeName}
                                   className='IranSansLight mt-2'/>
                        <TextField style={{marginTop: '100px'}} helperText="با + از هم جدا کنید"
                                   defaultValue={this.state.resPhones ? JSON.parse(this.state.resPhones).join(" + ") : ""}
                                   style={{width: "150px"}} label="شماره تماس ها" onBlur={this.handleChangePhone}
                                   className='IranSansLight mt-2'/>
                        <TextField defaultValue={this.state.resAddress ? this.state.resAddress : ""}
                                   style={{width: "150px"}} label="آدرس" onBlur={this.handleChangeAddress}
                                   className='mt-2'/>
                        <SelectHours style={{backgroundColor: 'red'}} defaultSh={this.state.selectedHours}
                                     onClose={this.onCloseSelectHours} setSh={this.setSelectedHours}/>
                        <button onClick={() => {
                            this.setState({
                                daysDialogAnimateClass: 'animate__animated animate__fadeInUp'
                            })
                        }} style={{margin: '30px 0 30px 0'}} className='btn btn-outline-dark mt-1'>روز های باز رستوران
                        </button>
                        <div className={'openDays ' + this.state.daysDialogAnimateClass}>
                            {
                                this.state.days.map((eachDay) => {
                                    return (
                                        <div onClick={() => {
                                            this.toggleDay(eachDay);
                                            this.forceUpdate();

                                        }}
                                             className={'resInfoDays ' + (this.state.selectedDays.indexOf(eachDay) === -1 ? '' : 'activeDay')}>{this.state.daysString[eachDay]}</div>

                                    )
                                })
                            }
                            <div className='w-100 text-center'>
                                <div className='daysSubmitButton' onClick={this.daysOnSubmit}>تایید</div>
                            </div>
                        </div>
                        <FormControl style={{minWidth: "120px"}}>
                            <InputLabel id="demo-simple-select-helper-label">نوع</InputLabel>
                            <Select labelId="demo-simple-select-helper-label"
                                    defaultValue={this.props.resInfo.type ? JSON.parse(this.props.resInfo.type) : ""}
                                    onChange={this.handelChangeType}>
                                <MenuItem value={this.state.resType}>
                                    <em>انتخاب نشده</em>
                                </MenuItem>
                                <MenuItem value={['coffeeshop']}>کافه</MenuItem>
                                <MenuItem value={['restaurant']}>رستوران</MenuItem>
                                <MenuItem value={['coffeeshop', 'restaurant']}>کافه رستوران</MenuItem>
                            </Select>
                        </FormControl>
                    </div>


                </React.Fragment>
            ):
        (
            <div></div>
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
