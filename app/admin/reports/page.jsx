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
  Assessment as ReportsIcon,
} from '@mui/icons-material';
import Link from "next/link";

export default function AdminReports() {
  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Reports & Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View detailed reports and analytics for your business
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Box textAlign="center" py={8}>
            <ReportsIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Reports & Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Advanced reporting and analytics features will be implemented here.
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