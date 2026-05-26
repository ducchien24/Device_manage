// src/pages/WarehouseFilter.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download'; // Import icon tải xuống
import AssetDataGrid from '../components/AssetDataGrid';
import { getGridColumns } from '../utils/columnDefs';

export default function WarehouseFilter({ rows, onExport, onView, onEdit, onDelete }) {
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    // Lọc danh sách thiết bị có trạng thái "Tồn kho"
    const warehouseData = rows.filter(r => {
      const status = r['Tình trạng'] ? r['Tình trạng'].toString().trim().toLowerCase() : '';
      return status.includes('ton') || status.includes('tồn') || status.includes('kho');
    });
    setFiltered(warehouseData);
  }, [rows]);

  // Tính tổng số lượng thiết bị thực tế trong kho
  const totalQuantity = filtered.reduce((sum, item) => {
    const qty = parseInt(item['Số lượng'], 10);
    return sum + (isNaN(qty) ? 0 : qty);
  }, 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      
      {/* Khối thẻ báo cáo nhanh cải tiến tích hợp nút Download */}
      <Card elevation={0} sx={{ mb: 2, border: '1px solid #cbd5e1', bgcolor: '#f8fafc' }}>
        <CardContent sx={{ py: '16px !important', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Cụm bên trái: Tiêu đề trang */}
          <Box>
            <Typography variant="h6" fontWeight="bold" color="#0f172a">📦 Kho Lưu Trữ & Quản Lý Thiết Bị</Typography>
            <Typography variant="body2" color="#64748b">
              Danh sách các tài sản, thiết bị IT hiện đang ở trạng thái <strong>Tồn kho</strong>, sẵn sàng cấp phát.
            </Typography>
          </Box>
          
          {/* Cụm bên phải: Ô thống kê số lượng + NÚT DOWNLOAD FILE EXCEL */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            
            {/* Thẻ hiển thị số lượng tổng máy */}
            <Box sx={{ textAlign: 'right', px: 2, py: 0.5, bgcolor: '#fef9c3', borderRadius: '8px', border: '1px solid #ca8a04' }}>
              <Typography variant="caption" color="#854d0e" fontWeight="bold" display="block">TỔNG MÁY TRONG KHO</Typography>
              <Typography variant="h4" fontWeight="900" color="#ca8a04">{totalQuantity}</Typography>
            </Box>

            {/* Nút Xuất Excel độc lập cho dữ liệu trong kho */}
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => onExport(filtered)} // Truyền mảng đã lọc 'filtered' để chỉ tải riêng danh sách hàng tồn kho
              sx={{
                bgcolor: '#0d9488',
                '&:hover': { bgcolor: '#0f766e' },
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 'bold',
                height: '48px', // Kích thước chiều cao tương đương khối số lượng cho cân đối
                px: 2.5
              }}
            >
              Tải File Excel Kho
            </Button>

          </Box>

        </CardContent>
      </Card>

      {/* Bảng dữ liệu Grid */}
      <AssetDataGrid 
        rows={filtered} 
        columns={getGridColumns(onView, onEdit, onDelete)} 
        onExport={() => onExport(filtered)} 
      />
    </Box>
  );
}