import { supabase } from "./supabase";

export const getFoo = async () => {
  const { data, error } = await supabase.from("foo").select("*");

  if (error) throw error;
  return data || [];
};
