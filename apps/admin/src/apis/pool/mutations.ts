import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { IPayloadCreatePool, IPoolItem, IResCreatePool } from "./types";
import { createPool, deletePool, updatePool } from "./requests";

export const useCreatePool = (options?: UseMutationOptions<IResCreatePool, AxiosError, IPayloadCreatePool>) => {
  return useMutation({ mutationFn: createPool, ...options });
};

export const useDeletePool = (options?: UseMutationOptions<IPoolItem, AxiosError, number>) => {
  return useMutation({ mutationFn: deletePool, ...options });
};

export const useUpdatePool = (options?: UseMutationOptions<IResCreatePool, AxiosError, { poolId: number, payload: IPayloadCreatePool }>) => {
  return useMutation({ mutationFn: updatePool, ...options });
};