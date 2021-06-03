import React from "react";
import $ from 'jquery'
import {connect} from 'react-redux';
import * as requests from '../../ApiRequests/requests'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faChevronCircleLeft} from "@fortawesome/free-solid-svg-icons";
import {FormControl, MenuItem, Select} from '@material-ui/core';
import './css/style.css'
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const ReactSwal = withReactContent(Swal)


class EachFood extends React.Component {
    state = {
        selectedFile: null,
        categories: [],
    }

    componentDidMount() {
        requests.getCategoryList((e) => {
            if (e)
                this.setState({
                    categories: e.data
                })
        })
    }

    getFoods = () => {
        requests.getFoods(this.checkFoods)
    }

    handleChangeFoodName = (foodId) => {
        let foodName = $(`#inpName_${foodId}`).val()
        requests.changeFoodName(foodId, foodName, this.checkFoodNameChanged)
    }
    checkFoodNameChanged = (res) => {
        if (res.statusCode === 200) {
            this.getFoods()
        }
    }

    handleChangeFoodDetails = (foodId) => {
        let foodDetails = $(`#inpDetails_${foodId}`).val()
        requests.changeFoodDetails(foodId, foodDetails, this.checkFoodDetailsChanged)
    }
    checkFoodDetailsChanged = (res) => {
        if (res.statusCode === 200) {
            this.getFoods()
        }
    }

    handleChangeFoodDeliveryTime = (foodId) => {
        let foodDeliveryTime = $(`#inpDeliveryTime_${foodId}`).val()
        requests.changeFoodDeliveryTime(foodId, foodDeliveryTime, this.checkFoodDeliveryTimeChanged)
    }
    checkFoodDeliveryTimeChanged = (res) => {
        if (res.statusCode === 200) {
            this.getFoods()
        }
    }

    handleChangeGroup = (elem) => {
        let foodId = elem.target.name.split("_")[1]
        let newGroup = elem.target.value
        if (newGroup.length > 2) {
            requests.changeFoodGroup(foodId, newGroup, this.checkFoodGroupChanged)
        }
    }
    checkFoodGroupChanged = (res) => {
        if (res.statusCode === 200) {
            this.getFoods()
        }
    }

    onFileChange = (event, foodId) => {
        this.state.selectedFile = event.target.files[0]
        this.onFileUpload(foodId)

    };

    onFileUpload = (foodId) => {
        if (this.state.selectedFile) {
            requests.uploadFoodThumbnailNew(foodId, this.state.selectedFile, this.checkFoodThumbnailChanged)

        }
    };
    checkFoodThumbnailChanged = (res) => {
        if (res === 200) {
            $('.eachFoodImage').css({
                background: 'url(' + URL.createObjectURL(this.state.selectedFile) + ')', backgroundSize: 'cover',
                backgroundPosition: 'center',
                cursor: 'pointer',
                overflow: 'hidden'
            })
            ReactSwal.fire({
                title: <h1>!نمایه عوض شد</h1>,
                icon: "success",
            })
        }
    }

