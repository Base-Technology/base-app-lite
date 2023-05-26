import * as React from 'react';
import { Platform,Alert,Linking  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from './pages/chat/detail';
import RegisterScreen from './pages/login/register';
import LoginScreen from './pages/login';
import UserInfoScreen from './pages/login/userinfo';

import Personal from './pages/me/personal';
import Invite from './pages/chat/invite';

import Chat from './pages/chat/list';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import SplashScreen from "react-native-splash-screen";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import {
  isFirstTime,
  isRolledBack,
  checkUpdate,
  downloadUpdate,
  switchVersion,
  switchVersionLater,
  markSuccess,
  downloadAndInstallApk,
} from 'react-native-update';
import _updateConfig from './update.json';
const { appKey } = _updateConfig[Platform.OS];
const client = new ApolloClient({
  uri: 'http://147.182.251.92:10000/subgraphs/name/base/base-graph',
  cache: new InMemoryCache(),
});
const Stack = createNativeStackNavigator();

export default function App(logined, hasWallet) {

  return () => {
    React.useEffect(() => {
      if (isFirstTime) {
        // 必须调用此更新成功标记方法
        // 否则默认更新失败，下一次启动会自动回滚
        markSuccess();
        console.log('更新完成');
      } else if (isRolledBack) {
        console.log('刚刚更新失败了,版本被回滚.');
      }
      SplashScreen.hide();
      checkUpdates();
    }, []);
    doUpdate = async (info) => {
      try {
        const hash = await downloadUpdate(info, {
          onDownloadProgress: ({ received, total }) => {
            // this.setState({
            //   received,
            //   total,
            // });
          },
        });
        if (!hash) {
          return;
        }
        Alert.alert('提示', '下载完毕,是否重启应用?', [
          {
            text: '是',
            onPress: () => {
              switchVersion(hash);
            },
          },
          { text: '否' },
          {
            text: '下次启动时',
            onPress: () => {
              switchVersionLater(hash);
            },
          },
        ]);
      } catch (err) {
        Alert.alert('更新失败', err.message);
      }
    };
    checkUpdates = async () => {
      let info;
      try {
        info = await checkUpdate(appKey);
      } catch (err) {
        // Alert.alert('更新检查失败', err.message);
        return;
      }
      if (info.expired) {
        Alert.alert('提示', '您的应用版本已更新，点击确定下载安装新版本', [
          {
            text: '确定',
            onPress: () => {
              if (info.downloadUrl) {
                // apk可直接下载安装
                if (Platform.OS === 'android' && info.downloadUrl.endsWith('.apk')) {
                  downloadAndInstallApk({
                    url: info.downloadUrl,
                    onDownloadProgress: ({ received, total }) => {
                      // this.setState({
                      //   received,
                      //   total,
                      // });
                    },
                  });
                } else {
                  Linking.openURL(info.downloadUrl);
                }
              }
            },
          },
        ]);
      } else if (info.upToDate) {
        // Alert.alert('提示', '您的应用版本已是最新.');
      } else {
        Alert.alert('提示', '检查到新的版本' + info.name + ',是否下载?\n' + info.description, [
          {
            text: '是',
            onPress: () => {
              doUpdate(info);
            },
          },
          { text: '否' },
        ]);
      }
    };
    return (
      <ApolloProvider client={client}>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={{ ...eva.light }}>
          <NavigationContainer
          >
            <Stack.Navigator >
              {/* {!logined && (<Stack.Screen options={{ headerShown: false, animation: 'none' }} name="Login" component={LoginScreen} />)}
              {!logined && (<Stack.Screen options={{ headerShown: false, animation: 'none' }} name="LoginOther" component={LoginOtherScreen} />)}
              {!hasWallet && (<Stack.Screen options={{ headerShown: false, animation: 'none' }} name="WalletCreate" component={WalletCreate} />)} */}
              {/* <Stack.Screen options={{ headerShown: false, animation: 'none' }} name="Home" component={HomeScreen} /> */}
              <Stack.Screen options={{ headerShown: false, animation: 'none' }} name="Login" component={LoginScreen} />
             
              <Stack.Screen options={{ headerShown: false, animation: 'none' }} name="UserInfo" component={UserInfoScreen} />
              
              <Stack.Screen options={{ headerShown: false, animation: 'none' }} name="Register" component={RegisterScreen} />


              <Stack.Screen options={{ headerShown: false, animation: 'none' }} name="Chat" component={Chat} />
              <Stack.Screen options={{ headerShown: false, animation: 'none' }} name="Doctor" component={SettingsScreen} />
              <Stack.Screen options={{ headerShown: false, animation: 'none' }} name="Personal" component={Personal} />
              <Stack.Screen options={{ headerShown: false, animation: 'none' }} name="Invite" component={Invite} />
              {/* <Stack.Screen options={{ headerShown: false, animation: 'none' }} name="CreateGroup" component={CreateGroup} />
              <Stack.Screen options={{ headerShown: false, animation: 'none' }} name="CreateChat" component={CreateChat} />
              <Stack.Screen options={{ headerShown: false, animation: 'none' }} name="CreateToken" component={CreateToken} />
              <Stack.Screen options={{ headerShown: false, animation: 'none' }} name="CreateAirdrop" component={CreateAirdrop} />
              <Stack.Screen options={{ headerShown: false, animation: 'none' }} name="ImportOfAirdrop" component={ImportOfAirdrop} />
              <Stack.Screen options={{ headerShown: false, animation: 'none' }} name="Contact" component={Contact} />
              <Stack.Screen options={{ headerShown: false, animation: 'none' }} name="ContactSearch" component={ContactSearch} />

              <Stack.Screen options={{ headerShown: false, animation: 'none' }} name="DetailGroup" component={DetailGroupScreen} />
              <Stack.Screen options={{ headerShown: false, animation: 'none' }} name="Yk" component={SettingsScreen2} />
              <Stack.Screen name="Trade" component={TradeScreen} />
              <Stack.Screen name="Send" component={SendScreen} />
              <Stack.Screen options={{ headerShown: false, animation: 'none' }} name="Search" component={SearchScreen} />
              <Stack.Screen options={{ headerShown: false, animation: 'none' }} name="SearchDetail" component={SearchDetailScreen} />
              <Stack.Screen options={{ headerShown: false, animation: 'none' }} name="Details" component={DetailsScreen} />
              <Stack.Screen options={{ headerShown: false, animation: 'none' }} name="Details2" component={DetailsScreen2} />
              <Stack.Screen options={{ headerShown: false, animation: 'none' }} name="Publish" component={PublishScreen} />
              <Stack.Screen options={{ headerShown: false, animation: 'none' }} name="Me" component={WalletMain} />
              <Stack.Screen options={{ headerShown: false, animation: 'none' }} name="Moment" component={Moment} /> */}
            </Stack.Navigator>
          </NavigationContainer>
        </ApplicationProvider>
      </ApolloProvider>
    );
  }

}

// export default simpleUpdate(App, { appKey });
