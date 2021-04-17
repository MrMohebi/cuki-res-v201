function resSortFoodByOrderedTimes(foodList){
    return foodList.sort(function (a, b) {return parseInt(a.order_times) - parseInt(b.order_times)}).reverse()
}