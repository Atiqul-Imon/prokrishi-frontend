"use client";

import React, { useState, useEffect } from "react";
import { getResourceList, deleteResource } from "@/app/utils/api";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Skeleton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Badge,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  People as PeopleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  ShoppingCart as OrdersIcon,
  AttachMoney as RevenueIcon,
  Block as BlockIcon,
  CheckCircle as ActiveIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import Link from "next/link";

// Customer Status Badge Component
const CustomerStatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Chip
      label={status || 'Unknown'}
      size="small"
      color={getStatusColor(status)}
      variant="filled"
      sx={{ fontWeight: 600 }}
    />
  );
};

// Customer Avatar Component
const CustomerAvatar = ({ name, email }) => {
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
      {getInitials(name)}
    </Avatar>
  );
};

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();

  // DataGrid columns configuration
  const columns = [
    {
      field: 'avatar',
      headerName: 'Customer',
      width: 120,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <CustomerAvatar name={params.row.name} email={params.row.email} />
          <Box>
            <Typography variant="subtitle2" fontWeight={600} noWrap component="div">
              {params.row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap component="div">
              {params.row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 140,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <PhoneIcon fontSize="small" color="action" />
          <Typography variant="body2" component="div">
            {params.row.phone || 'N/A'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 150,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <LocationIcon fontSize="small" color="action" />
          <Typography variant="body2" noWrap component="div">
            {params.row.addresses?.[0]?.city || 'N/A'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'orders',
      headerName: 'Orders',
      width: 100,
      renderCell: (params) => (
        <Box textAlign="center">
          <Typography variant="subtitle2" fontWeight={600} color="primary.main" component="div">
            {params.row.orderCount || 0}
          </Typography>
          <Typography variant="caption" color="text.secondary" component="div">
            orders
          </Typography>
        </Box>
      ),
    },
    {
      field: 'totalSpent',
      headerName: 'Total Spent',
      width: 120,
      renderCell: (params) => (
        <Box textAlign="center">
          <Typography variant="subtitle2" fontWeight={600} color="success.main" component="div">
            ৳{params.row.totalSpent?.toFixed(2) || '0.00'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <CustomerStatusBadge status={params.row.status} />,
    },
    {
      field: 'lastOrder',
      headerName: 'Last Order',
      width: 140,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary" component="div">
          {params.row.lastOrderDate ? 
            new Date(params.row.lastOrderDate).toLocaleDateString() : 
            'Never'
          }
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={(event) => handleMenuOpen(event, params.row)}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>
      ),
      sortable: false,
    },
  ];

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getResourceList('user');
      setCustomers(data.data || []);
      setFilteredCustomers(data.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Customers fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCustomers();
    setRefreshing(false);
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = customers.filter(customer =>
      customer.name?.toLowerCase().includes(term) ||
      customer.email?.toLowerCase().includes(term) ||
      customer.phone?.toLowerCase().includes(term)
    );
    setFilteredCustomers(filtered);
  };

  const handleMenuOpen = (event, customer) => {
    setAnchorEl(event.currentTarget);
    setSelectedCustomer(customer);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCustomer(null);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCustomer) return;
    
    try {
      await deleteResource('user', selectedCustomer._id);
      await fetchCustomers();
      setDeleteDialogOpen(false);
      setSelectedCustomer(null);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    newThisMonth: customers.filter(c => {
      const created = new Date(c.createdAt);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length,
    totalRevenue: customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0),
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Customer Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage customer accounts and view customer data
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Tooltip title="Refresh customers">
            <IconButton 
              onClick={handleRefresh} 
              disabled={refreshing}
              sx={{ 
                bgcolor: 'background.paper',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <RefreshIcon sx={{ 
                transform: refreshing ? 'rotate(360deg)' : 'none',
                transition: 'transform 0.5s ease-in-out',
              }} />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="large"
            disabled
          >
            Add Customer
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={700} color="primary.main">
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Customers
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                  <PeopleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={700} color="success.main">
                    {stats.active}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Customers
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                  <ActiveIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={700} color="info.main">
                    {stats.newThisMonth}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    New This Month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light', color: 'info.main' }}>
                  <EmailIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={700} color="warning.main">
                    ৳{stats.totalRevenue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Revenue
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
                  <RevenueIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search customers by name, email, or phone..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  disabled
                >
                  Filters
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                  {filteredCustomers.length} of {customers.length} customers
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Customers DataGrid */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box p={3}>
              <Skeleton variant="rectangular" height={400} />
            </Box>
          ) : (
            <DataGrid
              rows={filteredCustomers}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              autoHeight
              getRowId={(row) => row._id}
              sx={{
                border: 'none',
                '& .MuiDataGrid-cell': {
                  borderBottom: `1px solid ${theme.palette.divider}`,
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: theme.palette.grey[50],
                  borderBottom: `2px solid ${theme.palette.divider}`,
                },
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem 
          component={Link} 
          href={`/admin/customers/${selectedCustomer?._id}`}
          onClick={handleMenuClose}
        >
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem 
          component={Link} 
          href={`/admin/customers/edit/${selectedCustomer?._id}`}
          onClick={handleMenuClose}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Customer</ListItemText>
        </MenuItem>
        <MenuItem 
          component={Link} 
          href={`/admin/orders?customer=${selectedCustomer?._id}`}
          onClick={handleMenuClose}
        >
          <ListItemIcon>
            <OrdersIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Orders</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Customer</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Customer</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedCustomer?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 