import React from 'react';
import {View, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import empty from '../../../assets/images/empty.gif';
import globalStyle from '../../../assets/styles/globalStyle';

// 导出一个默认的EmptyView函数
export default function EmptyView() {
  // 返回一个View组件，包含一个FastImage组件
  return (
    <View style={[styles.container, globalStyle.backgroundWhite]}>
      <FastImage source={empty} style={styles.gifStyle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  gifStyle: {height: 300, width: 300},
});
