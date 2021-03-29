import React from "react";
import Lottie from 'react-lottie';
import * as animationData from './a.json'
import Anime from "./turnPhone.json";
import {Player} from "@lottiefiles/react-lottie-player";


function TurnPhone(){
    return(
        <div className={'TurnPhone position-absolute flex-column w-100 h-100 bg-white  justify-content-center align-items-center'}>
            <span> اندازه صفحه کوچک تر از حد مجاز</span>
            <Player
                autoplay
                loop
                src={Anime}
                style={{ height: '300px', width: '300px' }}
            >
            </Player>
        </div>
    )
}
export default TurnPhone