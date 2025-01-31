import * as React from 'react';
import { List, Datagrid, TextField, DateField, EditButton } from 'react-admin';
import { useNotify, useRefresh, useDataProvider } from 'react-admin';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import PropTypes from 'prop-types'; 
const DeactivateUsersButton = ({ selectedIds }) => {
  const notify = useNotify();
  const refresh = useRefresh();
  const dataProvider = useDataProvider();
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleConfirm = () => {
    dataProvider.updateMany(
      'users',
      { ids: selectedIds, data: { status: 'inactive' } }
    )
    .then(() => {
      notify('Users deactivated successfully', { type: 'success' });
      refresh();
    })
    .catch(() => {
      notify('Error deactivating users', { type: 'error' });
    })
    .finally(() => {
      setOpen(false);
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleClick} color="secondary">
        Deactivate Users
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Deactivation</DialogTitle>
        <DialogContent>
          Are you sure you want to deactivate the selected users?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Validation des props
DeactivateUsersButton.propTypes = {
  selectedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const UserBulkActions = (props) => (
  <>
    <DeactivateUsersButton {...props} />
  </>
);

export const UserList = (props) => (
  <List {...props} bulkActionButtons={<UserBulkActions />}>
    <Datagrid>
      <TextField source="name" />
      <TextField source="email" />
      <TextField source="status" />
      <DateField source="createdAt" />
      <EditButton />
    </Datagrid>
  </List>
);