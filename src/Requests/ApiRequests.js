import $ from 'jquery';
import * as actions from '../Stores/reduxStore/actions'
import {store} from '../Stores/reduxStore/store'


export const BASE_URL = "https://api.cuki.ir/v201/res/";
export const BASE_URL_upload = "https://dl.cuki.ir/";


export const signin = (callbackFunction, username, password)=>{
    $.post(BASE_URL+'example.php',{username, password}).then(res =>{
        res = (res !== undefined && res !== null) ? res : {}
        callbackFunction(res)
    })
}