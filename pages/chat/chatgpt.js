import React, { useRef, useEffect, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  View,
  TextInput,
  Image,
  Dimensions,
  Button,
  RefreshControl,
  Clipboard,
  ToastAndroid
} from 'react-native';
import { BaseText as Text } from "../../components/Base";

import BackIcon from "../../assets/icon_arrow_back.svg";
import { Popover } from '@ui-kitten/components';


import MoreIcon from '../../assets/icon_more.svg';
import SmileIcon from '../../assets/icon_smile.svg';
import VoiceIcon from '../../assets/icon_voice.svg';
import DoneIcon from '../../assets/icon_doneall.svg';

import ReplyIcon from '../../assets/icon_reply.svg';
import EditIcon from '../../assets/icon_edit.svg';
import CopyIcon from '../../assets/icon_copy.svg';
import ForwardIcon from '../../assets/icon_forward.svg';
import DeleteIcon from '../../assets/icon_delete.svg';
import SelectIcon from '../../assets/icon_select.svg';
import { get, post } from '../../utils/request';
import moment from 'moment';
import { addMessage, queryMessage } from '../../database/chatgpt';
import uuid from 'react-native-uuid';
const dw = Dimensions.get('window').width;
const dh = Dimensions.get('window').height;
// Drawer组件
function MessageItem(props) {
  const { msg, index } = props;
  const [visible, setVisible] = React.useState(false);
  const RenderToggleButton = () => (
    <View key={index} style={{ display: 'flex', flexDirection: 'row', justifyContent: msg.is_send == 0 ? 'flex-start' : 'flex-end', marginBottom: 10 }}>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: msg.is_send == 0 && 'flex-start' || 'flex-end' }}>
        <View>
          <View style={{
            padding: 10,
            backgroundColor: msg.is_send == 0 ? 'rgba(0,0,0,0.1)' : '#422DDD',
            marginLeft: 0,
            borderRadius: msg.content?.length > 70 ? 10 : 100,
            borderBottomLeftRadius: msg.is_send == 0 ? 0 : undefined,
            borderBottomRightRadius: msg.is_send == 0 ? undefined : 0,
          }}>
            <Text style={{ color: msg.is_send == 0 && '#000' || '#fff', fontSize: 14 }}>{msg.content}</Text>
          </View>
          {msg.is_send == 0 && (<Text style={{ paddingHorizontal: 10, color: 'rgba(255,255,255,0.3)', fontSize: 12, textAlign: 'center', marginLeft: 20, }}>{moment.unix(msg.timestamp / 1000).format('HH:mm')}</Text>)}
          {msg.is_send == 1 && (
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Text style={{ paddingLeft: 10, color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{moment.unix(msg.timestamp / 1000).format('HH:mm')}</Text>
                <DoneIcon width={20} height={20} fill="rgba(255,255,255,0.3)" />
              </View>
            </View>)}
        </View>

      </View>
    </View>
  );
  return <TouchableWithoutFeedback
    onPress={() => { Clipboard.setString(msg.content); ToastAndroid.show("已复制!", ToastAndroid.SHORT) }}>
    <View>
      <RenderToggleButton />

    </View>
  </TouchableWithoutFeedback>
}
const ItemMessage = React.memo(MessageItem);
function MessageList(props) {
  // 发送的文字
  const [msgValue, setMsgValue] = useState();
  // 消息列表
  const [messages, setMessages] = useState();

  // 列表滚动使用
  const scrollViewRef = useRef(null);
  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };
  const handleContentSizeChange = (contentWidth, contentHeight) => {
    scrollToBottom();
  };
  // chatgpt问答 
  const getChatGptMessage = () => {
    // setMessages(data => [...data, { content: 123, is_send: 0 }]);
    // saveDB(123, 0); 红烧肉怎么做
    post('/api/v1/chat/chatgpt', {
      "prompt": msgValue
    }).then(response => {
      console.log('response',response);
      // 保存到数据库
      saveDB(response.code == 0 && response.response||response.message, 0);

    })
  }
  // 保存数据库
  const saveDB = async (content, is_send = 1) => {
    const requestID = uuid.v4();
    await addMessage({
      id: requestID,
      state: 0,
      timestamp: moment().valueOf(),
      group_id: "chatgpt",
      imtp_user_id: "",
      is_send: is_send,
      content: content,
    }, (msg) => {
      setMessages(data => [...data, msg]);
      setMsgValue('');
      props.route.params.handler();
    });
  }
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    let firstTimestamp = undefined;
    console.log(messages);
    if (messages.length > 0) {
      firstTimestamp = messages[0].timestamp;
    }
    queryMessage("chatgpt", firstTimestamp, (msgs) => {
      for (let i = msgs.length - 1; i >= 0; i--) {
        messages.unshift(msgs[i]);
      }
      setMessages(messages);
      setRefreshing(false);
    });
  }, [messages]);

  // 初始化
  useEffect(() => {
    queryMessage("chatgpt", undefined, (msgs) => {
      console.log('reschatgptponse', msgs);
      setMessages(msgs);
    });
  }, [])

  useEffect(() => console.log('msgValue', msgValue), [msgValue]);
  return <View style={{ flex: 1 }}>
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ padding: 10 }}
        ref={scrollViewRef}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleContentSizeChange}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#422ddd"]} />
        }
      >
        {messages && messages.map((msg, index) => {
          return (<ItemMessage msg={msg} index={index} key={index} {...props} />)
        }
        )}
        <View style={{ height: 20 }}></View>
      </ScrollView>
    </View>

    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', borderTopColor: '#000', padding: 10 }}>
      {/* <VoiceIcon width={30} height={30} fill="#000" /> */}
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, padding: 10, borderRadius: 100, backgroundColor: 'rgba(0,0,0,0.1)', height: 40, marginRight: 10 }}>
        <TextInput
          style={{ height: 40, borderColor: '#000', color: '#000', flex: 1 }}
          onChangeText={text => setMsgValue(text)}
          value={msgValue}
          placeholder='说点什么吧'
        />
        {/* <SmileIcon style={{}} width={30} height={30} fill="#000" /> */}

      </View>
      {
       msgValue&&<Button
        title={"发送"}
        color="#422DDD"
        onPress={async () => { await saveDB(msgValue); getChatGptMessage(); }}
      />
      }
      
    </View>
  </View>
    ;
}
const Moments = (props) => {
  const [limit, setLimit] = useState(0);

  const _drawer = useRef(null);
  closeDrawer = () => {
    _drawer.current && _drawer.current.close()
  };
  openDrawer = () => {
    _drawer.current && _drawer.current.open()
  };
  useEffect(() => {
    getChatGptLimit();
  }, [])
  // /api/v1/chat/chatgpt_limit
  const getChatGptLimit = () => {
    get('/api/v1/chat/chatgpt_limit').then(response => {
      console.log('response', response);
      setLimit(response);
    })
  }
  return (
    <>
      <View style={{ position: 'relative', backgroundColor: '#fff' }}>
        {/* <TouchableWithoutFeedback onPress={() => props.navigation.navigate(props.route.params.type != 2 && 'DetailGroup' || 'Personal', props.route.params)}> */}
        <View
          style={{
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
          }}
        >
          <View style={{ height: 60, padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
            <View>
              <TouchableWithoutFeedback
                onPress={() => props.navigation.goBack()}
              >
                <BackIcon width={25} height={25} fill="#000" />
              </TouchableWithoutFeedback>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                style={{ width: 40, height: 40, borderRadius: 100, }}
                source={{ uri: props.route.params.header }}
              />
              <View style={{ marginLeft: 5 }}>
                <View>
                  <Text style={{ color: '#000', fontSize: 16 }}>{props.route.params.name}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ color: '#000', fontSize: 8, }}>今日已用{limit.max_daily_call_count - limit.daily_left_call_count}次，</Text>
                  <Text style={{ color: '#000', fontSize: 8, }}>剩余{limit.daily_left_call_count}次 </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <MessageList {...props} key="s1" />
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,1)',
    padding: 20,
    flex: 1,
  },
});
export default Moments;