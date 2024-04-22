import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const Form = ({ isOpen, onClose }) => {
    const [formFields, setFormFields] = useState([]);
    const [lineData, setLineData] = useState([]);
    const [lineDataValues, setLineDataValues] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchFormFields = async () => {
        try {
            const response = await fetch('https://olegegoism.pythonanywhere.com/nsi_pers_young_spec');
            if (!response.ok) {
                throw new Error('Failed to fetch form fields');
            }
            const data = await response.json();
            setFormFields(data);
        } catch (error) {
            console.error('Error fetching form fields:', error);
        }
    };

    const fetchLineData = async () => {
        try {
            const response = await fetch('https://olegegoism.pythonanywhere.com/f_pers_young_spec_line');
            if (!response.ok) {
                throw new Error('Failed to fetch line data');
            }
            const data = await response.json();
            setLineData(data);
            const values = {};
            data.forEach(line => {
                values[line.f_pers_young_spec_line_id] = {
                    target_count: line.target_count,
                    distribution_count: line.distribution_count
                };
            });
            setLineDataValues(values);
        } catch (error) {
            console.error('Error fetching line data:', error);
        }
    };

    useEffect(() => {
        fetchFormFields();
        fetchLineData();
    }, []);

    useEffect(() => {
        if (formFields.length > 0 && lineData.length > 0) {
            setIsLoading(false);
        }
    }, [formFields, lineData]);
    const initialValues = formFields.reduce((acc, field) => {
        acc[field.name] = '';
        return acc;
    }, {});

    const formik = useFormik({
        initialValues,
        onSubmit: async (values) => {
            try {
                const response = await fetch('https://olegegoism.pythonanywhere.com/f_pers_young_spec', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });
                if (!response.ok) {
                    throw new Error('Failed to submit form');
                }
                alert('Form submitted successfully!');
                onClose();
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        },
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle>Просмотр</DialogTitle>
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                <div style={{display: "flex", justifyContent: 'flex-end', gap: "2rem"}}>
                  <p>Общее кол-во</p>
                    <p>по Целевому</p>
                    <p>по Распределению</p>
                </div>
                    {formFields.map((field, index) => {
                        const values = lineDataValues[index+1] || { target_count: '', distribution_count: '' };
                        return (
                            <div style={{ display: 'flex', justifyContent: 'space-between'}} key={field.f_pers_young_spec_line_id}>
                                <label htmlFor={field.f_pers_young_spec_line_id}>{field.name}</label>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <input
                                        id={field.f_pers_young_spec_line_id}
                                        name={field.name}
                                        type={field.type || 'text'}
                                        onChange={formik.handleChange}
                                        value={`${values.target_count + values.distribution_count}`}

                                    />

                                    <input
                                        type="text"
                                        value={values.target_count}
                                        readOnly
                                    />
                                    <input
                                        type="text"
                                        value={values.distribution_count}
                                        readOnly
                                    />
                                </div>
                            </div>
                        );
                    })}
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Закрыть</Button>
            </DialogActions>
        </Dialog>
    );
};

export default Form;
