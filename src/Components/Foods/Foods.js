import React from "react";
import $ from 'jquery'
import {Link} from "react-router-dom";
import {connect} from 'react-redux';
import * as requests from '../../ApiRequests/requests'
import {Button, Grid, Switch, Typography, withStyles} from '@material-ui/core';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import * as actions from '../../Stores/reduxStore/actions'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteIcon from '@material-ui/icons/Delete';
import FastfoodRoundedIcon from '@material-ui/icons/FastfoodRounded';


const AntSwitch = withStyles((theme) => ({
    root: {
        width: 28,
        height: 16,
        padding: 0,
        display: 'flex',
    },
    switchBase: {
        padding: 2,
        color: theme.palette.grey[500],
        '&$checked': {
            transform: 'translateX(12px)',
            color: theme.palette.common.white,
            '& + $track': {
                opacity: 1,
                backgroundColor: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
            },
        },
    },
    thumb: {
        width: 12,
        height: 12,
        boxShadow: 'none',
    },
    track: {
        border: `1px solid ${theme.palette.grey[500]}`,
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor: theme.palette.common.white,
    },
    checked: {},
}))(Switch);


class Foods extends React.Component {
    uiWaitToFetch = <h3>در حال دریافت</h3>;
    state = {
        uiRender: this.uiWaitToFetch,
        foodsList: [],
    }

    componentDidMount() {
        this.getFoods();
        this.removeEventListeners()

    }

    removeEventListeners(){
        window.removeEventListener('keydown',()=>{
        })
    }


    checkFoods = (response) => {
        if (response.statusCode === 200) {
            this.setState({
                foodsList: response.data,
                uiRender: this.uiComponent()
            });

        }
    }

    getFoods = () => {
        requests.getFoods(this.checkFoods)
    }


    handleChangStatus = (foodId, foodStatus) => {
        requests.changeFoodStatus(foodId, foodStatus, this.checkFoodStatusChanged)
    }

    checkFoodStatusChanged = (res) => {
        if (res.statusCode === 200) {
            this.getFoods();
        }
    }
    handleFoodPrice = (foodId) => {
        let foodPriceInput = $(`#itemPrice_${foodId}`)
        let foodPrice = foodPriceInput.val()
        if (foodPrice.length<4){
            foodPrice = foodPrice + "000"
        }
        foodPriceInput.val(foodPrice)
        requests.changeFoodPrice(foodId, foodPrice, this.checkFoodPriceChanged)
    }
    handleFoodDiscount = (foodId) => {
        let foodDiscount = $(`#itemDiscount_${foodId}`).val()
        requests.changeFoodDiscount(foodId, foodDiscount, this.checkFoodDiscountChanged)

    }
    checkFoodDiscountChanged = (res) => {
        if (res.hasOwnProperty('statusCode') && res.statusCode === 200) {
            //some staff
        }
    }

    checkFoodPriceChanged = (res) => {
        if (res.statusCode === 200) {
            toast.success("با موفقیت تغیر کرد")
        }
        toast.error("خطا هنگام تغیر قیمت")
    }


    render() {
        return (
            <React.Fragment>
                <ToastContainer
                position={'bottom-center'}
                rtl={true}
                autoClose={2000}
                />
                <div style={{height: "30px", width: "100%"}}/>
                <div style={{height: "30px", width: "100%"}}/>
                <div className="smallBox ">
                    <div className="w-100 text-center mt-3 mb-3 newFoodButton">
                        <Button
                            onClick={
                                () => {
                                    this.props.history.push('/newFood');
                                }
                            }
                            variant='contained'
                            color='primary'
                            startIcon={<FastfoodRoundedIcon/>}>
                            افزودن غذا
                        </Button>


                    </div>
                    <table className="fixed_header table-hover table-striped table-sm text-center m-auto">
                        <thead>
                        <tr className="bg-light">
                            <th style={{borderTopLeftRadius: "15px"}} className={'delete-food-td'}/>
                            <th style={{borderTopLeftRadius: "15px"}}>وضعیت</th>
                            <th style={{width: "110px"}}>
                                    <span style={{
                                        fontSize: '0.7rem',
                                        color: 'grey'
                                    }}>(تومان)</span>
                                قیمت
                            </th>
                            <th className={'discount-td'}><span style={{
                                fontSize: '0.7rem',
                                color: 'grey'
                            }}>(درصد)</span> تخفیف
                            </th>
                            <th>نام</th>
                            <th style={{borderTopRightRadius: "15px"}}>#</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.createFoodRows()}
                        </tbody>
                    </table>
                    <Link style={{
                        color: 'blue',
                        width: '100%',
                        display: 'block',
                        marginTop: '20px',
                        textAlign: 'right'
                    }}
                          to={'/foods'}><span

                        style={{width: '100$', textAlign: 'center', marginTop: '20px'}}>بیشتر...</span></Link>

                </div>
            </React.Fragment>

        )
    }

