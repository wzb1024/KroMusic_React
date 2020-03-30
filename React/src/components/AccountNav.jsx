import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import $ from 'jquery';
import Signin from '@/Components/Signin'
import { Avatar } from 'antd';


export default class AccountNav extends Component {
    constructor() {
        super()
        this.state = {
            nikName: null,
            imgPath:null
        }
        this.signup = this.signup.bind(this);
        this.success = this.success.bind(this);
    }
    componentDidMount(){
        $.getJSON("User/Account/SigninState",function(result){
            if(result.SigninState)
            {
                this.success(result.NikName,result.Hdimg)
                this.props.signin(true);               
            }
        }.bind(this))
    }
    success(nikname,imgpath) {
        this.setState({
            nikName: nikname,
            imgPath: imgpath
        })
        this.props.signin(true);
    }
    signup() {
        $.ajax("User/Account/Signup", {
            type: "get",
            dataType: "html",
            success: function (result) {

                $("#sign_box").html(result);
            }
        })
    }
    render() {
        return (


            this.props.signinState ? (<div id="nav_img"><Link to="/account">
               <Avatar  size="large" src={this.state.imgPath} />
            </Link></div>) : (<>
                    <Signin login={this.success} show={this.props.show} modultState={this.props.modultState}/>
                    <a id="signup_link" onClick={this.signup}>
                    <em>注册</em>
                </a> </>)

        )

    }
}