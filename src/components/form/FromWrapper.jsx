'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

export default function FormWrapper({
  schema,
  defaultValues,
  onSubmit,
  children,
  ...props
}) {
  const { formRef } = props;
  const formConfig = {};

  if (!!defaultValues) {
    formConfig['defaultValues'] = defaultValues;
  }

  if (schema) {
    formConfig['resolver'] = zodResolver(schema);
  }

  const methods = useForm({
    ...formConfig,
    // defaultValues,
  });

  useEffect(() => {
    if (formRef) {
      formRef.current = methods; // 👈 expose all methods including reset
    }
  }, [formRef, methods]);

  useEffect(() => {
    if (defaultValues) {
      methods.reset(defaultValues);
    }
  }, [defaultValues, methods]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        {children}
      </form>
    </FormProvider>
  );
}
