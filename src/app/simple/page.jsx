'use client';
import FormWrapper from '@/components/form/FromWrapper';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';

export default function Page() {
  return (
    <FormWrapper>
      <SimpleEditor />
    </FormWrapper>
  );
}
