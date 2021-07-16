import React, {useEffect, useState} from "react";
import {Switch} from "@material-ui/core";
import * as requests from '../../ApiRequests/requests'



function ResState() {
    let [buttonState, setButtonState] = useState(false)

    useEffect(() => {
        getResState()
    },[buttonState])


    let getResState = () => {
        requests.getRestaurantInfo(checkResStatus)
    }
    let changeResStatus = (newStatus) => {
        requests.changeRestaurantStatus(newStatus, ()=>{})
    }

    let checkResStatus = (res) => {
        if (res.data.status){
            if (res.data.status === 'open'){
                setButtonState(true)
            }else {
                setButtonState(false)
            }
        }
    }

    return (
            <div className={'d-flex flex-row-reverse justify-content-center align-items-center ml-5 w-25'}>
                <span>فعال</span>
                <Switch className={'m-2'}
                        checked={buttonState}
                        onChange={() => {
                            if (buttonState) {
                                changeResStatus("close")
                            } else {
                                changeResStatus("open")
                            }
                            setButtonState(!buttonState)
                        }}
                        color="primary"
                        name="checkedB"
                        inputProps={{'aria-label': 'primary checkbox'}}
                />
                <span> غیر فعال</span>
            </div>
    )
}

export default ResState;