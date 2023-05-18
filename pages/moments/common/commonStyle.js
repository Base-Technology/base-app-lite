import {
  StyleSheet
} from 'react-native'
export const Row = StyleSheet.create({
  self:{
    width:'100%',
    flexDirection:'row',
    alignItems:'center',
  },
  flex:{
    flexDirection:'row',
    alignItems:'center',
  },
  between:{
    width:'100%',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  center:{
    width:'100%',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  top:{
    width:'100%',
    flexDirection:'row',
    alignItems:'flex-start',
  },
  bottom:{
    width:'100%',
    flexDirection:'row',
    alignItems:'flex-end',
  },
  end:{
    width:'100%',
    flexDirection:'row',
    justifyContent:'flex-end'
  }
})
export const Column = StyleSheet.create({
  self:{
    width:'100%',
    flexDirection:'column',
  },
  center:{
    width:'100%',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center'
  },
  right:{
    width:'100%',
    flexDirection:'column',
    alignItems:'flex-end',
  },
  bottom:{
    width:'100%',
    flexDirection:'column',
    justifyContent:'flex-end'
  },
  centerBottom:{
    width:'100%',
    flexDirection:'column',
    justifyContent:'flex-end',
    alignItems:'center'
  }
})