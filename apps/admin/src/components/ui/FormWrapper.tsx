import { CircleAlert } from 'lucide-react';
import React from 'react';
import type {
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form';
import { FormProvider } from 'react-hook-form';

interface Props<T extends FieldValues> {
  methods: UseFormReturn<T, any>;
  onSubmit: SubmitHandler<T>;
  children?: React.ReactNode;
  formId?: string;
  className?: string;
  required?: boolean;
}

const FormWrapper = <TFormValue extends FieldValues>({
  methods,
  onSubmit,
  children,
  formId = 'form-submit-wrapper',
  className,
  required = false,
}: Props<TFormValue>) => {
  return (
    <FormProvider {...methods}>
      <form
        className={className}
        id={formId}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        {required && (
          <div className="flex items-center gap-2">
            <CircleAlert />
            <p>
              Field <span className="text-error">*</span> are required
            </p>
          </div>
        )}

        {children}
      </form>
    </FormProvider>
  );
};

export default FormWrapper;
