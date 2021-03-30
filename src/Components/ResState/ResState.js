import React, {useEffect, useState} from "react";
import {Switch} from "@material-ui/core";
import * as requests from '../../ApiRequests/requests'

let resState = ()=>{
    requests.getRestaurantInfo(checkResStatus)
}
let changeResStatus = (newStatus)=>{
    requests.changeRestaurantStatus(newStatus,changeResStatusBack)
}

let changeResStatusBack =(res)=>{
    console.log(res)
}

let checkResStatus = (res)=>{
    console.log(res)
}

function ResState(){
    let [buttonState,setButtonState] = useState(false)
    useEffect(()=>{
        resState()
    })
    return(
            <div className={'smallBox mt-5 d-flex flex-column justify-content-center align-items-center'}>
                <span>وضعیت رستوران</span>
                <div className={'d-flex flex-row-reverse justify-content-center align-items-center mt-3 w-25'}>
                    <span>فعال</span>
                    <Switch className={'m-2'}
                        checked={buttonState}
                        onChange={(e)=>{
                            console.log(e)
                            if (buttonState){
                                changeResStatus('closed')
                            } else{
                                changeResStatus('open')
                            }
                            setButtonState(!buttonState)
                        }}
                        color="primary"
                        name="checkedB"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                    <span> غیر فعال</span>
                </div>
            </div>
    )
}
export default ResState