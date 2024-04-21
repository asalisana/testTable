import { useQuery } from "@tanstack/react-query";

function useGetUsers() {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await fetch(`https://olegegoism.pythonanywhere.com/f_pers_young_spec`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data)
            return data
        },
        refetchOnWindowFocus: false,
    });
}

export default useGetUsers;