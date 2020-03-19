import React, { Component } from 'react';
import $ from 'jquery';

class SearchIndex extends Component {
    constructor(props) {
        super()
        this.state = {
            history: [],
            songs: [],
            singers: [],
            playlists: []
        }
        this.search = this.search.bind(this);//为什么要绑定this?
        this.addHistory = this.addHistory.bind(this);
        this.clearHistory = this.clearHistory.bind(this);
        this.clickHistory = this.clickHistory.bind(this);
    }
    componentDidMount() {

    }
    search(value) {
        //查询是否存在音乐
        $.getJSON("/Music/Song/SearchResult", { keywords: value }, function (data) {
            var length = 0;
            $.each(data, function (idx, obj) {


                length++;
            })
        })
        //查询是否存在歌手
        $.getJSON("/Music/Singer/SearchResult", { keywords: value }, function (data) {
            var length = 0;
            $.each(data, function (idx, obj) {


                length++;
            })
        })
        //查询是否存在歌单
        $.getJSON("/Music/Playlist/SearchResult", { keywords: value }, function (data) {
            var length = 0;
            $.each(data, function (idx, obj) {


                length++;
            })
        })
        $("#search-section").hide();
        $("#search-box").animate({ top: '66', width: '520px', height: '50px' });
        $("#search-result-box").slideDown(500);


    }
    addHistory() {
        var keywords = $("#search-input").val();
        if (keywords != "") {
            this.search(keywords)
            $.ajax("/Home/AddHistory", {
                data: { value: keywords }
            })
        }
    }
    clickHistory(value) {
        this.search(value);
    }
    clearHistory() {
        $.ajax("/Home/Clear", {
            success: function () {
                $("#searc-history ul").slideUp(300);
            }
        })
    }
    render() {
        return (

            <div id="search-container" className="container">
                <div id="search-box">
                    <input type="text" placeholder="输入歌手名、歌单名或歌曲名" id="search-input" />
                    <button id="search-btn" onClick={this.addHistory}>搜索</button>
                </div>
                <div id="search-section">
                    <div id="searc-history">
                        <h4>历史搜索</h4><button onClick={this.clickHistory}>清除</button>
                        <ul>
                            {this.state.history.map(item => <li><a onClick={() => this.clickHistory()}>item</a></li>)}
                        </ul>
                    </div>
                    <div id="search-pop-song">
                        <h4>热门歌曲</h4>
                    </div>
                </div>
                <div id="search-result-box">
                    <div id="search-result-songs">
                        <h4>歌曲</h4>
                        <ul>
                            <li><a>1</a></li>
                            <li><a>1</a></li>
                        </ul>
                    </div>
                    <div id="search-result-singers">
                        <h4>歌手</h4>
                        <ul>
                            <li><a>1</a></li>
                            <li><a>1</a></li>
                        </ul>
                    </div>
                    <div id="search-result-playlists">
                        <h4>歌单</h4>
                        <ul>
                            <li><a>1</a></li>
                            <li><a>1</a></li>
                        </ul>
                    </div>
                </div>
            </div>


        )

    }
}


export default SearchIndex;