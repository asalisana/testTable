import { useMutation, useQueryClient } from '@tanstack/react-query';

function useCreateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userData) => {
            const { f_pers_young_spec_id, ...userDataWithoutId} = userData;
            const response = await fetch('https://olegegoism.pythonanywhere.com/f_pers_young_spec/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userDataWithoutId),
            });

            if (!response.ok) {
                throw new Error('Failed to create user');
            }

            return response.json();
        },
        onMutate: (newUserInfo) => {
            // Проверяем, определен ли prevUsers и является ли он массивом
            queryClient.setQueryData(['users'], (prevUsers = []) => {
                if (!Array.isArray(prevUsers)) {
                    // Если prevUsers не является массивом, возвращаем пустой массив
                    return [];
                }
                // Расширяем prevUsers с новым пользователем
                return [...prevUsers, {
                    ...newUserInfo,
                }];
            });
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    });
}

export default useCreateUser;
