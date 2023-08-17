import useSWR from "swr";
import * as UsersApi from "@/network/api/users";

export default function useAuthUser() {
      const { data, isLoading, error, mutate } = useSWR("user", UsersApi.getAuthenticatedUser);

      return {
        user: data,
        userLoading: isLoading,
        userLoadingError: error,
        mutateUser:mutate,
      }

}