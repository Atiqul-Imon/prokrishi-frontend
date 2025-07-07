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
  Person as PersonIcon,
} from '@mui/icons-material';
import Link from "next/link";

export default function AdminProfile() {
  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Admin Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your admin account and profile settings
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Box textAlign="center" py={8}>
            <PersonIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Admin Profile
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Profile management features will be implemented here.
            </Typography>
            <Button
              component={Link}
              href="/admin"
              variant="outlined"
              color="primary"
            >
              Back to Dashboard
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
} 