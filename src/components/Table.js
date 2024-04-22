import { useMemo, useState } from 'react';
import {
    MRT_EditActionButtons,
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import EditIcon from '@mui/icons-material/Edit';
import useCreateUser from "../hooks/useCreateUser";
import useGetUsers from "../hooks/useGetUsers";
import useUpdateUser from "../hooks/useUpdateUser";
import {validateUser} from "../utils/validation";
import Form from "../utils/Form";

const Table = () => {

    const [validationErrors, setValidationErrors] = useState({});
    const [isFormVisible, setIsFormVisible] = useState(false);

    const toggleFormVisibility = () => {
        setIsFormVisible((prevIsFormVisible) => !prevIsFormVisible);
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'f_pers_young_spec_id',
                header: 'id',
                enableEditing: false,
                size: 80,
                muiEditTextFieldProps: {
                    required: false,
                },
            },
            {
                accessorKey: 'insert_date',
                header: 'Дата и время добавления записи',
                enableEditing: true,
                size: 80,
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.rep_beg_period,
                    helperText: validationErrors?.rep_beg_period,
                    //remove any previous validation errors when user focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            rep_beg_period: undefined,
                        }),
                },
            },
            {
                accessorKey: 'insert_user',
                header: 'Имя пользователя',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.insert_user,
                    helperText: validationErrors?.insert_user,
                    //remove any previous validation errors when user focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            insert_user: undefined,
                        }),
                    //optionally add validation checking for onBlur or onChange
                },
            },
            {
                accessorKey: 'org_employee',
                header: 'ФИО и контактные данные сотрудника организации для связи',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.org_employee,
                    helperText: validationErrors?.org_employee,
                    //remove any previous validation errors when user focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            org_employee: undefined,
                        }),
                },
            },
            {
                accessorKey: 'rep_beg_period',
                header: 'Дата начала отчетного периода',
                enableEditing: true,
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.rep_beg_period,
                    helperText: validationErrors?.rep_beg_period,
                    //remove any previous validation errors when user focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            rep_beg_period: undefined,
                        }),
                },
            },
            {
                accessorKey: 'rep_end_period',
                header: 'Дата окончания отчетного периода',
                enableEditing: true,
                size: 80,
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.rep_beg_period,
                    helperText: validationErrors?.rep_beg_period,
                    //remove any previous validation errors when user focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            rep_beg_period: undefined,
                        }),
                },
            },
            {
                accessorKey: 'update_date',
                header: 'Укажите текущую дату',
                enableEditing: true,
                size: 80,
                muiEditTextFieldProps: {
                    required: false,
                    error: !!validationErrors?.rep_beg_period,
                    helperText: validationErrors?.rep_beg_period,
                    //remove any previous validation errors when user focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            rep_beg_period: undefined,
                        })
                    ,
                },
            },
            {
                accessorKey: 'update_user',
                header: 'Имя пользователя изменившего запись',
                enableEditing: true,
                size: 80,
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.update_user,
                    helperText: validationErrors?.update_user,
                    //remove any previous validation errors when user focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            update_user: undefined,
                        }),
                },
            },
        ],
        [validationErrors],
    );

    //call CREATE hook
    const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUser();
    //call READ hook
    const {
        data: fetchedUsers = [],
        isError: isLoadingUsersError,
        isFetching: isFetchingUsers,
        isLoading: isLoadingUsers,
    } = useGetUsers();

    //call UPDATE hook
    const { mutateAsync: updateUser, isPending: isUpdatingUser } =
        useUpdateUser();

    //CREATE action
    const handleCreateUser = async ({ values, table }) => {
        const newValidationErrors = validateUser(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        // Call createUser function returned by useCreateUser hook
        await createUser(values);
        table.setCreatingRow(null); // Exit creating mode
    };

    //UPDATE action
    const handleSaveUser = async ({ values, table }) => {
        const newValidationErrors = validateUser(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        await updateUser(values);
        table.setEditingRow(null); //exit editing mode
    };
// console.log(fetchedUsers)
    const table = useMaterialReactTable({
        columns,
        data: fetchedUsers,
        createDisplayMode: 'modal', //default ('row', and 'custom' are also available)
        editDisplayMode: 'modal', //default ('row', 'cell', 'table', and 'custom' are also available)
        initialState: { columnVisibility: { f_pers_young_spec_id: false } },
        enableEditing: true,
        getRowId: (row) => row.id,
        muiToolbarAlertBannerProps: isLoadingUsersError
            ? {
                color: 'error',
                children: 'Error loading data',
            }
            : undefined,
        muiTableContainerProps: {
            sx: {
                minHeight: '500px',
            },
        },
        onCreatingRowCancel: () => setValidationErrors({}),
        onCreatingRowSave: handleCreateUser,
        onEditingRowCancel: () => setValidationErrors({}),
        onEditingRowSave: handleSaveUser,
        //optionally customize modal content
        renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
            <>
                <DialogTitle variant="h3">Создать пользователя</DialogTitle>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    {/*<Form/>*/}
                    {internalEditComponents}
                </DialogContent>
                <DialogActions>
                    <MRT_EditActionButtons variant="Редактировать" table={table} row={row} />
                </DialogActions>
            </>
        ),
        muiCreateRowModalProps: ({ table, row, internalEditComponents }) => (
            <>
                <DialogTitle variant="h3">Посмотреть</DialogTitle>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    <Form/>
                </DialogContent>
                <DialogActions>
                    <MRT_EditActionButtons variant="Редактировать" table={table} row={row} />
                </DialogActions>
            </>
        ),
        //optionally customize modal content
        renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
            <>
                <DialogTitle variant="h3">Редактировать</DialogTitle>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                >
                    {internalEditComponents} {/* or render custom edit components here */}
                </DialogContent>
                <DialogActions>
                    <MRT_EditActionButtons variant="text" table={table} row={row} />
                </DialogActions>
            </>
        ),
        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
                <Tooltip title="Редактировать">
                    <IconButton onClick={() => table.setEditingRow(row)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        ),

        renderTopToolbarCustomActions: ({ table }) => (
            <>
                <Button
                    variant="contained"
                    onClick={() => {
                        table.setCreatingRow(true); //simplest way to open the create row modal with no default values
                        //or you can pass in a row object to set default values with the `createRow` helper function
                        // table.setCreatingRow(
                        //   createRow(table, {
                        //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
                        //   }),
                        // );
                    }}
                >
                    СОЗДАТЬ ПОЛЬЗОВАТЕЛЯ
                </Button>
                <Button variant="contained" onClick={toggleFormVisibility}>
                    ПОСМОТРЕТЬ
                </Button>
                <Form isOpen={isFormVisible} onClose={toggleFormVisibility} />
            </>


        ),
        state: {
            isLoading: isLoadingUsers,
            isSaving: isCreatingUser || isUpdatingUser,
            showAlertBanner: isLoadingUsersError,
            showProgressBars: isFetchingUsers,
        },
    });

    return <MaterialReactTable table={table} />;
};

const queryClient = new QueryClient();

const TableProviders = () => (
    //Put this with your other react-query providers near root of your app
    <QueryClientProvider client={queryClient}>
        <Table />
    </QueryClientProvider>
);

export default TableProviders;

