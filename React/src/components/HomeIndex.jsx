import React, { Component } from 'react';
import $ from 'jquery';

class HomeIndex extends Component {
    constructor(props) {
        super()
        this.state = {

        }
    }

    render() {
        return (
            <div>
                
                <div id="recommend">
                    <div id="rcmd-title"><em>歌单推荐</em></div>
                    <div id="rcmd-container">
                    </div>
                </div>
                <div id="hit-songs">
                </div>
                <div id="index-ranking">

                </div>
            </div>
        )

    }
}


export default HomeIndex;