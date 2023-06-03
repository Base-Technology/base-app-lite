import 'react-native-get-random-values';
import '@ethersproject/shims';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ethers } from 'ethers';
import axios from 'axios';
import OpenIMSDKRN, { OpenIMEmitter } from 'open-im-sdk-rn';
import RNFS, { stat } from 'react-native-fs';
import { addMessage, queryLastMessage } from '../database/message';
import { queryProfileByID } from '../database/profile';

export default class IMTP {

    static instance;

    static getInstance() {
        if (!IMTP.instance) {
            IMTP.instance = new IMTP();
        }
        return IMTP.instance;
    }

    async init() {
        if (!this.initCompleted) {
            this.initCompleted = true;
            const privateKey = await AsyncStorage.getItem('private_key');
            const wallet = new ethers.Wallet(privateKey);
            this.address = wallet.address;
            const signature = await wallet.signMessage("hello");
            this.config = {
                apiServer: "http://119.45.212.83:10002",
                wsServer: "ws://119.45.212.83:10001",
                appServer: "http://119.45.212.83:8001",
                loginParams: {
                    signature: signature,
                    senderAddress: wallet.address,
                    network: 1
                }
            }
            try {
                await RNFS.mkdir(RNFS.DocumentDirectoryPath + '/tmp');
                const options = {
                    platform: 5,
                    api_addr: this.config.apiServer,
                    ws_addr: this.config.wsServer,
                    data_dir: RNFS.DocumentDirectoryPath + '/tmp',
                    log_level: 6,
                    object_storage: 'cos',
                };
                const data = await OpenIMSDKRN.initSDK(options, this.uuid());
                console.log(data);
                OpenIMEmitter.addListener('onRecvNewMessage', (v) => {
                    this.onRecvNewMessage(v);
                });
                await this.loadHistoryMessage();
            } catch (e) {
                this.initCompleted = false;
                console.log(e);
                throw e;
            }
        }
    }

    async login() {
        if (!this.initCompleted) {
            await this.init();
        }

        try {
            let status = await OpenIMSDKRN.getLoginStatus();
            console.log(`login status: ${status}`);
            if (status != 101) {
                const resLog = await axios.post(this.config.appServer + "/api/v1/login", this.config.loginParams);
                const token = resLog.data.token;
                const userID = resLog.data.userID;
                this.userID = userID;
                this.token = token;
                console.log(userID);
                await OpenIMSDKRN.login(userID, token, this.uuid());
                status = await OpenIMSDKRN.getLoginStatus();
                console.log(`login status: ${status}`);
                if (status != 101) {
                    throw new Error("login failed");
                }
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async sendMessage(message, callback) {
        try {
            await this.login();
            const textMessage = await OpenIMSDKRN.createTextMessage(message.content, this.uuid());
            const offlinePushInfo = {
                title: 'you have a new message',
                desc: '',
                ex: '',
                iOSPushSound: '',
                iOSBadgeCount: true
            }
            const sendMessage = await OpenIMSDKRN.sendMessage(
                textMessage,
                message.recvID,
                message.groupID,
                offlinePushInfo,
                this.uuid(),
            );
            const msg = JSON.parse(sendMessage);
            const dbMessage = {
                id: msg.clientMsgID,
                state: 0,
                timestamp: msg.createTime,
                is_send: 1,
                content: msg.content,
            };
            await addMessage(dbMessage, callback);
        } catch (e) {
            console.log(e);
        }
    }

    async loadHistoryMessage() {
        try {
            await this.login();
            const lastMessage = await queryLastMessage();
            const options = {
                groupID: '',
                startClientMsgID: lastMessage.id,
                count: 10,
                userID: `01_1_${this.address.toLowerCase()}`,
                conversationID: "",
            }
            const data = await OpenIMSDKRN.getHistoryMessageListReverse(options, this.uuid());
            const msgs = JSON.parse(data);
            for (let i = 0; i < msgs.length; i++) {
                const msg = msgs[i];
                await this.handleMessage(msg);
            }
        } catch (e) {
            console.log(e);
        }
    }

    async handleMessage(msg) {
        try {
            const message = {
                id: msg.clientMsgID,
                state: 0,
                timestamp: msg.createTime,
                group_id: msg.groupID,
                imtp_user_id: msg.sendID == `01_1_${this.address.toLowerCase()}` ? "" : msg.sendID,
                is_send: msg.sendID == `01_1_${this.address.toLowerCase()}` ? 1 : 0,
                content: msg.content,
            };
            await addMessage(message);
        } catch (e) {
            console.log(e);
        }
    }

    async onRecvNewMessage(v) {
        console.log(`rec new msg:::${v.data}`);
        try {
            const msg = JSON.parse(v.data);
            await this.handleMessage(msg);
        } catch (e) {
            console.log(e);
        }
    }

    uuid() {
        return (Math.random() * 36).toString(36).slice(2) + new Date().getTime().toString();
    }

}