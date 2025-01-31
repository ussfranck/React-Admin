import { Edit, SimpleForm, TextInput, ReferenceInput, SelectInput, DateInput } from 'react-admin';

export const PostEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="title" />
      <ReferenceInput source="authorId" reference="users">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <DateInput source="publishedDate" />
      <SelectInput source="status" choices={[
        { id: 'published', name: 'Published' },
        { id: 'draft', name: 'Draft' },
      ]} />
    </SimpleForm>
  </Edit>
);