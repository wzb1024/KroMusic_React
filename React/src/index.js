import React from 'react';

import ReactDOM from 'react-dom';
import App from '@/App';
import { Result, Button } from 'antd';
const page404 = <Result
    status="404"
    title="404"
    subTitle="抱歉，你访问的页面未找到:)"
    extra={<Button type="primary" href="/">返回首页</Button>} />
function start() {
    var html = document.getElementById('html_body');
    var error404 = document.getElementById('error404_page');
    if (html != null) {
        ReactDOM.render(<App />, html);
    }
    if (error404 != null) {
        ReactDOM.render(page404, error404);
    }
}
start()




