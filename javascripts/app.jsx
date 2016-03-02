'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Webcam from 'react-webcam';
import socket from 'socket.io-client';
import {Rectangle} from 'react-shapes';

const serverUrl = 'http://localhost:3000';

const socketOptions = {
    transports: ['websocket'],
    'force new connection': true
};

const client = socket.connect(serverUrl, socketOptions);
export default class App extends Component {
    getFaces() {
        setInterval(()=> {
            const screenshot = this.refs.webcam.getScreenshot();
            this.client.emit('image', {base64: screenshot.toString()});
        }, 150);
    }

    addFaces(array) {
        var el = ReactDOM.findDOMNode(this);
        var container = el.querySelector('.faces');
        const faces = (
            <div>
                {array.map(function (rect, i) {
                    const top = rect.y + 'px';
                    const left = rect.x + 'px';
                    const style = {position: 'fixed', top: top, left: left, 'xIndex': 1};
                    return <div key={i} style={style}>
                        <Rectangle width={rect.width}
                                   height={rect.height}
                                   fill={{color: "#2409ba", alpha: 6}}
                                   stroke={{color:'#E65243'}}
                                   strokeWidth={3}/></div>;
                })}
             </div>);

        ReactDOM.render(faces, container);
    }

    componentDidMount() {
        client.on('connect', () => {
            this.client = client;
            this.client.on('faces', faces => {
                this.addFaces(faces);
            });
        });
    }

    render() {
        const style = {position: 'static', top: 0, left: 0, 'minWidth':'100%'};
        return (
            <div onClick={this.getFaces.bind(this)}>
                <div className="faces"></div>
                <div style={style}>
                    <Webcam screenshotFormat='image/jpeg'
                            ref='webcam'
                            audio={false}/>
                </div>
            </div>
        )
    }
}