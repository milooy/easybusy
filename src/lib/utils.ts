import { cx } from "../../styled-system/css";
import { type SystemStyleObject } from "../../styled-system/types";

export function cn(...inputs: (SystemStyleObject | string | undefined | null | false)[]) {
  return cx(...inputs);
}
