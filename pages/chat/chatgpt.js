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
import { queryMessage } from '../../database/message';
import moment from 'moment';
import IMTP from '../../imtp/service';
import { addMessage } from '../../database/message';
import uuid from 'react-native-uuid';
const dw = Dimensions.get('window').width;
const dh = Dimensions.get('window').height;
// Drawer组件
function MessageItem(props) {
  const { msg, index } = props;
  const [visible, setVisible] = React.useState(false);
  const RenderToggleButton = () => (
    <View key={index} style={{ display: 'flex', flexDirection: 'row', justifyContent: msg.is_send == 0 ? 'flex-start' : 'flex-end', marginBottom: 10 }}>
      {props.route.params.type != 2 && msg.is_send == 0 && (
        <View>
          <Image
            style={{ width: 40, height: 40, borderRadius: 100, }}
            source={Math.random() > 0.5 && require('../../assets/yk.jpg') || require('../../assets/mark.jpg')}
          />
        </View>) ||
        (props.route.params.type != 2 && <View style={{ width: 40, height: 40 }}>
        </View>)
      }
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: msg.is_send == 0 && 'flex-start' || 'flex-end' }}>
        <View>
          <View style={{
            padding: 10,
            backgroundColor: msg.is_send == 0 ? 'rgba(0,0,0,0.1)' : '#422DDD',
            marginLeft: props.route.params.type != 2 ? 20 : 0,
            borderRadius: msg.content.length > 70 ? 10 : 100,
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
  const [value, onChangeText] = React.useState('');

  const [messages, changeMessages] = React.useState([{
    content: "红烧肉怎么做", is_send: 1
  }, {
    content: "红烧肉怎么做\n\n一、材料准备：\n\n1、猪里脊肉500克；\n\n2、青椒、胡萝卜各一个；\n\n3、生姜、葱各适量；\n\n4、料酒、盐、酱油、淀粉、白糖、老抽各适量；\n\n二、烹饪步骤：\n\n1.将猪里脊肉切成大块，放入盆中，加入料酒、生姜、葱末、半匙盐、酱油、淀粉、白糖、老抽腌制10分钟。\n\n2.取一个炒锅，加入适量的油，烧至六成热，放入腌制好的猪肉，煎至两面金黄。\n\n3.把煎好的猪肉捞出，放入清水中洗净，放入锅中，加入料酒、酱油、白糖、老抽、淀粉、半杯水，烧开，改小火，盖上锅盖，煮30分钟，可以加入青椒、胡萝卜翻炒至熟，用少许淀粉勾芡，即可。", is_send: 0
  },
  {
    content: "你怎么看安史之乱", is_send: 1
  }, {
    content: "你怎么看安史之乱", is_send: 0
  },
  {
    content: "你怎么看安史之乱", is_send: 1
  }, {
    content: "你怎么看安史之乱", is_send: 0
  },
  {
    content: "你怎么看安史之乱", is_send: 1
  }, {
    content: "你怎么看安史之乱", is_send: 0
  },
  {
    content: "你怎么看安史之乱", is_send: 1
  }, {
    content: "你怎么看安史之乱", is_send: 0
  },
  {
    content: "你怎么看安史之乱", is_send: 1
  }, {
    content: "你怎么看安史之乱", is_send: 0
  },
  {
    content: "你怎么看安史之乱", is_send: 1
  }, {
    content: "你怎么看安史之乱", is_send: 0
  },
  {
    content: "你怎么看安史之乱", is_send: 1
  }, {
    content: "你怎么看安史之乱", is_send: 0
  },
  {
    content: "你怎么看安史之乱", is_send: 1
  }, {
    content: "你怎么看安史之乱", is_send: 0
  },
  {
    content: "你怎么看安史之乱", is_send: 1
  }, {
    content: "你怎么看安史之乱", is_send: 0
  },
  {
    content: "你怎么看安史之乱", is_send: 1
  }, {
    content: "你怎么看安史之乱", is_send: 0
  },
  {
    content: "你怎么看安史之乱", is_send: 1
  }, {
    content: "你怎么看安史之乱", is_send: 0
  }]);
  const scrollViewRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleContentSizeChange = (contentWidth, contentHeight) => {
    // const scrollViewHeight = scrollViewRef.current?.layoutMeasurement.height;
    // if (scrollViewHeight && contentHeight > scrollViewHeight) {
    scrollToBottom();
    // }
  };
  if (!messages) {
    queryMessage("chatgpt", undefined, (msgs) => {
      changeMessages(msgs);
    });
  }


  // /api/v1/chat/chatgpt
  const getChatGptMessage = () => {
    post('/api/v1/chat/chatgpt', {
      "prompt": value
    }).then(response => {
      console.log('response', response);
      messages.push(msg);
      changeMessages(messages);
      onChangeText('');
      // setLimit(response.total_token_left_count);
    })
  }
  const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
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
      changeMessages(messages);
      setRefreshing(false);
    });

    // wait(2000).then(() => {
    //   setRefreshing(false);

    // });

  }, [messages]);
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
          onChangeText={text => onChangeText(text)}
          value={value}
          placeholder='说点什么吧'
        />
        {/* <SmileIcon style={{}} width={30} height={30} fill="#000" /> */}

      </View>
      <Button
        title="发送"
        color="#422DDD"
        onPress={async () => {
          const requestID = uuid.v4();
          await addMessage({
            id: requestID,
            state: 0,
            timestamp: moment().valueOf(),
            group_id: "chatgpt",
            imtp_user_id: "",
            is_send: 1,
            content: value,
          }, (msg) => {
            messages.push(msg);
            changeMessages(messages);
            onChangeText('');
          });

          getChatGptMessage();
        }}
      />

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
  })
  // /api/v1/chat/chatgpt_limit
  const getChatGptLimit = () => {
    get('/api/v1/chat/chatgpt_limit').then(response => {
      console.log('response', response);
      setLimit(response.total_token_left_count);
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
                  <Text style={{ color: '#000', fontSize: 16 }}>{props.route.params.name} {props.route.params.type != 2 && 'Official Group'}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ color: '#000', fontSize: 8, }}>剩余 <Text style={{ fontSize: 8, }}>{limit} 条</Text></Text>
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