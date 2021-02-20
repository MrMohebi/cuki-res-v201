import React from "react";
import $ from 'jquery'
import { connect } from 'react-redux';
import * as requests from '../../ApiRequests/requests'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck,faChevronCircleLeft} from "@fortawesome/free-solid-svg-icons";
import { Select, FormControl, InputLabel, MenuItem } from '@material-ui/core';
import './css/style.css'
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const ReactSwal = withReactContent(Swal)



class EachFood extends React.Component {
    state = {
        selectedFile: null,
        categories:[]
    }

    componentDidMount() {
        requests.getCategoryList((e) => {
            if (e)
            this.setState({
                categories:e.data
            })
        })
    }

    getFoods = ()=>{
        requests.getFoods(this.checkFoods)
    }

    handelChangeFoodName = (foodId) =>{
        let foodName = $(`#inpName_${foodId}`).val()
        requests.changeFoodName(foodId,foodName,this.checkFoodNameChanged)
    }
    checkFoodNameChanged = (res) =>{
        if(res.statusCode === 200){
            this.getFoods()
        }
    }

    handelChangeFoodDetails = (foodId) =>{
        let foodDetails = $(`#inpDetails_${foodId}`).val()
        requests.changeFoodDetails(foodId,foodDetails,this.checkFoodDetailsChanged)
    }
    checkFoodDetailsChanged = (res) =>{
        if(res.statusCode === 200){
            this.getFoods()
        }
    }

    handelChangeFoodDeliveryTime = (foodId) =>{
        let foodDeliveryTime = $(`#inpDeliveryTime_${foodId}`).val()
        requests.changeFoodDeliveryTime(foodId, foodDeliveryTime, this.checkFoodDeliveryTimeChanged)
    }
    checkFoodDeliveryTimeChanged = (res) =>{
        if(res.statusCode === 200){
            this.getFoods()
        }
    }

    handelChangeGroup = (elem) =>{
        let foodId =  elem.target.name.split("_")[1]
        let newGroup = elem.target.value
        if(newGroup.length > 2){
            requests.changeFoodGroup(foodId, newGroup, this.checkFoodGroupChanged)
        }
    }
    checkFoodGroupChanged = (res) =>{
        if(res.statusCode === 200){
            this.getFoods()
        }
    }

    onFileChange = (event,foodId) => {
        this.state.selectedFile = event.target.files[0]
        this.onFileUpload(null,foodId)
    };

    onFileUpload = (args, foodId) => {
        const formData = new FormData();
        formData.append(
            "foodThumb",
            this.state.selectedFile,
            this.state.selectedFile.name
        );
        requests.uploadFoodThumbnail(foodId,formData, this.checkFoodThumbnailChanged)
    };
    checkFoodThumbnailChanged = (res) =>{
        if(res.statusCode === 200){
            ReactSwal.fire({
                title: <h1>!نمایه عوض شد</h1>,
                icon: "success",
            })
        }
    }

    render() {
        let food = this.props.foodInfoTemp[0]

            return (
                <React.Fragment>
                    <div className="justForGap"/>
                <div className="smallBox pt-3">
                    <FontAwesomeIcon className="backIcon" onClick={()=>{this.props.history.push("/foods")}} icon={faChevronCircleLeft}/>
                    <span className='backText' onClick={()=>{this.props.history.push("/foods")}}>بازگشت</span>
                    <h1 className='text-center'>{food.name}</h1>

                    <p className='foodPlaceHolderLabels'>اسم</p>

                    <div className="input-group input-group-sm inputGroups ">
                        <div className="input-group-prepend">
                            <button value="1"  className="btn btn-outline-success" type="button" onClick={()=>{this.handelChangeFoodName(food.foods_id)}}>
                                <FontAwesomeIcon icon={faCheck}/>
                            </button>
                        </div>
                        <input id={`inpName_${food.foods_id}`} type="text" placeholder={food.name} defaultValue={food.name}  className=" rtl form-control" aria-label="" aria-describedby="basic-addon1"/>
                    </div>
                    <p className='foodPlaceHolderLabels'>جزئیات</p>

                    <div className="input-group input-group-sm inputGroups">

                        <div className="input-group-prepend">
                            <button value="1"  className="btn btn-outline-success" type="button" onClick={()=>{this.handelChangeFoodDetails(food.foods_id)}}>
                                <FontAwesomeIcon icon={faCheck}/>
                            </button>
                        </div>
                        <input id={`inpDetails_${food.foods_id}`} type="text" placeholder={' مثال : پنیر+گوجه+خیارشور'} defaultValue={JSON.parse(food.details).join('+')}  className=" rtl form-control" aria-label="" aria-describedby="basic-addon1"/>
                    </div>
                    <p className='foodPlaceHolderLabels'>زمان تحویل</p>

                    <div className="input-group input-group-sm inputGroups" >

                        <div className="input-group-prepend">
                            <button value="1"  className="btn btn-outline-success" type="button" onClick={()=>{this.handelChangeFoodDeliveryTime(food.foods_id)}}>
                                <FontAwesomeIcon icon={faCheck}/>
                            </button>
                        </div>
                        <input id={`inpDeliveryTime_${food.foods_id}`} type="text" placeholder={food.delivery_time} defaultValue={food.delivery_time}  className="form-control rtl" aria-label="" aria-describedby="basic-addon1"/>
                    </div>
                    <p style={{width:'100%',textAlign:'center',marginTop:'10px'}}>دسته بندی</p>
                    <div className="input-group input-group-sm ">
                        <FormControl style={{direction:'rtl',minWidth: "120px",margin:'auto',textAlign:'center'}}>
                            <Select style={{fontFamily:'IRANSansMobile_Med'}} labelId="demo-simple-select-helper-label" name={'selectorGroup_'+food.foods_id} defaultValue={food.group} onChange={this.handelChangeGroup}>
                                <MenuItem value="">
                                    <em >انتخاب نشده</em>
                                </MenuItem>
                                {
                                    this.state.categories.map(eachCategory=>{
                                        return(
                                            <MenuItem style={{fontFamily:'IRANSansMobile_Light'}} value={eachCategory.english_name}>{eachCategory.persian_name}</MenuItem>

                                        )
                                    })
                                }
                            </Select>
                        </FormControl>
                    </div>


                    <p className='foodPlaceHolderLabels mt-5'>نمایه غذا</p>
                    <div style={{background:`url(${food.thumbnail})`,backgroundSize:'cover',backgroundPosition:'center'}} className='eachFoodImage'></div>
                    <div className="input-group input-group-sm inputGroups d-flex flex-column text-center" >
                        <input id='uploadI' className='inputFile' type="file" accept='.png,.jpg,.jpeg' onChange={(e) => {
                            this.onFileChange(e,food.foods_id)
                        } } />
                        <label className='uploadLable' for='uploadI'>عکس را انتخاب کنید</label>
                        {/*<button onClick={(args)=>{this.onFileUpload(args, food.foods_id)}}>*/}
                        {/*    آپلود عکس*/}
                        {/*</button>*/}
                        {this.state.selectedFile? this.state.selectedFile.name : null}
                    </div>

                </div>
                </React.Fragment>
            );

    }
}


const mapStateToProps = (store) => {
    return {
        foodInfoTemp:store.reducerTempStates.foodInfoTemp
    }
}

const mapDispatchToProps = () => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EachFood);

