import { Edit, SimpleForm, TextInput, DateInput, SelectInput } from 'react-admin';

export const UserEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="name" />
      <TextInput source="email" />
      <SelectInput source="status" choices={[
        { id: 'active', name: 'Active' },
        { id: 'inactive', name: 'Inactive' },
      ]} />
      <DateInput source="createdAt" />
    </SimpleForm>
  </Edit>
);