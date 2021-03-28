import Cookies from "js-cookie";

const cookieNameToken = "cukiToken_101213228"


export const setCacheToken = (token) =>{
    Cookies.set(cookieNameToken, token)
}

export const getCacheToken = () =>{
    return Cookies.get(cookieNameToken)
}

export const removeCacheToken = () =>{
    Cookies.remove(cookieNameToken)
}