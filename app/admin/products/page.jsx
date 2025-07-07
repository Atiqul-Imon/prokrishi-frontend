"use client";

import React, { useState, useEffect } from "react";
import { getAllProducts, deleteProduct, toggleProductFeatured } from "@/app/utils/api";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Paper,
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
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Refresh as RefreshIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import Link from "next/link";

// Product Status Badge Component
const ProductStatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'draft':
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

// Product Image Component
const ProductImage = ({ image, name }) => {
  return (
    <Avatar
      src={image || '/testp.webp'}
      alt={name}
      sx={{ width: 40, height: 40 }}
      variant="rounded"
    >
      <InventoryIcon />
    </Avatar>
  );
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();

  // DataGrid columns configuration
  const columns = [
    {
      field: 'image',
      headerName: 'Image',
      width: 80,
      renderCell: (params) => (
        <ProductImage image={params.row.image} name={params.row.name} />
      ),
      sortable: false,
    },
    {
      field: 'name',
      headerName: 'Product Name',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="subtitle2" fontWeight={600} noWrap component="div">
            {params.row.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap component="div">
            SKU: {params.row.sku}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.row.category?.name || 'Uncategorized'}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      renderCell: (params) => (
        <Typography variant="subtitle2" fontWeight={600} color="primary.main" component="div">
          ৳{params.row.price?.toFixed(2)}
        </Typography>
      ),
    },
    {
      field: 'stock',
      headerName: 'Stock',
      width: 100,
      renderCell: (params) => {
        const stock = params.row.stock || 0;
        const isLowStock = stock <= (params.row.lowStockThreshold || 10);
        const isOutOfStock = stock === 0;
        
        return (
          <Box textAlign="center">
            <Typography 
              variant="subtitle2" 
              fontWeight={600}
              color={isOutOfStock ? 'error.main' : isLowStock ? 'warning.main' : 'success.main'}
              component="div"
            >
              {stock}
            </Typography>
            {isLowStock && (
              <Typography variant="caption" color="warning.main" component="div">
                Low Stock
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <ProductStatusBadge status={params.row.status} />,
    },
    {
      field: 'featured',
      headerName: 'Featured',
      width: 100,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={() => handleToggleFeatured(params.row)}
          color={params.row.featured ? 'warning' : 'default'}
        >
          {params.row.featured ? <StarIcon /> : <StarBorderIcon />}
        </IconButton>
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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllProducts();
      setProducts(data.products || []);
      setFilteredProducts(data.products || []);
    } catch (err) {
      setError(err.message);
      console.error('Products fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = products.filter(product =>
      product.name?.toLowerCase().includes(term) ||
      product.sku?.toLowerCase().includes(term) ||
      product.category?.name?.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  };

  const handleMenuOpen = (event, product) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProduct(null);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    
    try {
      await deleteProduct(selectedProduct._id);
      await fetchProducts();
      setDeleteDialogOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleFeatured = async (product) => {
    try {
      await toggleProductFeatured(product._id);
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    lowStock: products.filter(p => (p.stock || 0) <= (p.lowStockThreshold || 10)).length,
    featured: products.filter(p => p.featured).length,
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Products Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your product catalog and inventory
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Tooltip title="Refresh products">
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
            component={Link}
            href="/admin/products/add"
            variant="contained"
            startIcon={<AddIcon />}
            size="large"
          >
            Add Product
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
                    Total Products
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                  <InventoryIcon />
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
                    Active Products
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                  <TrendingUpIcon />
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
                    {stats.lowStock}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Low Stock Items
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
                  <TrendingDownIcon />
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
                  <Typography variant="h4" fontWeight={700} color="secondary.main">
                    {stats.featured}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Featured Products
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.main' }}>
                  <StarIcon />
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
                placeholder="Search products by name, SKU, or category..."
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
                  {filteredProducts.length} of {products.length} products
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

      {/* Products DataGrid */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box p={3}>
              <Skeleton variant="rectangular" height={400} />
            </Box>
          ) : (
            <DataGrid
              rows={filteredProducts}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              autoHeight
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
          href={`/admin/products/${selectedProduct?._id}`}
          onClick={handleMenuClose}
        >
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem 
          component={Link} 
          href={`/admin/products/edit/${selectedProduct?._id}`}
          onClick={handleMenuClose}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Product</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Product</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
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