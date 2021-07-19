import { createContext } from "react";
import { FormatDatetime } from "./formatDatetimeApi";

const FormatDatetimeContext = createContext<FormatDatetime>({
  formatDatetime: () => '',
});

export default FormatDatetimeContext;
