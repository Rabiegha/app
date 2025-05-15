import React from "react";
import { TextInput, Text, View, ViewStyle, TextStyle } from "react-native";
import globalStyle from "../../assets/styles/globalStyle";
import colors from "../../assets/colors/colors";
import { CustomInputProps } from "./CustomInput.types";

/**
 * Custom input component with label and error handling
 */
const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  onChangeText,
  error,
  errorMessage,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  ...rest
}) => {
  return (
    <View style={containerStyle}>
      <Text style={[{ marginLeft: 10, color: colors.darkGrey }, labelStyle]}>{label}</Text>
      <TextInput
        style={[
          globalStyle.input,
          error && { backgroundColor: colors.lightRed, borderColor: colors.red },
          inputStyle
        ]}
        placeholderTextColor={error ? colors.red : colors.grey}
        value={value}
        onChangeText={onChangeText}
        {...rest}
      />
      {error && <Text style={[{ color: colors.red, fontSize: 10, marginTop: 5 }, errorStyle]}>{errorMessage}</Text>}
    </View>
  );
};

export default CustomInput;
