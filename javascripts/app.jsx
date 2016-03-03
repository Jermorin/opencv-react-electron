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
                    const topRectangle = rect.y + 'px';
                    const leftRectangle = rect.x + 'px';

                    const styleRectangle = {position: 'fixed', top: topRectangle, left: leftRectangle, 'xIndex': 1};
                    const styleLabel = {position: 'relative', color:'#E65243'};
                    return <div key={i} style={styleRectangle}>
                        <div style={styleLabel}><b>People {i+1}</b></div>
                        <Rectangle width={rect.width}
                                   height={rect.height}
                                   fill={{color: "#2409ba", alpha: 4}}
                                   stroke={{color:'#E65243'}}
                                   strokeWidth={3}/>
                    </div>;
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
        const style = {position: 'static', top: 0, left: 0, 'minWidth': '100%'};
        this.getFaces.bind(this)();
        return (
            <div>
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