    uiComponent = () => {
        return (
            <div className="container">
                <div className='justForGap'/>
                <table className="fixed_header table-hover table-striped table-sm text-center m-auto">
                    <thead>
                    <tr className="bg-light">
                        <th style={{borderTopLeftRadius: "15px"}}>وضعیت</th>
                        <th style={{width: "110px"}}>قیمت</th>
                        <th>نام</th>
                        <th style={{borderTopRightRadius: "15px"}}>#</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.createFoodRows()}
                    </tbody>
                </table>
            </div>
        )
    }

    createFoodRows = () => {
        let rowCounter = 0;
        let howManyFoodsToShow = window.location.pathname === '/dashboard' ? 10 : this.state.foodsList.length
        this.state.foodsList = this.state.foodsList.filter(eFood => eFood.status !== 'deleted'&& !eFood.relatedMainPersianName)
        return (this.state.foodsList.slice(0, howManyFoodsToShow).map(eachFood => (

            <tr key={`itemId_${eachFood.id}`} className="bg-white">

                <td className={'delete-food-td'}>
                    {
                        eachFood.status !== 'deleted' ?

                            <Button
                                onClick={
                                    () => {
                                        this.handleChangStatus(eachFood.id, 'deleted')
                                    }
                                }
                                variant="contained"
                                color="secondary"
                                className={'deleteButton'}
                                startIcon={<DeleteIcon/>}
                            >
                                حذف
                            </Button>

                            :
                            <div/>
                    }
                </td>

                <td>
                    <Typography component="div">
                        <Grid className={'food-status-td'} component="label" container alignItems="center" spacing={1}>
                            <Grid item>ناموجود</Grid>
                            <Grid item>
                                <AntSwitch
                                    disabled={!(eachFood.status === "outOfStock" || eachFood.status === "inStock")}
                                    checked={((eachFood.status === "outOfStock" || eachFood.status === "inStock") && eachFood.status === "inStock")}
                                    onChange={() => {
                                        this.handleChangStatus(eachFood.id, ((eachFood.status === "inStock") ? ("outOfStock") : ("inStock")))
                                    }}/>
                            </Grid>
                            <Grid item>موجود</Grid>
                        </Grid>
                    </Typography>
                </td>
                <td>
                    <div className="input-group input-group-sm justify-content-center ltr">
                        <div className="input-group-prepend ">
                            <button style={{height: '31px'}} value="1" className="btn btn-outline-success" type="button"
                                    onClick={() => {
                                        this.handleFoodPrice(eachFood.id)
                                    }}>
                                <FontAwesomeIcon icon={faCheck}/>
                            </button>
                        </div>
                        <input id={`itemPrice_${eachFood.id}`} type="text" placeholder={eachFood.price} onFocus={(e)=>{
                        e.currentTarget.select()
                        }} onBlur={()=>{
                        this.handleFoodPrice(eachFood.id)
                        }}
                               defaultValue={eachFood.price} className="form-control" aria-label=""
                               aria-describedby="basic-addon1"/>
                    </div>
                </td>
                <td className={'discount-td'}>
                    <div className="input-group input-group-sm justify-content-center ltr">
                        <div className="input-group-prepend ">
                            <button style={{height: '31px'}} value="1" className="btn btn-outline-success" type="button"
                                    onClick={() => {
                                        this.handleFoodDiscount(eachFood.id)
                                    }}>
                                <FontAwesomeIcon icon={faCheck}/>
                            </button>
                        </div>
                        <input style={{maxWidth: '40px'}} id={`itemDiscount_${eachFood.id}`} type="text"
                               placeholder={eachFood.discount}
                               defaultValue={eachFood.discount} className="form-control" aria-label=""
                               aria-describedby="basic-addon1"/>
                    </div>
                </td>

                <td>
                    <div onClick={() => {
                        this.props.setFoodInfoTemp(this.state.foodsList.filter(ef => eachFood.id === ef.id))
                        this.props.history.push('/foodInfo')
                    }
                    }>{eachFood.persianName}</div>
                </td>
                <td>{rowCounter++}</td>
            </tr>
        )))


    }
}

const mapStateToProps = (store) => {
    return {
        foodInfoTemp: store.reducerTempStates.foodInfoTemp,
    }
}

const mapDispatchToProps = () => {
    return {
        setFoodInfoTemp: actions.setFoodInfoTemp,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Foods);

