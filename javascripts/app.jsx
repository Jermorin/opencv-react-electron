'use strict';

import React, { Component, PropTypes } from 'react';
import Webcam from 'react-webcam';
import socket from 'socket.io-client';

const serverUrl = 'http://localhost:3000';

const socketOptions = {
    transports: ['websocket'],
    'force new connection': true
};

const client = socket.connect(serverUrl, socketOptions);
export default class App extends Component {
    getImage() {
        setInterval(()=> {
            const screenshot = this.refs.webcam.getScreenshot();
            this.client.emit('image', {base64: screenshot.toString()});
        },1);
    }

    render() {
        client.on('connect', () => {
            this.client = client;
            this.client.on('faces', faces => console.log(faces));
        });
        return (
            <div onClick={this.getImage.bind(this)}>
                <Webcam screenshotFormat='image/jpeg' ref='webcam' audio={false}/>
            </div>
        )
    }
}