import * as React from 'react';
import { List, Datagrid, TextField, TextInput, Pagination, ReferenceField, DateField, EditButton } from 'react-admin';
import { Filter } from 'react-admin';

const PostFilter = (props) => (
  <Filter {...props}>
    <TextInput 
      label="Search by name" 
      source="q" 
      alwaysOn 
    />
    {/* <SelectInput 
      label="Status" 
      source="status" 
      choices={[
        { id: 'published', name: 'Published' },
        { id: 'draft', name: 'Draft' },
      ]} 
    /> */}
  </Filter>
);

const PostPagination = props => <Pagination rowsPerPageOptions={[5]} {...props} />;

export const PostList = (props) => (
  <List
    {...props}
    filters={<PostFilter />}
    perPage={5} // tu peux changer ca mais change aussi sur le composant <PostPagination />
    pagination={<PostPagination />}
  >
    <Datagrid>
      <TextField source="title" />
      <ReferenceField label="Author" source="authorId" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <DateField source="publishedDate" />
      <TextField source="status" />
      <EditButton />
    </Datagrid>
  </List>
);