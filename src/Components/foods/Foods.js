import React from "react";
import $ from 'jquery'
import {Link} from "react-router-dom";
import {connect} from 'react-redux';
import * as requests from '../../ApiRequests/requests'
import {Grid, Switch, Typography, withStyles} from '@material-ui/core';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import * as actions from '../../Stores/reduxStore/actions'
import ReactSwal from "sweetalert2";


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

    handelChangStatus = (foodId, foodStatus) => {
        requests.changeFoodStatus(foodId, foodStatus, this.checkFoodStatusChanged)
    }

    checkFoodStatusChanged = (res) => {
        if (res.statusCode === 200) {
            this.getFoods();
        }
    }
    handelFoodPrice = (foodId) => {
        let foodPrice = $(`#itemPrice_${foodId}`).val()
        requests.changeFoodPrice(foodId, foodPrice, this.checkFoodPriceChanged)
    }
    handelFoodDiscount = (foodId) => {
        let foodDiscount = $(`#itemDiscount_${foodId}`).val()
        requests.changeFoodDiscount(foodId, foodDiscount, this.checkFoodDiscountChanged)

    }
    checkFoodDiscountChanged = (res) => {
        if (res.hasOwnProperty('statusCode') && res.statusCode === 200) {
            //    some staff
        }
    }

    checkFoodPriceChanged = (res) => {
        if (res.statusCode === 200) {
            this.getFoods();
            ReactSwal.fire({
                title: 'قیمت با موفقیت تغیر کرد',
                icon: "success",
                timer: 2000,
                timerProgressBar: true
            })

        }
    }

    handleMoreOnClick = () => {
        this.props.history.push('/foods')
    }

    render() {
        console.log(this.props)
        if (window.location.pathname.toString() === '/dashboard') {
            return (
                <React.Fragment>
                    <div className="justForGap"/>
                    <div className="smallBox ">
                        <table className="fixed_header table-hover table-striped table-sm text-center m-auto">
                            <thead>
                            <tr className="bg-light">
                                <th style={{borderTopLeftRadius: "15px"}}>وضعیت</th>
                                <th style={{width: "110px"}}>قیمت</th>
                                <th>درصد تخفیف</th>
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
        } else {
            return (
                <React.Fragment>
                    <div className="navGap"/>
                    <div style={{paddingTop: '20px', direction: 'ltr'}} className="smallBox ">
                        <table className="fixed_header table-hover table-striped table-sm text-center m-auto">
                            <thead>
                            <tr className="bg-light">
                                <th style={{borderTopLeftRadius: "15px"}}>وضعیت</th>
                                <th style={{width: "110px"}}>قیمت</th>
                                <th>درصد تخفیف</th>
                                <th>نام</th>
                                <th style={{borderTopRightRadius: "15px"}}>#</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.createFoodRows()}
                            </tbody>
                        </table>

                    </div>
                </React.Fragment>
            )


        }

    }

    uiComponent = () => {
        return (
            <div className="container">
                <div className='justForGap'></div>
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
        return (this.state.foodsList.slice(0, howManyFoodsToShow).map(eachFood => (
            <tr key={`itemId_${eachFood.foods_id}`} className="bg-white">
                <td>
                    <Typography component="div">
                        <Grid component="label" container alignItems="center" spacing={1}>
                            <Grid item>ناموجود</Grid>
                            <Grid item>
                                <AntSwitch
                                    disabled={!(eachFood.status === "out of stock" || eachFood.status === "in stock")}
                                    checked={((eachFood.status === "out of stock" || eachFood.status === "in stock") && eachFood.status === "in stock")}
                                    onChange={() => {
                                        this.handelChangStatus(eachFood.foods_id, ((eachFood.status === "in stock") ? ("out of stock") : ("in stock")))
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
                                        this.handelFoodPrice(eachFood.foods_id)
                                    }}>
                                <FontAwesomeIcon icon={faCheck}/>
                            </button>
                        </div>
                        <input id={`itemPrice_${eachFood.foods_id}`} type="text" placeholder={eachFood.price}
                               defaultValue={eachFood.price} className="form-control" aria-label=""
                               aria-describedby="basic-addon1"/>
                    </div>
                </td>
                <td>
                    <div className="input-group input-group-sm justify-content-center ltr">
                        <div className="input-group-prepend ">
                            <button style={{height: '31px'}} value="1" className="btn btn-outline-success" type="button"
                                    onClick={() => {
                                        this.handelFoodDiscount(eachFood.foods_id)
                                    }}>
                                <FontAwesomeIcon icon={faCheck}/>
                            </button>
                        </div>
                        <input style={{maxWidth: '40px'}} id={`itemDiscount_${eachFood.foods_id}`} type="text"
                               placeholder={eachFood.discount}
                               defaultValue={eachFood.discount} className="form-control" aria-label=""
                               aria-describedby="basic-addon1"/>
                    </div>
                </td>

                <td>
                    <div onClick={() => {
                        this.props.setFoodInfoTemp(this.state.foodsList.filter(ef => eachFood.foods_id === ef.foods_id))
                        this.props.history.push('/foodInfo')
                        console.log(this.props)
                    }
                    }>{eachFood.name}</div>
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

