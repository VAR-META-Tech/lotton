import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { IPayloadCreatePool, IResCreatePool } from "./types";
import { createPool, deletePool } from "./requests";

export const useCreatePool = (options?: UseMutationOptions<IResCreatePool, AxiosError, IPayloadCreatePool>) => {
  return useMutation({ mutationFn: createPool, ...options });
};

export const useDeletePool = (options?: UseMutationOptions<IResCreatePool, AxiosError, number>) => {
  return useMutation({ mutationFn: deletePool, ...options });
};