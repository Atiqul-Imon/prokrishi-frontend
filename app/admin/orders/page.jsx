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
  ShoppingCart as OrdersIcon,
  AttachMoney as RevenueIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CompletedIcon,
  Pending as PendingIcon,
  Cancel as CancelledIcon,
  Person as CustomerIcon,
  CalendarToday as DateIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import Link from "next/link";

// Order Status Badge Component
const OrderStatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CompletedIcon fontSize="small" />;
      case 'pending':
        return <PendingIcon fontSize="small" />;
      case 'cancelled':
        return <CancelledIcon fontSize="small" />;
      case 'processing':
        return <ShippingIcon fontSize="small" />;
      case 'shipped':
        return <ShippingIcon fontSize="small" />;
      default:
        return <PendingIcon fontSize="small" />;
    }
  };

  return (
    <Chip
      icon={getStatusIcon(status)}
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
    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.75rem' }}>
      {getInitials(name)}
    </Avatar>
  );
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();

  // DataGrid columns configuration
  const columns = [
    {
      field: 'orderId',
      headerName: 'Order ID',
      width: 120,
      renderCell: (params) => (
        <Typography variant="subtitle2" fontWeight={600} color="primary.main" component="div">
          #{params.row._id?.substring(0, 8)}
        </Typography>
      ),
    },
    {
      field: 'customer',
      headerName: 'Customer',
      width: 180,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <CustomerAvatar name={params.row.user?.name} email={params.row.user?.email} />
          <Box>
            <Typography variant="subtitle2" fontWeight={600} noWrap component="div">
              {params.row.user?.name || 'Guest'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap component="div">
              {params.row.user?.email || 'No email'}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'items',
      headerName: 'Items',
      width: 100,
      renderCell: (params) => (
        <Box textAlign="center">
          <Typography variant="subtitle2" fontWeight={600} component="div">
            {params.row.items?.length || 0}
          </Typography>
          <Typography variant="caption" color="text.secondary" component="div">
            items
          </Typography>
        </Box>
      ),
    },
    {
      field: 'totalPrice',
      headerName: 'Total',
      width: 120,
      renderCell: (params) => (
        <Typography variant="subtitle2" fontWeight={600} color="success.main" component="div">
          ৳{params.row.totalPrice?.toFixed(2)}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      renderCell: (params) => <OrderStatusBadge status={params.row.status} />,
    },
    {
      field: 'paymentStatus',
      headerName: 'Payment',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.row.paymentStatus || 'Pending'}
          size="small"
          color={params.row.paymentStatus === 'paid' ? 'success' : 'warning'}
          variant="outlined"
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 140,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight={500} component="div">
            {new Date(params.row.createdAt).toLocaleDateString()}
          </Typography>
          <Typography variant="caption" color="text.secondary" component="div">
            {new Date(params.row.createdAt).toLocaleTimeString()}
          </Typography>
        </Box>
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

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getResourceList('order');
      setOrders(data.orders || []);
      setFilteredOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
      console.error('Orders fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = orders.filter(order =>
      order._id?.toLowerCase().includes(term) ||
      order.user?.name?.toLowerCase().includes(term) ||
      order.user?.email?.toLowerCase().includes(term) ||
      order.status?.toLowerCase().includes(term)
    );
    setFilteredOrders(filtered);
  };

  const handleMenuOpen = (event, order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedOrder) return;
    
    try {
      await deleteResource('order', selectedOrder._id);
      await fetchOrders();
      setDeleteDialogOpen(false);
      setSelectedOrder(null);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const stats = {
    total: orders.length,
    completed: orders.filter(o => o.status === 'completed').length,
    pending: orders.filter(o => o.status === 'pending').length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0),
    averageOrderValue: orders.length > 0 ? orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0) / orders.length : 0,
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Orders Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage customer orders and track order status
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Tooltip title="Refresh orders">
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
            Create Order
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
                    Total Orders
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                  <OrdersIcon />
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
                    {stats.completed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                  <CompletedIcon />
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
                    {stats.pending}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
                  <PendingIcon />
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
                    ৳{stats.totalRevenue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Revenue
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light', color: 'info.main' }}>
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
                placeholder="Search orders by ID, customer name, or status..."
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
                  {filteredOrders.length} of {orders.length} orders
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

      {/* Orders DataGrid */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box p={3}>
              <Skeleton variant="rectangular" height={400} />
            </Box>
          ) : (
            <DataGrid
              rows={filteredOrders}
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
          href={`/admin/orders/${selectedOrder?._id}`}
          onClick={handleMenuClose}
        >
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem 
          component={Link} 
          href={`/admin/orders/edit/${selectedOrder?._id}`}
          onClick={handleMenuClose}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Order</ListItemText>
        </MenuItem>
        <MenuItem 
          component={Link} 
          href={`/admin/customers/${selectedOrder?.user?._id}`}
          onClick={handleMenuClose}
        >
          <ListItemIcon>
            <CustomerIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Customer</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Order</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Order</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete order "#{selectedOrder?._id?.substring(0, 8)}"? This action cannot be undone.
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