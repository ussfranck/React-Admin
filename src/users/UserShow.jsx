import { Show, SimpleShowLayout, TextField, DateField } from 'react-admin';

export const UserShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="name" />
      <TextField source="email" />
      <TextField source="status" />
      <DateField source="createdAt" />
    </SimpleShowLayout>
  </Show>
);