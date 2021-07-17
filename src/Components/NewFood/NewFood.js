import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronCircleLeft} from "@fortawesome/free-solid-svg-icons";
import {Button, FormControl, MenuItem, Select} from "@material-ui/core";
import DoneOutlineRoundedIcon from '@material-ui/icons/DoneOutlineRounded';
import * as requests from '../../ApiRequests/requests'
import ReactSwal from "sweetalert2";

class NewFood extends React.Component {
    state = {
        foodImage: 'https://png.pngtree.com/png-vector/20190130/ourlarge/pngtree-hand-drawn-cute-cartoon-burger-with-food-elements-elementlovely-foodcartoon-foodhand-png-image_613521.jpg',
        foodName: '',
        foodGroup: '',
        foodDeliveryTime: '',
        foodDetails: '',
        categories: [],
        price: 0

    }
    constructor(props) {
        super(props);
        this.foodNameRef = React.createRef();
        this.foodDetailsRef = React.createRef();
        this.foodDeliveryTimeRef = React.createRef();
        this.foodPriceRef = React.createRef();
    }
    submitHandler = () => {
        requests.newFood(this.state.foodName, this.state.foodGroup, this.state.foodDetails, this.state.price,this.state.foodDeliveryTime,this.submitCallback)
    }
    submitCallback = (res)=>{
        if (res.hasOwnProperty('statusCode')&& res.statusCode === 200){
            this.foodNameRef.current.value = ''
            this.foodDeliveryTimeRef.current.value = ''
            this.foodPriceRef.current.value = ''
            this.foodDetailsRef.current.value = ''
            ReactSwal.fire({
                title: 'غدا ثبت شد',
                icon: "success",
                timer: 1000,
                timerProgressBar: true
            })
        }
    }

    componentDidMount() {
        requests.getCategoryList((e) => {
            if (e)
                this.setState({
                    categories: e.data
                })
        })
    }

    render() {
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
                            {/*<div className='text-center eachFoodName  pr-3 pt-3'>{food.name}</div>*/}
                            <div>
                                <div style={{
                                    background: `url(${this.state.foodImage})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    cursor: 'pointer',
                                    overflow: 'hidden'
                                }} className='eachFoodImage'>
                                    <label className='uploadLable w-100 h-100 cursorPointer' htmlFor='uploadI'/>
                                </div>
                                <div className="  inputGroups d-flex flex-column text-center">
                                    <input ref='fileUploadInput' id='uploadI' className='inputFile' type="file"
                                           accept='.png,.jpg,.jpeg'
                                           onChange={(e) => {
                                               this.state.foodImage = e.target.files[0]
                                           }}/>
                                </div>

                            </div>
                        </div>

                        <div className='nameAndDeliveryTime mt-4'>
                            <p className='foodPlaceHolderLabels IranSansLight'>: اسم</p>
                            <div className="  inputGroups biggerInputEachFood">
                                <div className="input-group-prepend">
                                </div>
                                <input ref={this.foodNameRef} id={`inpName`} onChange={(e) => {
                                    this.state.foodName = e.target.value;
                                }} type="text" className=" rtl form-control nameInput" aria-label=""
                                       aria-describedby="basic-addon1"/>
                            </div>

                            <p className='foodPlaceHolderLabels IranSansLight mr-4'>: زمان تحویل</p>
                            <div className="  inputGroups">

                                <div className="input-group-prepend">

                                </div>
                                <input ref={this.foodDeliveryTimeRef} id={`inpDelivery`} type="text" className="form-control rtl" aria-label=""
                                       aria-describedby="basic-addon1" onChange={(e) => {
                                    if (parseInt(e.target.value[e.target.value.length - 1]).toString() === "NaN" || e.target.value.length > 3) {
                                        e.target.value = e.target.value.slice(0, -1)
                                    }
                                    this.state.foodDeliveryTime = e.target.value
                                }}/>
                            </div>
                            <p className='foodPlaceHolderLabels IranSansLight mr-4'>: قیمت</p>
                            <div className="  inputGroups">

                                <div className="input-group-prepend">
                                </div>
                                <input ref={this.foodPriceRef} id={`inpDelivery`} type="text" className="form-control rtl" aria-label=""
                                       aria-describedby="basic-addon1" onChange={(e) => {
                                    if (parseInt(e.target.value[e.target.value.length - 1]).toString() === "NaN") {
                                        e.target.value = e.target.value.slice(0, -1)
                                    }
                                    this.state.price = e.target.value
                                }}/>
                            </div>
                        </div>

                        <p className='foodPlaceHolderLabels IranSansLight mt-4'>جزئیات</p>

                        <div className="  inputGroups">

                            <div className="input-group-prepend">
                            </div>
                            <input ref={this.foodDetailsRef} id={`inpDetail`} type="text" placeholder={' مثال : پنیر+گوجه+خیارشور'}
                                   onChange={(e) => {
                                       this.state.foodDetails = e.target.value;
                                   }} className=" rtl form-control" aria-label="" aria-describedby="basic-addon1"/>
                        </div>

                        <p style={{width: '100%', textAlign: 'center', marginTop: '10px'}}>دسته بندی</p>
                        <div className="input-group input-group-sm ">
                            <FormControl
                                style={{direction: 'rtl', minWidth: "120px", margin: 'auto', textAlign: 'center'}}>
                                <Select style={{fontFamily: 'IRANSansMobile_Med'}}
                                        labelId="demo-simple-select-helper-label" name={'selectorGroup_'}
                                        onChange={(e) => {
                                            this.state.foodGroup = e.target.value
                                        }}>
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
                        <div className="w-100 d-flex justify-content-center flex-row-reverse mt-4">
                            <Button onClick={() => {
                                this.submitHandler()
                            }} variant={'contained'} color="primary" startIcon={<DoneOutlineRoundedIcon/>}>
                                ثبت
                            </Button>
                        </div>

                        {this.state.selectedFile ? this.state.selectedFile.name : null}
                    </div>

                </div>
            </React.Fragment>
        );

    }

}

export default NewFood;