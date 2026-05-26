// src/utils/columnDefs.jsx
import React from 'react';
import { Stack, IconButton, Box, Chip, MenuItem, Select } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export const getGridColumns = (onView, onEdit, onDelete) => [
  {
    field: 'actions', headerName: 'Hành động', width: 130, sortable: false, filterable: false,
    renderCell: (params) => (
      <Stack direction="row" spacing={0.5} sx={{ mt: 0.8 }}>
        <IconButton color="info" size="small" onClick={() => onView(params.row)}><VisibilityIcon fontSize="small" /></IconButton>
        <IconButton color="primary" size="small" onClick={() => onEdit(params.row)}><EditIcon fontSize="small" /></IconButton>
        <IconButton color="error" size="small" onClick={() => onDelete(params.row.STT)}><DeleteIcon fontSize="small" /></IconButton>
      </Stack>
    ),
  },
  { field: 'STT', headerName: 'STT', width: 60 },
  { field: 'CTY', headerName: 'Công Ty', width: 90, editable: true },
  { field: 'MÃ P/B', headerName: 'Mã P/B', width: 100, editable: true },
  { field: 'Phòng/Ban', headerName: 'Phòng/Ban', width: 140, editable: true },
  { field: 'Chức Danh', headerName: 'Chức Danh', width: 140, editable: true },
  { field: 'Tên thiết bị', headerName: 'Tên thiết bị', width: 170, editable: true },
  { field: 'Mã Nhân Viên', headerName: 'Mã NV', width: 100, editable: true },
  { field: 'Họ Tên', headerName: 'Họ Tên', width: 160, editable: true },
  { field: 'Loại Thiết bị', headerName: 'Loại Thiết bị', width: 130, editable: true },
  { field: 'Serial', headerName: 'Serial', width: 120, editable: true },
  { field: 'Model', headerName: 'Model', width: 120, editable: true },
  { field: 'Cấu hình', headerName: 'Cấu hình', width: 180, editable: true },
  { field: 'Số lượng', headerName: 'SL', width: 70, editable: true },
  
  // KHỐI XỬ LÝ: CHO PHÉP SỬA TRỰC TIẾP & ĐỔI MÀU XANH CHO "ĐANG HOẠT ĐỘNG"
  { 
    field: 'Tình trạng', 
    headerName: 'Tình trạng', 
    width: 160, 
    editable: true, // Kích hoạt tính năng click đúp vào ô để sửa trực tiếp
    type: 'singleSelect',
    valueOptions: ['Đang hoạt động', 'Đang sử dụng', 'Hư hỏng', 'Tồn kho'], // Các tùy chọn khi sửa nhanh
    
    // 1. Chế độ hiển thị thông thường (Đổi màu theo yêu cầu)
    renderCell: (params) => {
      const val = params.value ? params.value.toString().trim().toLowerCase() : '';
      let cfg = { bg: '#e2e8f0', c: '#334155' }; // Mặc định xám
      
      // Khớp từ khóa "hoạt động" hoặc "sử dụng" -> Đổi sang màu xanh lá cây rực rỡ
      if (val.includes('hoat dong') || val.includes('hoạt động') || val.includes('su dung') || val.includes('sử dụng')) {
        cfg = { bg: '#dcfce7', c: '#16a34a' }; // Xanh lá cây (Teal/Green)
      } 
      else if (val.includes('hu') || val.includes('hư') || val.includes('hong') || val.includes('hỏng')) {
        cfg = { bg: '#fee2e2', c: '#dc2626' }; // Đỏ
      } 
      else if (val.includes('ton') || val.includes('tồn') || val.includes('kho')) {
        cfg = { bg: '#fef9c3', c: '#ca8a04' }; // Vàng bơ
      }
      
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Chip 
            label={params.value || "Trống"} 
            size="small" 
            sx={{ 
              backgroundColor: cfg.bg, 
              color: cfg.c, 
              fontWeight: 'bold', 
              borderRadius: '6px',
              border: `1px solid ${cfg.c}30` // Thêm viền mờ cùng tông màu cho sang sạch
            }} 
          />
        </Box>
      );
    },

    // 2. Chế độ khi người dùng double-click vào để chọn lại trạng thái
    renderEditCell: (params) => {
      const handleChange = (event) => {
        params.api.setEditCellValue({ id: params.id, field: params.field, value: event.target.value });
        // Nhấn Enter hoặc tab ra ngoài để tự động lưu giá trị mới
        params.api.stopRowEditMode({ id: params.id });
      };

      return (
        <Select
          value={params.value || ''}
          onChange={handleChange}
          fullWidth
          size="small"
          sx={{ height: '100%', '& .MuiSelect-select': { py: 0, display: 'flex', alignItems: 'center' } }}
        >
          <MenuItem value="Đang hoạt động">Đang hoạt động</MenuItem>
          <MenuItem value="Đang sử dụng">Đang sử dụng</MenuItem>
          <MenuItem value="Hư hỏng">Hư hỏng</MenuItem>
          <MenuItem value="Tồn kho">Tồn kho</MenuItem>
        </Select>
      );
    }
  },
  
  { field: 'Ghi chú', headerName: 'Ghi chú', width: 150, editable: true },
  { field: 'NGÀY MUA', headerName: 'Ngày Mua', width: 120, editable: true },
  { field: 'NGÀY CẤP PHÁT', headerName: 'Ngày Cấp Phát', width: 120, editable: true },
];