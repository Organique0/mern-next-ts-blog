import router, { useRouter } from "next/router";
import nProgress from "nprogress";
import { useEffect } from "react";

export default function useWarnUnsavedChanges(condition:boolean) {
    const router = useRouter();
        useEffect(() => {
        const routeChangeStartHandler = () => {
            if (condition && !window.confirm("You have unsaved changes. Do you want to leave the page?")) {
                nProgress.done();
                throw "route change aborted";
            }
        }

        router.events.on("routeChangeStart", routeChangeStartHandler);

        return () => {
            router.events.off("routeChangeStart", routeChangeStartHandler);
        }
    }, [condition, router.events]);
}