import React, { useState } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableHighlight, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { IndexPath } from '@ui-kitten/components';
import Explore from "../home/explore";
import SplashScreen from "react-native-splash-screen";
import GroupIcon from "../../assets/icon_group_small.svg";
import InviteIcon from '../../assets/icon_person_add.svg';
import { get, post } from '../../utils/request';
import Text from "../../components/BaseText";
import BasePopup from "../../components/BasePopup";
import { useQuery, gql } from '@apollo/client';
import { queryLastMessageByGroupID } from '../../database/message';
import { queryLastMessage } from '../../database/chatgpt';
import moment from 'moment';
import IMTP from '../../imtp/service';
import { queryFriendsLastMessage } from '../../database/message';

const GET_DATA = gql`
{
  profile(id: "1") {
    followingCount
  }
}
`;
const dw = Dimensions.get('window').width;
const dh = Dimensions.get('window').height;
const DATA = [

  // {
  //   id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba611',
  //   name: 'ChatGPT',
  //   type: 1,
  //   content: '...',
  //   route: 'ChatGpt',
  //   header: 'https://bf.jdd001.top/cryptologos/chatgpt.png'
  // },
  // {
  //   id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba6111',
  //   name: '鲸馆小张',
  //   type: 2,
  //   content: '...',
  //   header: 'https://bf.jdd001.top/cryptologos/zy.png'
  // }
];
const Item = ({ id, imtpUserId, name, content, timestamp, navigation, header, type, route, handler, onShowInfo }) => {

  return (
    <TouchableHighlight
      underlayColor="rgba(255, 255, 255, 1)"
      onPress={() => navigation.navigate(route || 'Doctor', { id, imtpUserId, name, header, type, handler })}
    >
      <View style={styles.item}>
        <View style={styles.itemc}>
          <View style={{ width: 50, height: 50, borderRadius: 40, backgroundColor: 'gray', marginRight: 10 }}>
            {header && <Image
              style={{ width: 50, height: 50, borderRadius: 100, }}
              source={{ uri: header }}
            /> ||
              <View style={{ width: 50, height: 50, borderRadius: 100, backgroundColor: '#422DDD' }}></View>}
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row' }}>
              {type == 2 && <GroupIcon width={20} height={20} fill="#000" />}
              <Text style={styles.title}>{name}</Text>
            </View>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.content}>{content}</Text>
          </View>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
          <Text style={styles.time}>{timestamp ? moment.unix(timestamp / 1000).format('HH:mm') : ''}</Text>
        </View>
      </View>
    </TouchableHighlight >
  );
}
const placements = [
  'top',
  'top start',
  'top end',
  'bottom',
  'bottom start',
  'bottom end',
  'left',
  'left start',
  'left end',
  'right',
  'right start',
  'right end',
];
const Chat = ({ navigation }) => {

  const { loading, error, data } = useQuery(GET_DATA);
  const renderItem = ({ item }) => (
    <Item onShowInfo={(head) => { setVisibleInfo(true); setCurrentInfo(head) }} key={item.id + 1} navigation={navigation} {...item} />
  );
  const [listGroup, setListGroup] = useState(DATA);
  const [visible, setVisible] = React.useState(false);
  const [visibleInfo, setVisibleInfo] = React.useState(false);
  const [currentInfo, setCurrentInfo] = React.useState()
  const [placementIndex, setPlacementIndex] = React.useState(new IndexPath(4));
  const placement = placements[placementIndex.row];

  const newMessageHandler = async (msg) => {
    getList();
  }

  React.useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();

    }, 200);
    getList();
    IMTP.getInstance().addListener({ id: 'list', handler: newMessageHandler });
    return () => {
      IMTP.getInstance().removeListener('list');
    }
  }, []);
  const MenuItemCustomFrist = ({ title, children }) => <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 3, paddingHorizontal: 10, paddingVertical: 5, justifyContent: 'center', }}>
      <View style={{ alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
        {children}
      </View>
      <Text style={{ fontSize: 14 }}>{title}</Text>
    </View>


  </View>
  const getList = async () => {
    const chatgptMsg = await queryLastMessage();
    let data = [{
      id: 'ChatGpt',
      name: 'ChatGPT',
      type: 1,
      content: chatgptMsg?.content,
      timestamp: chatgptMsg?.timestamp,
      route: 'ChatGpt',
      header: 'https://bf.jdd001.top/cryptologos/chatgpt.png',
      handler: getList,
    }];
    const groupMsg = await queryLastMessageByGroupID();
    const response = await get('/api/v1/group/user');
    if (response.code == 0 && response.data.length > 0) {
      data.push({
        id: response.data[0].id,
        name: response.data[0].school,
        type: 2,
        content: groupMsg?.content,
        timestamp: groupMsg?.timestamp,
      });
    }
    const friendMsgs = await queryFriendsLastMessage();
    friendMsgs.forEach((msg) => {
      data.push({
        id: msg.id,
        imtpUserId: msg.imtp_user_id,
        name: msg.username,
        type: 3,
        content: msg?.content,
        timestamp: msg?.timestamp,
        header: msg.avatar,
      });
    });
    setListGroup(data);
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ paddingHorizontal: 15, paddingVertical: 10, }}>
        <View style={{ position: 'relative' }}>
          <Text style={{ textAlign: 'center', fontSize: 18 }}>Base</Text>
        </View>
      </View>

      <FlatList
        data={listGroup}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

      <BasePopup
        visible={visibleInfo}
        onCancel={() => setVisibleInfo(false)}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'center', position: 'absolute', width: dw, top: -10 }}>
          <View style={{ width: 70, height: 3, backgroundColor: '#000', borderRadius: 10 }}>

          </View>
        </View>
        <View style={{ position: 'relative', overflow: 'hidden' }}>
          <View style={{ margin: 20, marginTop: 30, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: 50, height: 50, borderRadius: 40, marginRight: 10 }}>
                <Image
                  style={{ width: 50, height: 50, borderRadius: 100, }}
                  source={{ uri: currentInfo?.header }}
                />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={{ fontSize: 18 }}>{currentInfo?.name}</Text>

                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                  <View style={{ justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 5, paddingLeft: 5, paddingRight: 5 }}>
                    <Text style={{ textAlign: 'center' }}>
                      @dodo.base
                    </Text>
                  </View>
                  <View style={{ justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 5, marginLeft: 10, paddingLeft: 5, paddingRight: 5, padding: 0 }}>
                    <Text style={{ textAlign: 'center', padding: 0 }}>
                      0xebaD...89e1
                    </Text>
                  </View>
                </View>

              </View>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: 20, marginTop: 0 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ marginLeft: 5, marginRight: 15, fontSize: 16, color: '#000' }}>$999 <Text>Treasury</Text></Text>
              <Text style={{ marginLeft: 5, fontSize: 16, color: '#000' }}>34 <Text>Members</Text></Text>
            </View>

            <TouchableWithoutFeedback onPress={() => props.navigation.navigate('Invite')}>
              <View>
                <MenuItemCustomFrist title="Invite">
                  <InviteIcon width={25} height={25} fill="#000" style={{ marginRight: 5 }} />
                </MenuItemCustomFrist>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <Explore />
      </BasePopup>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemc: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1
  },
  title: {
    fontSize: 16,
    // color: '#000'
  },
  content: {
    flex: 1,
    // color: 'rgba(255,255,255,0.6)'
  },
  time: {
    // color: '#000',
    fontSize: 12
  }
});

export default Chat;