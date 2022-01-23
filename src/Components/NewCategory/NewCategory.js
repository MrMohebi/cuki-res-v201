import React from 'react';
import {Backdrop, ButtonBase, TextField} from "@material-ui/core";
import './NewCategory.css'
import '../../fonts/fonts.css'
import * as request from '../../ApiRequests/requests'
import swal from 'sweetalert2'

const NewCategory = (props) => {

    let [inputsInput, setInputsInput] = React.useState(false);


    let inputChangeHandler = () => {
        let per, eng;
        per = document.getElementById('cat-per-name').value
        eng = document.getElementById('cat-eng-name').value
        if (per && eng) {
            setInputsInput(true)
        } else {
            setInputsInput(false)
        }
    }

    let swalFire = (title, success) => {
        swal.fire({
            title: title,
            icon: success ? 'success' : 'error',
            confirmButtonColor: '#3F51B5FF',
            confirmButtonText: 'باشه'
        })
    }

    let newCategoryHandler = () => {
        let per = document.getElementById('cat-per-name').value
        let eng = document.getElementById('cat-eng-name').value

        request.createNewCategory(per, eng, (res) => {
            if (res.statusCode === 200) {
                swalFire('دسته بندی ایجاد شد', true)
            } else {
                swalFire('خطا در ایجاد دسته بندی', false)
            }
            props.setNewCategoryVisible(false)
        })
    }
    return (<Backdrop
            style={{zIndex: 9999}}
            open={props.newCategoryVisible}
            onClick={(e) => {
                if (e.target.classList.contains('MuiBackdrop-root')) {
                    props.setNewCategoryVisible(false)
                }
            }}
        >

            <div
                style={{
                    width: 320
                }}
                className={'smallBox new-category  d-flex flex-column align-items-center justify-content-center IranSansMedium'}>
                <h6>دسته بندی جدید</h6>
                <TextField onChange={inputChangeHandler} className={'IranSansMedium new-category-input mt-4'}
                           style={{textAlign: 'right'}}
                           id="cat-per-name" label="نام" variant="standard"/>
                <TextField onChange={inputChangeHandler} className={'IranSansMedium new-category-input mt-4'}
                           style={{textAlign: 'right'}}
                           id="cat-eng-name" label="نام انگلیسی" variant="standard"/>
                <ButtonBase
                    onClick={newCategoryHandler}
                    disabled={!inputsInput}
                    style={{
                        width: '120px', height: 40, color: '#3f51b5', borderRadius: 5, border: 'solid 1px #3f51b5 ',

                    }}
                    className={'mt-4 pt-1'}
                >
                    افزودن
                </ButtonBase>

            </div>
        </Backdrop>


    );
};

export default NewCategory;