    render() {
        let food = this.props.foodInfoTemp[0]
        console.log(food)
        return (
            <React.Fragment>
                <div className="navGap"/>
                <div className="smallBox pt-3">
                    <FontAwesomeIcon className="backIcon" onClick={() => {
                        this.props.history.push("/foods")
                    }} icon={faChevronCircleLeft}/>
                    <span className='backText' onClick={() => {
                        this.props.history.push("/foods")
                    }}>بازگشت</span>
                    <div className='w-100'>
                        <div className='w-100 d-flex flex-row justify-content-end imgAndNameContainer'>
                            <div className='text-center eachFoodName  pr-3 pt-3'>{food.persianName}</div>
                            <div>
                                <div style={{
                                    background: `url(${food.thumbnail})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    cursor: 'pointer',
                                    overflow: 'hidden'
                                }} className='eachFoodImage'>
                                    <label className='uploadLable w-100 h-100 cursorPointer' htmlFor='uploadI'/>
                                </div>
                                <div className="input-group input-group-sm inputGroups d-flex flex-column text-center">
                                    <input ref='fileUploadInput' id='uploadI' className='inputFile' type="file"
                                           accept='.png,.jpg,.jpeg'
                                           onChange={(e) => {
                                               this.onFileChange(e, food.id)
                                           }}/>

                                </div>

                            </div>
                        </div>

                        <div className='nameAndDeliveryTime mt-4'>
                            <p className='foodPlaceHolderLabels IranSansLight mr-5 ml-3'>اسم</p>
                            <div className="input-group input-group-sm inputGroups biggerInputEachFood">
                                <div className="input-group-prepend">
                                    <button value="1" className="btn btn-outline-success" type="button" onClick={() => {
                                        this.handleChangeFoodName(food.id)
                                    }}>
                                        <FontAwesomeIcon icon={faCheck}/>
                                    </button>
                                </div>
                                <input id={`inpName_${food.id}`} type="text" placeholder={food.persianName}
                                       defaultValue={food.persianName} className=" rtl form-control nameInput" aria-label=""
                                       aria-describedby="basic-addon1"/>
                            </div>

                            <p className='foodPlaceHolderLabels IranSansLight mr-5 ml-3'>زمان تحویل</p>

                            <div className="input-group input-group-sm inputGroups">

                                <div className="input-group-prepend">
                                    <button value="1" className="btn btn-outline-success" type="button" onClick={() => {
                                        this.handleChangeFoodDeliveryTime(food.id)
                                    }}>
                                        <FontAwesomeIcon icon={faCheck}/>
                                    </button>
                                </div>
                                <input id={`inpDeliveryTime_${food.id}`} type="text"
                                       placeholder={food.deliveryTime} defaultValue={food.deliveryTime}
                                       className="form-control rtl" aria-label="" aria-describedby="basic-addon1"/>
                            </div>
                        </div>

                        <p className='foodPlaceHolderLabels IranSansLight mt-4 '>جزئیات</p>

                        <div className="input-group input-group-sm inputGroups">

                            <div className="input-group-prepend">
                                <button value="1" className="btn btn-outline-success" type="button" onClick={() => {
                                    this.handleChangeFoodDetails(food.id)
                                }}>
                                    <FontAwesomeIcon icon={faCheck}/>
                                </button>
                            </div>
                            <input id={`inpDetails_${food.id}`} type="text"
                                   placeholder={' مثال : پنیر+گوجه+خیارشور'}
                                   defaultValue={JSON.parse(food.details).join('+')} className=" rtl form-control"
                                   aria-label="" aria-describedby="basic-addon1"/>
                        </div>

                        <p style={{width: '100%', textAlign: 'center', marginTop: '10px'}}>دسته بندی</p>
                        <div className="input-group input-group-sm ">
                            <FormControl
                                style={{direction: 'rtl', minWidth: "120px", margin: 'auto', textAlign: 'center'}}>
                                <Select style={{fontFamily: 'IRANSansMobile_Med'}}
                                        labelId="demo-simple-select-helper-label"
                                        name={'selectorGroup_' + food.id} defaultValue={food.group}
                                        onChange={this.handleChangeGroup}>
                                    <MenuItem value="">
                                        <em>انتخاب نشده</em>
                                    </MenuItem>
                                    {
                                        this.state.categories.map(eachCategory => {
                                            return (
                                                <MenuItem style={{fontFamily: 'IRANSansMobile_Light'}}
                                                          value={eachCategory.englishName}>{eachCategory.persianName}</MenuItem>

                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </div>


                        {/*<p className='foodPlaceHolderLabels mt-5'>نمایه غذا</p>*/}

                        {/*<button onClick={(args)=>{this.onFileUpload(args, food.id)}}>*/}
                        {/*    آپلود عکس*/}
                        {/*</button>*/}
                        {this.state.selectedFile ? this.state.selectedFile.name : null}
                    </div>

                </div>
            </React.Fragment>
        );

    }
}


const mapStateToProps = (store) => {
    return {
        foodInfoTemp: store.reducerTempStates.foodInfoTemp
    }
}

const mapDispatchToProps = () => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(EachFood);

