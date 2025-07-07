"use client";

import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  Add as AddIcon,
} from '@mui/icons-material';
import Link from "next/link";

export default function AdminAddProduct() {
  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Add New Product
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create a new product listing for your catalog
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Box textAlign="center" py={8}>
            <AddIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Add New Product
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Product creation form will be implemented here.
            </Typography>
            <Box display="flex" gap={2} justifyContent="center">
              <Button
                component={Link}
                href="/admin/products"
                variant="outlined"
                color="primary"
              >
                Back to Products
              </Button>
              <Button
                component={Link}
                href="/admin"
                variant="outlined"
                color="secondary"
              >
                Back to Dashboard
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
} 