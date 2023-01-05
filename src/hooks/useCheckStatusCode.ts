import { useRouter } from "next/router";

export const useCheckStatusCode = (statusCode?: number) => {
    const router = useRouter();

    if (statusCode === 404) {
        router.push("/404");
        return;
    }
}