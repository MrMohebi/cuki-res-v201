import $ from 'jquery';
import * as actions from '../Stores/reduxStore/actions'
import {store} from '../Stores/reduxStore/store'


export const BASE_URL = "https://api.cukim.ir/api/v1/res/";


export const signin = (username, password, callbackFunction) => {
    $.post(BASE_URL + 'login', {username, password}).then(res => {
        res = (res !== undefined && res !== null) ? res : {}
        callbackFunction(res)
    })
}
export const getAllCustomersInfo = (callbackFunction) => {
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL + 'customerClub/getCustomersInfo.fetch.php', {token}).then(res => {
        res = (res !== undefined && res !== null) ? res : {}
        callbackFunction(res)
    })
}
export const getCustomerInfo = (phone,callbackFunction) => {
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL + 'customerClub/getCustomerInfo.fetch.php', {token,phone}).then(res => {
        res = (res !== undefined && res !== null) ? res : {}
        callbackFunction(res)
    })
}


export const getOrders = (startDate, endDate, callbackFunction) => {
    let token = store.getState().reducerRestaurantUser.token
    $.post(BASE_URL + 'getOrderList', {token: token, startDate, endDate}).then(res => {
        if (res.statusCode === 200) {
            actions.setOrdersList(res.data)
        }
        callbackFunction(res)
    })
}


// export const getTables = (callbackFunction) => {
//     let englishName = store.getState().reducerRestaurantUser.englishName
//     $.post(BASE_URL + 'getAllRestaurantData.fetch.php', {english_name: englishName}).then(res => {
//         if (res.statusCode === 200) {
//             actions.setTables(res.data.allTableList)
//         }
//         callbackFunction(res)
//     })
// }


export const changeFoodStatus = (foodId, foodStatus, callbackFunction) => {
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL + 'changeFoodInfo', {token, foodId, status: foodStatus
    }).then(res => {
        callbackFunction(res)
    })
}

export const changeFoodPrice = (foodId, foodPrice, callbackFunction) => {
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL + 'changeFoodInfo', {token, foodId, price: foodPrice}).then(res => {
        callbackFunction(res)
    })
}
export const newFood = (foodName, foodGroup, details, price, deliveryTime, callbackFunction) => {
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL + 'createFood', {token, persianName: foodName, group: foodGroup, details: details, price, deliveryTime,
    }).then(res => {
        callbackFunction(res)
    })

}
export const changeFoodDiscount = (foodId, foodDiscount, callbackFunction) => {
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL + 'changeFoodInfo', {token, foodId, discount: foodDiscount}).then(res => {
        callbackFunction(res)
    })
}


export const changeFoodName = (foodId, foodName, callbackFunction) => {
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL + 'changeFoodInfo', {token, foodId, persianName: foodName}).then(res => {
        callbackFunction(res)
    })
}


export const changeFoodDetails = (foodId, foodDetails, callbackFunction) => {
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL + 'changeFoodInfo', {token, foodId, details: foodDetails}).then(res => {
        callbackFunction(res)
    })
}


export const getCategoryList = (callbackFunction) => {
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL + 'getCategoryList', {token}).then(res => {
        callbackFunction(res)
    })
}


export const changeFoodDeliveryTime = (foodId, foodDeliveryTime, callbackFunction) => {
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL + 'changeFoodInfo', {token, foodId, deliveryTime: foodDeliveryTime}).then(res => {
        callbackFunction(res)
    })
}


export const changeFoodGroup = (foodId, newGroup, callbackFunction) => {
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL + 'changeFoodInfo', {token, foodId, group: newGroup}).then(res => {
        callbackFunction(res)
    })
}


export const changeOrderStatus = (trackingId, newOrderStatus, deleteReason, callbackFunction) => {
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL + 'changeOrderStatus', {token, trackingId, status:newOrderStatus, deleteReason}).then(res => {
        callbackFunction(res)
    })
}

export const getFoods = (callbackFunction) => {
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL + 'getFoodList', {token}).then(res => {
        callbackFunction(res)
    })
}


export const changeRestaurantName = (persianName, callbackFunction) => {
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL + 'changeResInfo', {token, persianName}).then(res => {
        callbackFunction(res)
    })
}


export const changeRestaurantPhone = (phones, callbackFunction) => {
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL + 'changeResInfo', {token, phone: JSON.stringify(phones)}).then(res => {
        callbackFunction(res)
    })
}


export const changeRestaurantAddress = (addressText, callbackFunction) => {
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL + 'changeResInfo', {token, addressText}).then(res => {
        callbackFunction(res)
    })
}


export const getRestaurantInfo = (callbackFunction) => {
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL + 'getResInfo', {token}).then(res => {
        console.log(res);
        callbackFunction(res)
    })
}


export const changeRestaurantOpenHours = (openTime, callbackFunction) => {
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL + 'changeResInfo', {token, openTime: JSON.stringify(openTime)}).then(res => {
        callbackFunction(res)
    })
}
export const changeRestaurantCounterPhone = (counterPhone, callbackFunction) => {
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL + 'changeResInfo', {token, counterPhone}).then(res => {
        callbackFunction(res)
    })
}


export const changeRestaurantType = (type, callbackFunction) => {
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL + 'changeResInfo', {token, type: JSON.stringify(type)}).then(res => {
        callbackFunction(res)
    })
}

export const changeRestaurantStatus = (status, callbackFunction) => {
    let token = store.getState().reducerRestaurantUser.token;
    $.post(BASE_URL + 'changeResInfo', {token, status}).then(res => {
        callbackFunction(res)
    })
}


// export const createTable = (tableName, tableCapacity, tableStatus, callbackFunction) => {
//     let token = store.getState().reducerRestaurantUser.token;
//     let englishName = store.getState().reducerRestaurantUser.englishName;
//     $.post(BASE_URL + 'createTable.add.php', {token, englishName, tableName, tableCapacity, tableStatus}).then(res => {
//         callbackFunction(res)
//     })
// }


// export const editTable = (tableId, tableName = null, tableCapacity = null, tableStatus = null, callbackFunction) => {
//     let token = store.getState().reducerRestaurantUser.token;
//     let englishName = store.getState().reducerRestaurantUser.englishName;
//     $.post(BASE_URL + 'changeTable.modify.php', {
//         token,
//         tableId,
//         englishName,
//         tableName,
//         tableCapacity,
//         tableStatus
//     }).then(res => {
//         callbackFunction(res)
//     })
// }

export const uploadFoodThumbnailNew = (foodId, thumbnail, callbackFunction) => {
    let token = store.getState().reducerRestaurantUser.token;
    let fd = new FormData();
    fd.append('foodThumbnail', thumbnail)
    fd.append('token', token)
    fd.append('foodId', foodId)
    $.ajax({
        url: BASE_URL + "changeFoodInfo",
        type: "POST",
        data: fd,
        contentType: false,
        processData: false,
        success: function (res) {
            callbackFunction(200)
        }
    });
}



