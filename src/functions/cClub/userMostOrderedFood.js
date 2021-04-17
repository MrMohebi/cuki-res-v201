function userMostOrderedFood(userOrdersList){
    let foodsNumberLimit = 10

    let allOrderedFoodTimes = {}
    let draftUserHistoryOrders = [...userOrdersList]
    draftUserHistoryOrders.map(eachOrder=>{
        JSON.parse(eachOrder['order_list']).map(eachFood=>{
            if(allOrderedFoodTimes[eachFood.id]){
                allOrderedFoodTimes[eachFood.id].number += eachFood.number
            }else {
                allOrderedFoodTimes[eachFood.id] = {name:eachFood.name, number:eachFood.number}
            }
        })
    })

    let MoreOrdered = Object.keys(allOrderedFoodTimes).sort(function (a, b) {return allOrderedFoodTimes[a].number - allOrderedFoodTimes[b].number}).reverse()

    return MoreOrdered.map(eMO=>(allOrderedFoodTimes[eMO])).slice(0,foodsNumberLimit)
}