import React, {useEffect, useRef, useState} from 'react';
import './css/Tutorials.css'
import gsap from 'gsap'

import {SphereSpinner} from "react-spinners-kit";
import NavBar from "../navBar/navBar";
let _ = require('lodash')

const Tutorials = () => {

        let [tutorialGroups, stg] = useState([]);
        let [allTutorials, sat] = useState([]);
        let [tutorialsLoading, stl] = useState(true);

        let lottieInstances = useRef({});
        let watchedTutorials = useRef([])

        useEffect(() => {
            watchedTutorials.current = _.uniqBy(JSON.parse(window.sessionStorage.getItem('watchedTutorialsId')), function (e) {
                return e;
            });
            // getTutorials((res) => {
            //     sat(res.data['tutorials'])
            //     let groups = [];
            //
            //     res['data']['tutorials'].map(eachItem => {
            //         if (!groups.includes(eachItem.group)) {
            //             groups.push(eachItem.group)
            //
            //         }
            //     })
            //     stg(groups)
            //     stl(false)
            //
            //     let checkboxes = document.getElementsByClassName('button-lottie-check-holder')
            //     Object.keys(checkboxes).map(eachKey => {
            //         lottieInstances.current[eachKey] = lottie.loadAnimation({
            //             path: '/lottie/checkbox.json',
            //             container: checkboxes[eachKey].children[1].firstChild,
            //             renderer: 'svg',
            //             loop: false,
            //             prerender: false,
            //             autoplay: false,
            //             autoloadSegments: false,
            //         })
            //         lottieInstances.current[eachKey].addEventListener('data_ready', () => {
            //             lottieInstances.current[eachKey].playSegments([0, 5], true)
            //         })
            //     })
            // })
        }, [])

        let tutorialWatched = (id) => {
            // addTutorialToWatched(Tid,(res)=>{
            //     watchedTutorials.current = res['watchedTutorialsId']
            //     window.sessionStorage.setItem('watchedTutorialsId',JSON.stringify(res['watchedTutorialsId']))
            //
            // })
            let element = id.currentTarget
            Object.keys(lottieInstances.current).map(eachInstance => {
                if (lottieInstances.current[eachInstance].wrapper === element.firstChild) {
                    lottieInstances.current[eachInstance].playSegments([5, 25], true)
                    element.style.pointerEvents = 'none'
                }
            })
            setTimeout(() => {
                element.style.height = '0px'
                element.style.border = 'none'
            }, 500)
            nextTutorial(element.firstChild.id)
        }
        let nextTutorial = (id) => {
            let nextIdNumber = (parseInt(id.split('-')[2]) + 1);
            let nextTutorial = document.getElementById('lottie-checkbox-' + nextIdNumber)
            nextTutorial.parentElement.style.height = '50px'
            nextTutorial.parentElement.style.border = '#e3e3e3 solid 1px'
            nextTutorial.parentElement.style.pointerEvents = 'all'
            let lock = document.getElementById('lock-' + nextIdNumber)
            let button = document.getElementById('button-' + nextIdNumber)
            lock.style.opacity = '0'
            button.style.opacity = '1'
            button.style.pointerEvents = 'all'


        }
        // let unlockNextTutorial =

        let openThisTutorial = (element) => {
            if (element.classList.contains('tutorial-open')) {
                gsap.to(element.children[1], {
                    height: 0,
                    duration: 0.4,
                    ease: 'power4.out'
                })
            } else {
                gsap.to(element.children[1], {
                    height: 'auto',
                    duration: 0.4,
                    ease: 'power4.out'
                })
            }
            element.classList.toggle('tutorial-open')
        }


        return (
            <div style={{
                // background:'white',
                // padding: 10,
                // maxHeight: 'calc(100vh - 50px)',

            }} className={'w-100 hide-scroll-bar h-100 position-relative d-flex flex-column align-items-center'}
                 id={'container'}>
                <div className={'mb-5 w-100'}>
                    <NavBar/>

                </div>
                {/*<div className={'w-75 p-3 mb-3'} style={{*/}
                {/*    borderRadius: 5,*/}
                {/*    background: 'white'*/}
                {/*}}>*/}
                {/*<span*/}
                {/*    className={'w-100 text-center d-flex flex-row align-items-center justify-content-center IranSans mb-3 '}>شماره تلفن جهت یاد آوری آموزش</span>*/}
                {/*    <div className={'d-flex justify-content-around flex-column align-items-center'}>*/}
                {/*        <input type="text" id={'customerName'} className={'newCustomerInput w-75 mt-0'} dir={'rtl'}*/}
                {/*               placeholder={'شماره تلفن'}/>*/}
                {/*        <button style={{*/}
                {/*            height: 40,*/}
                {/*            paddingTop: 10*/}
                {/*        }} className={'btn mt-2 btn-outline-success IranSans '}>*/}
                {/*            ثبت شماره*/}
                {/*        </button>*/}
                {/*    </div>*/}
                {/*</div>*/}
                {
                    tutorialsLoading ?
                        <div className={'mt-3'}>
                            <SphereSpinner color={'#5660a9'} size={50}/>
                        </div> :
                        <div/>
                }

                {
                    tutorialGroups.map((eachTutorial) => {
                        return (
                            <div style={{
                                borderRadius: 5,
                                background: 'white'
                            }} id={'tutorial-0'} className={'each-tutorial-section mt-3 w-100 border shadow-sm'}

                            >
                                <div style={{
                                    cursor: 'pointer'
                                }}
                                     onClick={(e) => {
                                         openThisTutorial(e.currentTarget.parentElement)
                                     }}
                                     className={'each-tutorial-section-header d-flex flex-row-reverse justify-content-between align-items-center px-3 py-2'}>
                                    <div className={'d-flex flex-row-reverse align-items-center'}>
                                        <i style={{
                                            color: '#9d9d9d',
                                            fontSize: '2rem'
                                        }} className={'fa fa-lock'}/>
                                        <div className={'d-flex flex-row-reverse mr-4'}>
                                            <h5 className={'IranSans'} style={{
                                                paddingTop: 10
                                            }}> {eachTutorial}</h5>
                                            <div className={'d-flex pt-2 mr-5'}>
                                                {/*<span>دقیقه</span>*/}
                                                <span className={'mx-1'}>{eachTutorial.duration}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <i className={'fa fa-angle-down angle'}/>

                                </div>
                                <div style={{
                                    height: 0
                                }} className={'each-tutorial-body px-2 d-flex flex-column align-content-center'}>
                                    {
                                        allTutorials.map((eachSubTutorial, index) => {
                                            if (eachSubTutorial.group === eachTutorial) {
                                                return (
                                                    <div
                                                        className={'d-flex mx-auto flex-column justify-content-center align-content-center mt-1 mb-3'}>
                                                        <h5 className={'IranSans text-center'}>{eachSubTutorial.title}</h5>
                                                        <div style={{
                                                            height: 150,
                                                            width: 300,
                                                            position: 'relative'
                                                        }} className="h_iframe-aparat_embed_frame text-center">
                                                            {
                                                                (!watchedTutorials.current.includes(eachSubTutorial.id)) && !(index === watchedTutorials.current.length) ?
                                                                    <div id={'lock-' + index} style={{
                                                                        transition: '0.3s ease',
                                                                        background: 'rgba(0,0,0,0.7)',
                                                                        position: 'absolute'
                                                                    }} className={'w-100 h-100 '}>
                                                                        <svg style={{
                                                                            position: 'absolute',
                                                                            zIndex: 2,
                                                                            transform: 'translate(50%,50%)',
                                                                            right: '50%',
                                                                            bottom: '50%'
                                                                        }} xmlns="http://www.w3.org/2000/svg" height={50}
                                                                             width={50} viewBox="0 0 8 8">
                                                                            <path
                                                                                d="m1 0c-.554 0-1 .446-1 1v6c0 .554.446 1 1 1h6c.554 0 1-.446 1-1v-6c0-.554-.446-1-1-1h-6m3 1.125c.969 0 1.758.787 1.758 1.756v.715c.138.029.242.152.242.299v2.676c0 .168-.136.305-.305.305h-3.391c-.169 0-.305-.136-.305-.305v-2.676c0-.147.104-.27.242-.299v-.715c0-.969.789-1.756 1.758-1.756m0 .611c-.632 0-1.146.513-1.146 1.145v.709h2.293v-.709c0-.632-.515-1.145-1.146-1.145m0 2.793c-.237 0-.43.191-.43.428 0 .126.055.238.141.316l-.113.604c-.006.034.015.059.049.059h.715c.034 0 .055-.025.049-.059l-.115-.609c.082-.078.135-.188.135-.311 0-.237-.193-.428-.43-.428"
                                                                                fill="#e0e0e0"/>
                                                                        </svg>

                                                                    </div> :
                                                                    <div/>


                                                            }

                                                            <iframe
                                                                src={"https://www.aparat.com/video/video/embed/videohash/" + eachSubTutorial.link.split('/')[eachSubTutorial.link.split('/').length - 1] + "/vt/frame"}
                                                                title="کلیات پوست (١)" allowFullScreen="true">

                                                            </iframe>
                                                        </div>
                                                        <div className={'button-lottie-check-holder'}>
                                                            <form className={'text-center mt-2'}
                                                                  action={eachSubTutorial.link}>
                                                                <button style={{
                                                                    transition: '0.3s ease',
                                                                    opacity: index > watchedTutorials.current.length ? 0 : 1,
                                                                    pointerEvents: index > watchedTutorials.current.length ? 'none' : 'all',
                                                                    overflow: 'hidden'
                                                                }} id={'button-' + index} type={'submit'}
                                                                        className={'btn btn-info IranSans pt-2'}>مشاهده در
                                                                    آپارات
                                                                </button>
                                                            </form>
                                                            <div style={{
                                                                pointerEvents: watchedTutorials.current.includes(eachSubTutorial.id) || index > watchedTutorials.current.length ? 'none' : 'all',
                                                                cursor: 'pointer',
                                                                width: 150,
                                                                borderRadius: 5,
                                                                border: watchedTutorials.current.includes(eachSubTutorial.id) || index > watchedTutorials.current.length ? 'none' : '#e3e3e3 solid 1px',
                                                                height: watchedTutorials.current.includes(eachSubTutorial.id) || index > watchedTutorials.current.length ? 0 : 50,
                                                                transition: '0.3s ease'
                                                            }}
                                                                 onClick={(e)=>{
                                                                     tutorialWatched(e,eachSubTutorial.id)
                                                                 }}
                                                                 className={' mx-auto mt-3 d-flex flex-row align-items-center  checkbox-holder justify-content-center'}>
                                                                <div id={'lottie-checkbox-' + index}
                                                                     style={{width: 50, height: 50}}
                                                                />
                                                                <span className={'IranSans pt-2 '}>دیده شد</span>
                                                            </div>
                                                        </div>


                                                    </div>

                                                )
                                            }

                                        })
                                    }


                                    {/*})}*/}

                                </div>
                            </div>

                        )
                    })
                }


            </div>
        );
    }
;

export default Tutorials;