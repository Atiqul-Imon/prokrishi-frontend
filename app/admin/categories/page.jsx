"use client";

import React, { useState, useEffect } from "react";
import { getResourceList, deleteCategory } from "@/app/utils/api";
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
  Category as CategoryIcon,
  Inventory as ProductsIcon,
  TrendingUp as TrendingUpIcon,
  Star as FeaturedIcon,
  CheckCircle as ActiveIcon,
  Block as InactiveIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import Link from "next/link";

// Category Status Badge Component
const CategoryStatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
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

// Category Avatar Component
const CategoryAvatar = ({ name, icon }) => {
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
      {icon || getInitials(name)}
    </Avatar>
  );
};

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();

  // DataGrid columns configuration
  const columns = [
    {
      field: 'avatar',
      headerName: 'Category',
      width: 150,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <CategoryAvatar name={params.row.name} icon={params.row.icon} />
          <Box>
            <Typography variant="subtitle2" fontWeight={600} noWrap component="div">
              {params.row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap component="div">
              {params.row.slug}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary" noWrap component="div">
          {params.row.description || 'No description'}
        </Typography>
      ),
    },
    {
      field: 'products',
      headerName: 'Products',
      width: 100,
      renderCell: (params) => (
        <Box textAlign="center">
          <Typography variant="subtitle2" fontWeight={600} color="primary.main" component="div">
            {params.row.productCount || 0}
          </Typography>
          <Typography variant="caption" color="text.secondary" component="div">
            products
          </Typography>
        </Box>
      ),
    },
    {
      field: 'featured',
      headerName: 'Featured',
      width: 100,
      renderCell: (params) => (
        <Chip
          icon={params.row.featured ? <FeaturedIcon /> : null}
          label={params.row.featured ? 'Featured' : 'Regular'}
          size="small"
          color={params.row.featured ? 'warning' : 'default'}
          variant={params.row.featured ? 'filled' : 'outlined'}
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <CategoryStatusBadge status={params.row.status} />,
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 140,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary" component="div">
          {new Date(params.row.createdAt).toLocaleDateString()}
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

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getResourceList('category');
      setCategories(data.categories || []);
      setFilteredCategories(data.categories || []);
    } catch (err) {
      setError(err.message);
      console.error('Categories fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCategories();
    setRefreshing(false);
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = categories.filter(category =>
      category.name?.toLowerCase().includes(term) ||
      category.description?.toLowerCase().includes(term) ||
      category.slug?.toLowerCase().includes(term)
    );
    setFilteredCategories(filtered);
  };

  const handleMenuOpen = (event, category) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCategory(null);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;
    
    try {
      await deleteCategory(selectedCategory._id);
      await fetchCategories();
      setDeleteDialogOpen(false);
      setSelectedCategory(null);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const stats = {
    total: categories.length,
    active: categories.filter(c => c.status === 'active').length,
    featured: categories.filter(c => c.featured).length,
    totalProducts: categories.reduce((sum, c) => sum + (c.productCount || 0), 0),
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Categories Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage product categories and organize your catalog
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Tooltip title="Refresh categories">
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
            href="/admin/categories/add"
            variant="contained"
            startIcon={<AddIcon />}
            size="large"
          >
            Add Category
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
                    Total Categories
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                  <CategoryIcon />
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
                    Active Categories
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
                  <Typography variant="h4" fontWeight={700} color="warning.main">
                    {stats.featured}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Featured Categories
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
                  <FeaturedIcon />
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
                    {stats.totalProducts}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Products
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light', color: 'info.main' }}>
                  <ProductsIcon />
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
                placeholder="Search categories by name, description, or slug..."
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
                  {filteredCategories.length} of {categories.length} categories
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

      {/* Categories DataGrid */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box p={3}>
              <Skeleton variant="rectangular" height={400} />
            </Box>
          ) : (
            <DataGrid
              rows={filteredCategories}
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
          href={`/admin/categories/${selectedCategory?._id}`}
          onClick={handleMenuClose}
        >
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem 
          component={Link} 
          href={`/admin/categories/edit/${selectedCategory?._id}`}
          onClick={handleMenuClose}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Category</ListItemText>
        </MenuItem>
        <MenuItem 
          component={Link} 
          href={`/admin/products?category=${selectedCategory?._id}`}
          onClick={handleMenuClose}
        >
          <ListItemIcon>
            <ProductsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Products</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Category</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedCategory?.name}"? This action cannot be undone.
          </Typography>
          {selectedCategory?.productCount > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This category has {selectedCategory.productCount} products. Deleting it may affect those products.
            </Alert>
          )}
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