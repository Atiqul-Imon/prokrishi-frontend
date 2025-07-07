"use client";

import React, { useState, useEffect } from "react";
import { getDashboardStats, getSalesAnalytics, getInventoryAnalytics } from "@/app/utils/api";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Button,
  LinearProgress,
  Alert,
  Paper,
  Divider,
  useTheme,
  Skeleton,
  IconButton,
  Tooltip,
  Badge,
  Stack,
  CircularProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  Inventory as InventoryIcon,
  ShoppingCart as OrdersIcon,
  AttachMoney as RevenueIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
  Add as AddIcon,
  Assessment as AssessmentIcon,
  Category as CategoryIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  CalendarToday as CalendarIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import Link from "next/link";

// Enhanced Stat Card Component
const StatCard = ({ title, value, icon, color, href, trend, trendValue, loading, subtitle }) => {
  const theme = useTheme();
  
  const cardContent = (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'all 0.3s ease-in-out',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${color}, ${theme.palette.primary.light})`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box flex={1}>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
            {loading ? (
              <Skeleton variant="text" width="60%" height={40} />
            ) : (
              <Typography variant="h4" component="div" fontWeight={700} sx={{ color: color }}>
                {value}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: `${color}15`,
              color: color,
              border: `2px solid ${color}30`,
            }}
          >
            {icon}
          </Avatar>
        </Box>
        
        {trend && !loading && (
          <Box display="flex" alignItems="center" mt={2}>
            {trend === 'up' ? (
              <TrendingUpIcon sx={{ fontSize: 18, color: 'success.main', mr: 1 }} />
            ) : (
              <TrendingDownIcon sx={{ fontSize: 18, color: 'error.main', mr: 1 }} />
            )}
            <Typography 
              variant="body2" 
              color={trend === 'up' ? 'success.main' : 'error.main'}
              fontWeight={600}
              sx={{ fontSize: '0.875rem' }}
            >
              {trendValue}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

// Enhanced Recent Order Item Component
const RecentOrderItem = ({ order }) => {
  const theme = useTheme();
  
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircleIcon fontSize="small" />;
      case 'pending':
        return <PendingIcon fontSize="small" />;
      case 'cancelled':
        return <CancelIcon fontSize="small" />;
      default:
        return <ShippingIcon fontSize="small" />;
    }
  };
  
  return (
    <ListItem sx={{ px: 0, py: 1.5 }}>
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: theme.palette.primary.light, width: 40, height: 40 }}>
          <OrdersIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle2" fontWeight={600} component="div">
              {order.user?.name || "Guest"}
            </Typography>
            <Chip
              icon={getStatusIcon(order.status)}
              label={order.status || 'Processing'}
              size="small"
              color={getStatusColor(order.status)}
              variant="outlined"
            />
          </Box>
        }
        secondary={
          <Box display="flex" alignItems="center" justifyContent="space-between" mt={0.5}>
            <Typography variant="body2" color="text.secondary" component="div">
              #{order._id?.substring(0, 8)} • {new Date(order.createdAt).toLocaleDateString()}
            </Typography>
            <Typography variant="subtitle2" fontWeight={600} color="primary.main" component="div">
              ৳{order.totalPrice?.toFixed(2)}
            </Typography>
          </Box>
        }
      />
    </ListItem>
  );
};

// Enhanced Low Stock Item Component
const LowStockItem = ({ product }) => {
  const theme = useTheme();
  
  const getStockLevel = (stock, threshold = 10) => {
    if (stock <= 0) return { level: 'Out of Stock', color: 'error', severity: 'high' };
    if (stock <= threshold) return { level: 'Low Stock', color: 'warning', severity: 'medium' };
    return { level: 'In Stock', color: 'success', severity: 'low' };
  };

  const stockInfo = getStockLevel(product.stock);
  
  return (
    <ListItem sx={{ px: 0, py: 1.5 }}>
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: theme.palette[stockInfo.color].light, width: 40, height: 40 }}>
          <WarningIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="subtitle2" fontWeight={600} noWrap component="div">
            {product.name}
          </Typography>
        }
        secondary={
          <Typography variant="body2" color="text.secondary" noWrap component="div">
            {product.category?.name || 'Uncategorized'}
          </Typography>
        }
      />
      <Box textAlign="right">
        <Chip
          label={`${product.stock} left`}
          size="small"
          color={stockInfo.color}
          variant="filled"
          sx={{ fontWeight: 600 }}
        />
        <Typography variant="caption" color="text.secondary" display="block" mt={0.5} component="div">
          {stockInfo.level}
        </Typography>
      </Box>
    </ListItem>
  );
};

// Enhanced Quick Action Card Component
const QuickActionCard = ({ title, description, icon, color, href, badge }) => {
  const theme = useTheme();
  
  return (
    <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card
        sx={{
          height: '100%',
          transition: 'all 0.3s ease-in-out',
          cursor: 'pointer',
          position: 'relative',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4],
            '& .action-icon': {
              transform: 'scale(1.1)',
            },
          },
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar 
              sx={{ 
                bgcolor: color, 
                width: 56, 
                height: 56,
                transition: 'transform 0.3s ease-in-out',
              }}
              className="action-icon"
            >
              {icon}
            </Avatar>
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {title}
                </Typography>
                {badge && (
                  <Chip label={badge} size="small" color="primary" />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
};

// Analytics Chart Component (Placeholder for now)
const AnalyticsChart = ({ title, data, loading }) => {
  const theme = useTheme();
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </Box>
        
        {loading ? (
          <Box display="flex" alignItems="center" justifyContent="center" height={200}>
            <CircularProgress />
          </Box>
        ) : (
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            height={200}
            sx={{ 
              background: `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.secondary.light}15)`,
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Chart visualization will be implemented here
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsRes, salesRes, inventoryRes] = await Promise.all([
        getDashboardStats(),
        getSalesAnalytics('30'),
        getInventoryAnalytics(),
      ]);
      
      setStats(statsRes);
      setSalesData(salesRes);
      setInventoryData(inventoryRes);
    } catch (err) {
      setError(err.message);
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading && !refreshing) {
    return (
      <Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="rectangular" width={100} height={40} />
        </Box>
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Skeleton variant="rectangular" height={140} />
            </Grid>
          ))}
        </Grid>
        
        <Grid container spacing={3}>
          {[1, 2].map((item) => (
            <Grid item xs={12} md={6} key={item}>
              <Skeleton variant="rectangular" height={400} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ mb: 3 }}
        action={
          <Button color="inherit" size="small" onClick={handleRefresh}>
            Retry
          </Button>
        }
      >
        <Typography variant="h6" gutterBottom>
          Error Loading Dashboard
        </Typography>
        <Typography>{error}</Typography>
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          No data available
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Dashboard statistics are not available at the moment.
        </Typography>
        <Button variant="contained" onClick={handleRefresh}>
          Refresh Data
        </Button>
      </Box>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.stats?.totalUsers || 0,
      icon: <PeopleIcon />,
      color: theme.palette.primary.main,
      href: "/admin/customers",
      trend: "up",
      trendValue: "+12% this month",
      subtitle: "Registered customers",
    },
    {
      title: "Total Products",
      value: stats.stats?.totalProducts || 0,
      icon: <InventoryIcon />,
      color: theme.palette.success.main,
      href: "/admin/products",
      trend: "up",
      trendValue: "+8% this month",
      subtitle: "Active products",
    },
    {
      title: "Total Orders",
      value: stats.stats?.totalOrders || 0,
      icon: <OrdersIcon />,
      color: theme.palette.info.main,
      href: "/admin/orders",
      trend: "up",
      trendValue: "+15% this month",
      subtitle: "All time orders",
    },
    {
      title: "Total Revenue",
      value: `৳${stats.stats?.totalRevenue?.toLocaleString() || 0}`,
      icon: <RevenueIcon />,
      color: theme.palette.warning.main,
      trend: "up",
      trendValue: "+23% this month",
      subtitle: "Gross revenue",
    },
  ];

  const quickActions = [
    {
      title: "Add Product",
      description: "Create a new product listing",
      icon: <AddIcon />,
      color: theme.palette.success.main,
      href: "/admin/products/add",
      badge: "New",
    },
    {
      title: "Add Category",
      description: "Create a new product category",
      icon: <CategoryIcon />,
      color: theme.palette.info.main,
      href: "/admin/categories/add",
    },
    {
      title: "View Reports",
      description: "Analyze sales and performance",
      icon: <AssessmentIcon />,
      color: theme.palette.warning.main,
      href: "/admin/reports",
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Here's what's happening with your store today.
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Tooltip title="Refresh data">
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
          <Chip
            icon={<CalendarIcon />}
            label={new Date().toLocaleDateString()}
            variant="outlined"
            color="primary"
          />
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...card} loading={loading} />
          </Grid>
        ))}
      </Grid>

      {/* Analytics Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <AnalyticsChart 
            title="Sales Analytics" 
            data={salesData} 
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AnalyticsChart 
            title="Inventory Overview" 
            data={inventoryData} 
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Recent Activity Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Recent Orders */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} minHeight={40}>
                <Box display="flex" alignItems="center" gap={1} minWidth={0}>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    Recent Orders
                  </Typography>
                  <Badge badgeContent={stats.recentOrders?.length || 0} color="primary" size="small" sx={{ ml: 1, verticalAlign: 'middle' }} />
                </Box>
                <Button
                  component={Link}
                  href="/admin/orders"
                  size="small"
                  color="primary"
                  endIcon={<VisibilityIcon />}
                  sx={{ whiteSpace: 'nowrap', minWidth: 0, alignSelf: 'center', display: 'flex', alignItems: 'center' }}
                >
                  View all
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                <List sx={{ py: 0 }}>
                  {stats.recentOrders.slice(0, 5).map((order) => (
                    <RecentOrderItem key={order._id} order={order} />
                  ))}
                </List>
              ) : (
                <Box textAlign="center" py={4}>
                  <OrdersIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography color="text.secondary">No recent orders</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Low Stock Alerts */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} minHeight={40}>
                <Box display="flex" alignItems="center" gap={1} minWidth={0}>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    Low Stock Alerts
                  </Typography>
                  <Badge badgeContent={stats.lowStockProducts?.length || 0} color="error" size="small" sx={{ ml: 1, verticalAlign: 'middle' }} />
                </Box>
                <Button
                  component={Link}
                  href="/admin/products"
                  size="small"
                  color="primary"
                  endIcon={<VisibilityIcon />}
                  sx={{ whiteSpace: 'nowrap', minWidth: 0, alignSelf: 'center', display: 'flex', alignItems: 'center' }}
                >
                  View all
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {stats.lowStockProducts && stats.lowStockProducts.length > 0 ? (
                <List sx={{ py: 0 }}>
                  {stats.lowStockProducts.slice(0, 5).map((product) => (
                    <LowStockItem key={product._id} product={product} />
                  ))}
                </List>
              ) : (
                <Box textAlign="center" py={4}>
                  <InventoryIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography color="text.secondary">All products are well stocked</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Quick Actions
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} md={4} key={index}>
                <QuickActionCard {...action} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
} 