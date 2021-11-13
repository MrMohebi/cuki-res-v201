import React from 'react';
import '@fortawesome/fontawesome-free/css/all.css'
const FoodGallery = () => {

    let [images] = React.useState([
        "https://img.traveltriangle.com/blog/wp-content/uploads/2018/12/cover-for-street-food-in-sydney.jpg",
        "https://www.quorn.co.uk/assets/images/content/company/intro_3-2_768x512.jpg",
    ])

    return (
        <div className={'d-flex flex-column justify-content-center align-items-center'}>
            <p className={'mt-5'}>گالری تصاویر</p>
            <div style={{
                width: '100%',
                display: 'flex',
                flexFlow: 'wrap',
                justifyContent: 'center'
            }}>
                {images.map(eachImage=>{
                    return(
                        <div className={'eachImage'} style={{
                            backgroundImage:`url(${eachImage})`,
                            backgroundSize:'cover'
                        }}/>
                    )
                })}
                <div className={'emptyImage'} >
                    <i className="fas fa-plus"/>
                </div>
            </div>
        </div>

    );


};

export default FoodGallery;