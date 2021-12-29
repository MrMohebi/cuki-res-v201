import React, {useEffect} from 'react';
import {ButtonBase, makeStyles} from "@material-ui/core";
import './FoodSubsets.css'

const useStyles = makeStyles({
    root: {}
});


const FoodSubsets = () => {

    let [subsets, setS] = React.useState([])
    let [addSubsetsStatus, setAddSubsetsStatus] = React.useState(true)

    let handleNameInputChange = (index, name) => {
        let tempState = subsets
        tempState[index].name = name;
        setS(tempState)
        setS([...subsets])
        if (subsets[index].name && subsets[index].price)
            setAddSubsetsStatus(false)
    }

    let handlePriceInputChange = (index, price) => {
        let tempState = subsets
        tempState[index].price = price;
        setS(tempState)
        setS([...subsets])
        if (subsets[index].name && subsets[index].price)
            setAddSubsetsStatus(false)
    }


    return (
        <section className={'w-100 text-center mt-4 d-flex flex-column align-items-center'}>
            <span>زیر مجموعه های غذا</span>
            <span className={'text-black-50 small mt-1'}>برای مثال: سایز، نوع و دستور پخت</span>
            <div className={'w-100 d-flex flex-row-reverse align-items-center mt-2 justify-content-center'}>

                {
                    subsets.map((value, index) => {
                        return (
                            <div
                                className={'d-flex flex-column justify-content-center align-items-center each-subset mx-2'}
                                id={index + ''}>

                                <div className="input-group input-group-sm mb-1">
                                    <input type="text" className="no-shadow form-control" aria-label="Small"
                                           aria-describedby="inputGroup-sizing-sm"
                                           onChange={(e) => {
                                               handleNameInputChange(index, e.currentTarget.value)
                                           }}
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text" style={{width: 50, display: 'block'}}
                                              id="inputGroup-sizing-sm">نام</span>
                                    </div>
                                </div>
                                <div className="input-group input-group-sm ">
                                    <input type="text" className=" no-shadow form-control" aria-label="Price"
                                           aria-describedby="inputGroup-sizing-sm" onChange={(e) => {
                                        handlePriceInputChange(index, e.currentTarget.value)
                                    }}/>
                                    <div className="input-group-append">
                                        <span className="input-group-text" style={{width: 50, display: 'block'}}
                                              id="inputGroup-sizing-sm">قیمت</span>
                                    </div>
                                </div>
                                {/*<ButtonBase style={{*/}
                                {/*    width:'100%',*/}
                                {/*    height:30,*/}
                                {/*    pointerEvents:subsets[index].name&&subsets[index].price?'all':'none',*/}
                                {/*    border:subsets[index].name&&subsets[index].price?'solid #17c017 1px':'solid #96ec96 1px',*/}
                                {/*    background:'white',*/}
                                {/*    color:subsets[index].name&&subsets[index].price?'#17c017':'#96ec96',*/}
                                {/*    borderRadius:5,*/}
                                {/*    marginTop:5*/}
                                {/*}}>*/}
                                {/*    تایید*/}
                                {/*</ButtonBase>*/}

                            </div>
                        )
                    })
                }


                <ButtonBase
                    style={{
                        pointerEvents: subsets.length < 4 && subsets[subsets.length - 1] && subsets[subsets.length - 1].name && subsets[subsets.length - 1].price || !subsets[subsets.length - 1] ? 'all' : 'none',
                        color: subsets.length < 3 && subsets[subsets.length - 1] && subsets[subsets.length - 1].name && subsets[subsets.length - 1].price || !subsets[subsets.length - 1] ? '#8450b6' : '#b2a2c7',
                        display: 'flex',
                        flexFlow: 'column',
                    }}
                    onClick={() => {
                        if (!addSubsetsStatus) {
                            setAddSubsetsStatus(true)

                        } else {
                            setS([...subsets,
                                {
                                    name: '',
                                    price: 0
                                }
                            ])
                        }

                    }} classes={useStyles()} className={'add-subset-btn '}>
                    <i style={{
                        height: addSubsetsStatus ? 150 : 0,
                        overflow: 'hidden',
                        display: 'flex',
                        flexFlow: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: '.2s ease'
                    }} className={'fas fa-plus '}/>
                    <i style={{
                        height: addSubsetsStatus ? 0 : 150,
                        overflow: 'hidden',
                        display: 'flex',
                        flexFlow: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: '.2s ease'
                    }} className={'fas fa-check'}/>
                </ButtonBase>
            </div>
        </section>);
};

export default FoodSubsets;