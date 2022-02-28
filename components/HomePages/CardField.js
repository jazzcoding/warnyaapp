import React from "react";
import { View } from "react-native";
const CardField = () => {
  const onClose = () => {
    // handle close (i.e. navigate back)
  };

  const onPaymentSuccess = (token) => {
    // handle saving token on backend
    // will automatically call 'onClose'
  };

  return null;
};

export default CardField;
