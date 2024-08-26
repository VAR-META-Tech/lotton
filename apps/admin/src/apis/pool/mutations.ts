import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { IPayloadCreatePool, IResCreatePool } from "./types";
import { createPool } from "./requests";

export const useCreatePool = (options?: UseMutationOptions<IResCreatePool, AxiosError, IPayloadCreatePool>) => {
  return useMutation({ mutationFn: createPool, ...options });
};