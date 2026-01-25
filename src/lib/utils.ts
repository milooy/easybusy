import { cx } from "../../styled-system/css";

export function cn(...inputs: (string | boolean | undefined | null)[]) {
  return cx(...inputs);
}
