import { Create, SimpleForm, TextInput, DateInput, SelectInput } from 'react-admin';

export const UserCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="email" />
      <SelectInput source="status" choices={[
        { id: 'active', name: 'Active' },
        { id: 'inactive', name: 'Inactive' },
      ]} />
      <DateInput source="createdAt" />
    </SimpleForm>
  </Create>
);