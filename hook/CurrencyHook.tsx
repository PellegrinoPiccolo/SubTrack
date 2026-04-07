import { useContext } from "react";
import { CurrencyContext } from "../context/CurrencyContext";

const useCurrency = () => {
  return useContext(CurrencyContext);
};

export default useCurrency;
