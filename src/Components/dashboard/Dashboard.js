import React from "react";
import {connect} from "react-redux";
import Foods from '../Foods/Foods'

class Dashboard extends React.Component{
    componentDidMount() {
        if(this.props.token.length < 20){
            this.props.history.push("/")
        }

    }

    render() {
        return (
            <React.Fragment>

                <div style={{height: "30px", width: "100%"}}/>
                {/*<Orders/>*/}
                <Foods history={this.props.history}/>
            </React.Fragment>
        )
    }
}


const mapStateToProps = (store) => {
    return {
        foodInfoTemp: store.reducerTempStates.foodInfoTemp,
        token: store.reducerRestaurantUser.token
    }
}

const mapDispatchToProps = () => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);