import { useMutation, useQueryClient } from "@tanstack/react-query";

function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (user) => {
            console.log(user)
            const {...userData } = user;

            const response = await fetch(`https://olegegoism.pythonanywhere.com/f_pers_young_spec/${user.f_pers_young_spec_id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            // Вернуть данные пользователя, если это необходимо
            return response.json();
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    });
}

export default useUpdateUser;
