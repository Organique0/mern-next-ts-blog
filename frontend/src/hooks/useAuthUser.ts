import useSWR from "swr";
import * as UsersApi from "@/network/api/users";
import { UnauthorizedError } from "@/network/http-errors";

export default function useAuthUser() {
      const { data, isLoading, error, mutate } = useSWR("user", 
        async () => {
          try {
            return await UsersApi.getAuthenticatedUser();
          } catch (error) {
            if(error instanceof UnauthorizedError) {
              return null;
            } else {
              throw error;
            }
          }
        }
      );

      return {
        user: data,
        userLoading: isLoading,
        userLoadingError: error,
        mutateUser:mutate,
      }

}