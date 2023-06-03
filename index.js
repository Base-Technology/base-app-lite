/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import IMTP from './imtp/service';
import { get } from './utils/request';
import { createMessageTable } from './database/message';
import AsyncStorage from '@react-native-async-storage/async-storage';

// AppRegistry.registerComponent(appName, () => App);

AppRegistry.registerRunnable(appName, async initialProps => {
    try {
        let logined = false;
        const response = await get('/api/v1/info');
        if (response.code == "0") {
            logined = true;
        }
        if (logined) {
            const userID = await AsyncStorage.getItem('user_id');
            createMessageTable(userID);
            await IMTP.getInstance().init();
        }
        AppRegistry.registerComponent(appName, () => App(logined));
        AppRegistry.runApplication(appName, initialProps);
    } catch (err) {
        console.log(err);
    }
});