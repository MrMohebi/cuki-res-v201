import $ from 'jquery';
import * as actions from '../Stores/reduxStore/actions'
import {store} from '../Stores/reduxStore/store'


export const BASE_URL = "https://api.cuki.ir/v201/res/";
export const BASE_URL_upload = "https://dl.cuki.ir/";


export const signin = (username, password,callbackFunction)=>{
    $.post(BASE_URL+'loginRes.fetch.php',{username, password}).then(res =>{
        res = (res !== undefined && res !== null) ? res : {}
        callbackFunction(res)
    })
}


export const getOrders = (startDate, endDate, callbackFunction)=>{
    let token = store.getState().reducerRestaurantUser.token
    $.post(BASE_URL+'getOrdersList.fetch.php',{token:token, startDate, endDate}).then(res =>{
        if(res.statusCode === 200){
            actions.setOrdersList(res.data)
        }
        callbackFunction(res)
    })
}


export const getTables = (callbackFunction)=>{
    let englishName = store.getState().reducerRestaurantUser.englishName
    $.post(BASE_URL+'getAllRestaurantData.fetch.php',{english_name: englishName}).then(res =>{
        if(res.statusCode === 200){
            actions.setTables(res.data.allTableList)
        }
        callbackFunction(res)
    })
}


export const changeFoodStatus = (foodId, foodStatus, callbackFunction)=>{
    let token = store.getState().reducerRestaurantUser.token;
    let englishName = store.getState().reducerRestaurantUser.englishName;
    $.post(BASE_URL+'changeFoodInfo.modify.php',{token: token, englishName, foodId, statusChange:'true',status:foodStatus}).then(res =>{
        callbackFunction(res)
    })
}

export const changeFoodPrice = (foodId, foodPrice, callbackFunction)=>{
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL+'changeFoodInfo.modify.php',{token: token, foodId,price:foodPrice}).then(res =>{
        callbackFunction(res)
    })
}
export const newFood = (foodName,foodGroup,details,price,deliveryTime,thumbnail,callbackFunction)=>{
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL+'createNewFood.add.php',{token:token,name:foodName,group:foodGroup,details:details,price,deliveryTime:deliveryTime,thumbnail}).then(res=>{
        callbackFunction(resxc)
    })

}
export const changeFoodDiscount = (foodId, foodDiscount, callbackFunction)=>{
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL+'changeFoodInfo.modify.php',{token: token, foodId,discount :foodDiscount}).then(res =>{
        callbackFunction(res)
    })
}


export const changeFoodName = (foodId, foodName, callbackFunction)=>{
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL+'changeFoodInfo.modify.php',{token: token, foodId,persianName:foodName}).then(res =>{
        callbackFunction(res)
    })
}



export const changeFoodDetails = (foodId, foodDetails, callbackFunction)=>{
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL+'changeFoodInfo.modify.php',{token: token, foodId,details:foodDetails}).then(res =>{
        callbackFunction(res)
    })
}


export const getCategoryList = (callbackFunction)=>{
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL+'getCategoriesList.fetch.php',{token: token}).then(res =>{
        callbackFunction(res)
    })
}


export const changeFoodDeliveryTime = (foodId, foodDeliveryTime, callbackFunction)=>{
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL+'changeFoodInfo.modify.php',{token: token, foodId,deliveryTime:foodDeliveryTime}).then(res =>{
        callbackFunction(res)
    })
}


export const changeFoodGroup = (foodId, newGroup, callbackFunction)=>{
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL+'changeFoodInfo.modify.php',{token: token, foodId,group:newGroup}).then(res =>{
        callbackFunction(res)
    })
}


export const changeOrderStatus = (trackingId, newOrderStatus, deleteReason, callbackFunction)=>{
    let token = store.getState().reducerRestaurantUser.token;
    let englishName = store.getState().reducerRestaurantUser.englishName;
    $.post(BASE_URL+'changeOrderStatus.modify.php',{token:token,trackingId, newOrderStatus, deleteReason: deleteReason}).then(res =>{
        callbackFunction(res)
    })
}

export const getFoods = (callbackFunction)=>{
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL+'getFoodsList.fetch.php',{token:token}).then(res =>{
        callbackFunction(res)
    })
}



export const changeRestaurantName = (persianName, callbackFunction)=>{
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL+'changeResInfo.modify.php',{token,persianName}).then(res =>{
        callbackFunction(res)
    })
}


export const changeRestaurantPhone = (phones, callbackFunction)=>{
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL+'changeResInfo.modify.php',{token,phone:JSON.stringify(phones)}).then(res =>{
        callbackFunction(res)
    })
}


export const changeRestaurantAddress = (addressText, callbackFunction)=>{
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL+'changeResInfo.modify.php',{token,addressText}).then(res =>{
        callbackFunction(res)
    })
}


export const getRestaurantInfo = (callbackFunction)=>{
    let token = store.getState().reducerRestaurantUser.token;
    let englishName = store.getState().reducerRestaurantUser.englishName;
    $.post(BASE_URL+'getResInfo.fetch.php',{token}).then(res =>{
        callbackFunction(res)
    })
}



export const changeRestaurantOpenHours = (openTime, callbackFunction)=>{
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL+'changeResInfo.modify.php',{token,openTime:JSON.stringify(openTime)}).then(res =>{
        callbackFunction(res)
    })
}


export const changeRestaurantType = (type, callbackFunction)=>{
    let token = store.getState().reducerRestaurantUser.token;
    let englishName = store.getState().reducerRestaurantUser.englishName;
    $.post(BASE_URL+'changeRestaurantInfo.modify.php',{token, englishName, typeChange:'true',type:JSON.stringify(type)}).then(res =>{
        callbackFunction(res)
    })
}




export const createTable = (tableName, tableCapacity, tableStatus, callbackFunction)=>{
    let token = store.getState().reducerRestaurantUser.token;
    let englishName = store.getState().reducerRestaurantUser.englishName;
    $.post(BASE_URL+'createTable.add.php',{token, englishName, tableName, tableCapacity, tableStatus}).then(res =>{
        callbackFunction(res)
    })
}


export const editTable = (tableId, tableName = null, tableCapacity=null, tableStatus=null, callbackFunction)=>{
    let token = store.getState().reducerRestaurantUser.token;
    let englishName = store.getState().reducerRestaurantUser.englishName;
    $.post(BASE_URL+'changeTable.modify.php',{token, tableId, englishName, tableName, tableCapacity, tableStatus}).then(res =>{
        callbackFunction(res)
    })
}

export const uploadFoodThumbnail = (foodId, formData, callbackFunction)=>{
    let token = store.getState().reducerRestaurantUser.token;
    formData.append("token", token);
    formData.append("foodId", foodId);
    $.ajax({
        url: BASE_URL+'changeFoodInfo.modify.php',
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function (res) {
            if(Number.isInteger(res.statusCode))
                callbackFunction(res)
            else
                callbackFunction(JSON.parse(res))

        }
    });
}



