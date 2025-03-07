import React from "react";
import { TextInput, Text, View } from "react-native";
import globalStyle from "../../assets/styles/globalStyle";
import colors from "../../assets/colors/colors";

const CustomInput = ({ label, value, onChangeText, error, errorMessage }) => {
  return (
    <View>
      <Text style={{ marginLeft: 10, color: colors.darkGrey }}>{label}</Text>
      <TextInput
        style={[
          globalStyle.input,
          error && { backgroundColor: colors.lightRed, borderColor: colors.red },
        ]}
        placeholderTextColor={error ? colors.red : colors.grey}
        value={value}
        onChangeText={onChangeText}
      />
      {error && <Text style={{ color: colors.red, fontSize: 10, marginTop: 5 }}>{errorMessage}</Text>}
    </View>
  );
};

export default CustomInput;
