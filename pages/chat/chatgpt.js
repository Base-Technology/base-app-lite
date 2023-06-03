import React, {  useRef } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  View,
  TextInput,
  Image,
  Dimensions,
  Button,
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

import { queryMessage } from '../../database/message';
import moment from 'moment';
import IMTP from '../../imtp/service';
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
            backgroundColor: msg.is_send == 0 ? 'rgba(255,255,255,0.1)' : '#422DDD',
            marginLeft: props.route.params.type != 2 ? 20 : 0,
            borderRadius: msg.content.length > 70 ? 10 : 100,
            borderBottomLeftRadius: msg.is_send == 0 ? 0 : undefined,
            borderBottomRightRadius: msg.is_send == 0 ? undefined : 0,
          }}>
            <Text style={{ color: '#000', fontSize: 14 }}>{msg.content}</Text>
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
  const rtb = () => (
    <TouchableWithoutFeedback
      onPress={() => setVisible(true)}>
      <View>
        <RenderToggleButton />

      </View>
    </TouchableWithoutFeedback>
  )
  return <View>
    <Popover
      anchor={rtb}
      visible={visible}
      placement="top"
      onBackdropPress={() => setVisible(false)}
      style={{ backgroundColor: '#1e1e1e', width: 250, borderWidth: 0 }}
    >
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 5, padding: 5 }}>
          <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
            <ReplyIcon width={25} height={25} fill="#000" />
            <Text>Reply</Text>
          </View>
          <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
            <EditIcon width={25} height={25} fill="#000" />
            <Text>Edit</Text>
          </View>
          <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
            <CopyIcon width={25} height={25} fill="#000" />
            <Text>Copy</Text>
          </View>
          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <ForwardIcon width={25} height={25} fill="#000" />
            <Text>Forward</Text>
          </View>
          <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
            <DeleteIcon width={25} height={25} fill="#000" />
            <Text>Delete</Text>
          </View>
          <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
            <SelectIcon width={25} height={25} fill="#000" />
            <Text>Select</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
          <View style={{ marginLeft: 10, width: 0, height: 0, borderColor: 'rgba(0,0,0,0)', borderWidth: 10, borderLeftColor: 'rgba(0,0,0,0)', borderRightColor: 'rgba(0,0,0,0)', borderBottomColor: 'rgba(0,0,0,0)', borderTopColor: 'rgba(255,255,255,0.1)' }}></View>
        </View>
      </View>


    </Popover>

  </View>
}
const ItemMessage = React.memo(MessageItem);
function MessageList(props) {
  const [value, onChangeText] = React.useState('');

  const [messages, changeMessages] = React.useState(undefined);
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
    queryMessage((msgs) => {
      changeMessages(msgs);
    });
  }


  return <View style={{ flex: 1 }}>
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ padding: 10 }}
        ref={scrollViewRef}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleContentSizeChange}
      >
        {messages && messages.map((msg, index) => {
          return (<ItemMessage msg={msg} index={index} key={index} {...props} />)
        }
        )}
        <View style={{ height: 20 }}></View>
      </ScrollView>
    </View>

    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', borderTopColor: '#000', padding: 10 }}>
      <VoiceIcon width={30} height={30} fill="#000" />
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, padding: 10, borderRadius: 100, backgroundColor: 'rgba(0,0,0,0.1)', height: 40, marginLeft: 10, marginRight: 10 }}>
        <TextInput
          style={{ height: 40, borderColor: '#000', color: '#000', flex: 1 }}
          onChangeText={text => onChangeText(text)}
          value={value}
        />
        <SmileIcon style={{}} width={30} height={30} fill="#000" />

      </View>
      {
        value != "" && <Button
          title="发送"
          color="#422DDD"
          onPress={() => {
            IMTP.getInstance().sendMessage({
              profile_id: '0x2',
              content: value,
            }, (msg) => {
              messages.push(msg);
              changeMessages(messages);
              onChangeText('');
            });
          }}
        /> ||
        <MoreIcon width={30} height={30} fill="rgba(0,0,0,1)" />
      }

      {/*  */}

    </View>
  </View>
    ;
}
const Moments = (props) => {

  const _drawer = useRef(null);
  closeDrawer = () => {
    _drawer.current && _drawer.current.close()
  };
  openDrawer = () => {
    _drawer.current && _drawer.current.open()
  };
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
                  <Text style={{ color: '#000', fontSize: 8, }}>剩余 <Text style={{ fontSize: 8, }}>0 条</Text></Text>
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