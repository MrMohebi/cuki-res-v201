import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faChevronCircleLeft} from "@fortawesome/free-solid-svg-icons";
import {Button, FormControl, MenuItem, Select} from "@material-ui/core";
import DoneOutlineRoundedIcon from '@material-ui/icons/DoneOutlineRounded';
import * as requests from '../../ApiRequests/requests'

class NewFood extends React.Component{
    state = {
        foodImage:'https://png.pngtree.com/png-vector/20190130/ourlarge/pngtree-hand-drawn-cute-cartoon-burger-with-food-elements-elementlovely-foodcartoon-foodhand-png-image_613521.jpg',
        foodName:'',
        foodGroup:'',
        foodDeliveryTime:'',
        foodDetails:'',
        categories:[]

    }
    submitHandler = ()=>{
        console.log(this.state)
    }
    componentDidMount() {
        requests.getCategoryList((e) => {
            if (e)
                this.setState({
                    categories:e.data
                })
        })
    }

    render() {
        return (
            <React.Fragment>
                <div className="navGap"/>
                <div className="smallBox pt-3">
                    <FontAwesomeIcon className="backIcon" onClick={()=>{this.props.history.push("/foods")}} icon={faChevronCircleLeft}/>
                    <span className='backText' onClick={()=>{this.props.history.push("/foods")}}>بازگشت</span>
                    <div className='w-100'>
                        <div className='w-100 d-flex flex-row justify-content-end imgAndNameContainer'>
                            {/*<div className='text-center eachFoodName  pr-3 pt-3'>{food.name}</div>*/}
                            <div>
                                <div style={{
                                    background: `url(${this.state.foodImage})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    cursor:'pointer',
                                    overflow:'hidden'
                                }} className='eachFoodImage'>
                                    <label className='uploadLable w-100 h-100 cursorPointer' htmlFor='uploadI'/>
                                </div>
                                <div className="input-group input-group-sm inputGroups d-flex flex-column text-center">
                                    <input ref='fileUploadInput' id='uploadI' className='inputFile' type="file" accept='.png,.jpg,.jpeg'
                                           onChange={(e) => {
                                               this.onFileChange(e, Math.random()*100)
                                           }}/>
                                </div>

                            </div>
                        </div>

                        <div className='nameAndDeliveryTime mt-4'>
                            <p className='foodPlaceHolderLabels IranSansLight'>اسم</p>
                            <div className="input-group input-group-sm inputGroups biggerInputEachFood">
                                <div className="input-group-prepend">
                                    <button value="1"  className="btn btn-outline-success" type="button" onClick={()=>{}}>
                                        <FontAwesomeIcon icon={faCheck}/>
                                    </button>
                                </div>
                                <input  id={`inpName`} onChange={(e) => {
                                    this.state.foodName = e.target.value;
                                }} type="text" className=" rtl form-control nameInput" aria-label="" aria-describedby="basic-addon1"/>
                            </div>

                            <p className='foodPlaceHolderLabels IranSansLight mr-4'>زمان تحویل</p>

                            <div className="input-group input-group-sm inputGroups" >

                                <div className="input-group-prepend">
                                    <button value="1"  className="btn btn-outline-success" type="button" onClick={()=>{}}>
                                        <FontAwesomeIcon icon={faCheck}/>
                                    </button>
                                </div>
                                <input id={`inpDelivery`} type="text"  className="form-control rtl" aria-label="" aria-describedby="basic-addon1" onChange={(e) => {
                                   if (parseInt(e.target.value[e.target.value.length -1]).toString() === "NaN" || e.target.value.length > 3){
                                       e.target.value = e.target.value.slice(0,-1)
                                   }
                                   this.state.foodDeliveryTime = e.target.value

                                }}/>
                            </div>
                        </div>

                            <p className='foodPlaceHolderLabels IranSansLight mt-4'>جزئیات</p>

                            <div className="input-group input-group-sm inputGroups">

                                <div className="input-group-prepend">
                                    <button value="1"  className="btn btn-outline-success" type="button" onClick={()=>{}}>
                                        <FontAwesomeIcon icon={faCheck}/>
                                    </button>
                                </div>
                                <input id={`inpDetail`} type="text" placeholder={' مثال : پنیر+گوجه+خیارشور'} onChange={(e) => {
                                    this.state.foodDetails = e.target.value;
                                }}  className=" rtl form-control" aria-label="" aria-describedby="basic-addon1"/>
                            </div>

                        <p style={{width:'100%',textAlign:'center',marginTop:'10px'}}>دسته بندی</p>
                        <div className="input-group input-group-sm ">
                            <FormControl style={{direction:'rtl',minWidth: "120px",margin:'auto',textAlign:'center'}}>
                                <Select style={{fontFamily:'IRANSansMobile_Med'}} labelId="demo-simple-select-helper-label" name={'selectorGroup_'} onChange={this.handelChangeGroup}>
                                    <MenuItem value="">
                                        <em >انتخاب نشده</em>
                                    </MenuItem>

                                </Select>
                            </FormControl>


                        </div>
                        <div className="w-100 d-flex justify-content-center flex-row-reverse mt-4">
                            <Button onClick={() => {
                                this.submitHandler()
                            }} variant={'contained'} color="primary" startIcon={<DoneOutlineRoundedIcon/>}>
                                ثبت
                            </Button>
                        </div>

                        {this.state.selectedFile? this.state.selectedFile.name : null}
                    </div>

                </div>
            </React.Fragment>
        );

    }

}
export default NewFood;