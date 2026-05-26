// src/pages/Overview.jsx
import React from 'react';
import { Card, CardContent, Typography, Box, Button, Grid } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import AssetDataGrid from '../components/AssetDataGrid';
import { getGridColumns } from '../utils/columnDefs';

export default function Overview({ rows, onExport, onView, onEdit, onDelete }) {
  // Thống kê nhanh toàn hệ thống
  const totalAssets = rows.length;
  const activeAssets = rows.filter(r => {
    const status = r['Tình trạng'] ? r['Tình trạng'].toString().toLowerCase() : '';
    return status.includes('hoạt động') || status.includes('sử dụng') || status.includes('hoat dong');
  }).length;
  
  const brokenAssets = rows.filter(r => {
    const status = r['Tình trạng'] ? r['Tình trạng'].toString().toLowerCase() : '';
    return status.includes('hư') || status.includes('hỏng') || status.includes('hong');
  }).length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      
      {/* Khối Header chứa tiêu đề và Nút Tải Toàn Bộ dữ liệu Excel */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" color="#0f172a">📊 Tổng Quan Toàn Bộ Tài Sản</Typography>
          <Typography variant="body2" color="#64748b">Báo cáo số liệu thời gian thực và quản lý danh mục thiết bị IT</Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={() => onExport(rows)} // Xuất toàn bộ dữ liệu gốc
          sx={{ bgcolor: '#0d9488', '&:hover': { bgcolor: '#0f766e' }, borderRadius: '8px', textTransform: 'none', fontWeight: 'bold', height: '42px', px: 3 }}
        >
          Tải Toàn Bộ Excel
        </Button>
      </Box>

      {/* Khối 3 thẻ số liệu mini phía trên bảng */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={4}>
          <Card elevation={0} sx={{ border: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
            <CardContent sx={{ py: '12px !important' }}>
              <Typography variant="caption" color="#64748b" fontWeight="bold">TỔNG TÀI SẢN</Typography>
              <Typography variant="h4" fontWeight="900" color="#0f172a">{totalAssets}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card elevation={0} sx={{ border: '1px solid #dcfce7', bgcolor: '#f0fdf4' }}>
            <CardContent sx={{ py: '12px !important' }}>
              <Typography variant="caption" color="#16a34a" fontWeight="bold">ĐANG HOẠT ĐỘNG</Typography>
              <Typography variant="h4" fontWeight="900" color="#15803d">{activeAssets}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card elevation={0} sx={{ border: '1px solid #fee2e2', bgcolor: '#fef2f2' }}>
            <CardContent sx={{ py: '12px !important' }}>
              <Typography variant="caption" color="#dc2626" fontWeight="bold">CẦN SỬA CHỮA / HƯ HỎNG</Typography>
              <Typography variant="h4" fontWeight="900" color="#b91c1c">{brokenAssets}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bảng tổng dữ liệu */}
      <AssetDataGrid rows={rows} columns={getGridColumns(onView, onEdit, onDelete)} onExport={() => onExport(rows)} />
    </Box>
  );
}