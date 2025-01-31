import { Show, SimpleShowLayout, TextField, ReferenceField, DateField } from 'react-admin';

export const PostShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="title" />
      <ReferenceField label="Author" source="authorId" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <DateField source="publishedDate" />
      <TextField source="status" />
    </SimpleShowLayout>
  </Show>
);