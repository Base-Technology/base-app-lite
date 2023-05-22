import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
const Form = (props) => {
  const { onSubmit, children } = props;
  const [formData, setFormData] = useState({});
  const [err,setErr]=useState([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsFormSubmitted(true);
    if (onSubmit) {
      onSubmit(formData)
    }
  };

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleErr=(name)=>{
    console.log('错误name',name)
  }
  return (
    <View style={{ ...styles.form, ...props.style }}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            formData,
            handleInputChange,
            handleErr,
            isFormSubmitted,
            handleSubmit: handleSubmit
          });
        }
        return child;
      })}
      {/* <Button title="提交" onPress={handleSubmit} /> */}
    </View>
  );
};

const FormItem = ({ name, rule, formData, handleInputChange,handleErr, isFormSubmitted, handleSubmit, children }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleTextChange = (text) => {
    setValue(text);
    validateInput(text);
    handleInputChange(name, text);
    setError(validateInput(text));
  };

  const validateInput = (text) => {
    if (!isFormSubmitted) {
      return '';
    }
    if (rule && !rule.rule.test(text)) {
      name&&handleErr(name+'错了');
      return rule.message;
    }
    name&&handleErr(name+'对啦');
    return '';
  };

  useEffect(() => {
    setError(validateInput(value));
  }, [isFormSubmitted]);

  return (
    <View style={styles.formItem}>
      {React.Children.map(children, (child) => {
        if (child.props && child.props.type == "submit") {
          return React.cloneElement(child, {
            onPress: handleSubmit
          })
        }
        return React.cloneElement(child, {
          value,
          onChangeText: handleTextChange,
        })
      }

      )}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};
Form.Item = FormItem;
const styles = StyleSheet.create({
  form: {
    padding: 20,
  },
  formItem: {
    marginBottom: 10,
  },
  error: {
    color: 'red',
  },
});
export default Form;
