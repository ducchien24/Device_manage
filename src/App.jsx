import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { 
  Box, AppBar, Toolbar, Typography, Button, CircularProgress, Dialog, 
  DialogTitle, DialogContent, DialogActions, Grid, TextField, MenuItem, Stack, Divider 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import DepartmentFilter from './pages/DepartmentFilter';
import DeviceTypeFilter from './pages/DeviceTypeFilter';
import StatusFilter from './pages/StatusFilter';
import TimeFilter from './pages/TimeFilter';
import WarehouseFilter from './pages/WarehouseFilter';

import {INITIAL_FORM_STATE } from './config';

function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [selectedRow, setSelectedRow] = useState(null);
  const API_URL =import.meta.env.VITE_API_URL;
  const loadData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      const sheetRows = response.data;
      if (sheetRows && sheetRows.length > 0) {
        const headers = sheetRows[0];
        const formattedData = sheetRows.slice(1).map((row, index) => {
          const rowObject = {};
          rowObject.id = row[0] ? row[0].toString() : `row-${index}`;
          headers.forEach((header, colIndex) => {
            const cleanHeader = header ? header.trim().replace(/\s+/g, ' ') : `Column_${colIndex}`;
            rowObject[cleanHeader] = row[colIndex] !== undefined ? row[colIndex] : '';
          });
          return rowObject;
        });
        setRows(formattedData);
      }
    } catch (err) {
      alert("Không thể tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);
    const processRowUpdate = async (newRow, oldRow) => {
    // Cập nhật ngay lập tức trên State React để giao diện mượt mà (Optimistic Update)
    setRows((prevRows) => prevRows.map((row) => (row.id === newRow.id ? newRow : row)));

    try {
      const bodyFormData = new FormData();
      bodyFormData.append('action', 'update');
      bodyFormData.append('id', newRow.STT);
      
      // Đẩy các trường dữ liệu mới vào FormData
      Object.keys(newRow).forEach(key => {
        if (key !== 'id' && newRow[key] !== undefined && newRow[key] !== null) {
          bodyFormData.append(key, newRow[key]);
        }
      });

      // Gửi ngầm xuống Google Sheets (no-cors)
      await fetch(API_URL, {
        method: 'POST',
        body: bodyFormData,
        mode: 'no-cors'
      });

      // TUYỆT ĐỐI KHÔNG gọi lại loadData() ở đây để bảng không bị reset vị trí cuộn!
      return newRow;
    } catch (err) {
      console.error("Lỗi cập nhật dòng:", err);
      // Nếu lỗi thì trả về dòng cũ
      setRows((prevRows) => prevRows.map((row) => (row.id === oldRow.id ? oldRow : row)));
      return oldRow;
    }
  };
 // src/App.jsx - Thay thế hàm handleSubmit cũ bằng hàm này
const handleSubmit = async (e) => {
  // Chặn tuyệt đối hiện tượng reload trang của thẻ form HTML
  if (e && e.preventDefault) e.preventDefault();
  
  // KHÔNG set Thẻ Loading toàn màn hình (setLoading(true)) vì nó sẽ làm mất bảng dữ liệu
  setOpenDialog(false); 
  
  try {
    const bodyFormData = new FormData();
    if (dialogMode === 'create') {
      bodyFormData.append('action', 'create');
    } else {
      bodyFormData.append('action', 'update');
      bodyFormData.append('id', formData.STT);
    }

    // Đóng gói dữ liệu gửi đi
    Object.keys(formData).forEach(key => {
      if (formData[key] !== undefined && formData[key] !== null) {
        bodyFormData.append(key, formData[key]);
      }
    });

    // 1. CẬP NHẬT TRƯỚC TRÊN GIAO DIỆN (Giúp bảng đứng im tại dòng đang sửa, ví dụ dòng 135)
    if (dialogMode === 'edit') {
      setRows((prevRows) => 
        prevRows.map((row) => 
          row.STT === formData.STT ? { ...row, ...formData } : row
        )
      );
    }

    // 2. BẮN DỮ LIỆU NGẦM XUỐNG GOOGLE SHEETS
    await fetch(API_URL, {
      method: 'POST',
      body: bodyFormData,
      mode: 'no-cors' // Vượt qua CORS
    });

    // 3. Nếu là chế độ TẠO MỚI (Create), bắt buộc phải kéo lại data vì chưa có STT
    if (dialogMode === 'create') {
      setLoading(true);
      await loadData(); // Hàm loadData gốc của bạn để kéo danh sách mới về
    } else {
      // Nếu là SỬA, tuyệt đối KHÔNG gọi loadData(). Màn hình sẽ đứng im tại dòng 135!
      console.log(`Đã cập nhật ngầm thiết bị STT ${formData.STT} thành công.`);
    }

  } catch (err) {
    console.error("Lỗi khi lưu dữ liệu:", err);
    alert("Thao tác thất bại! Vui lòng thử lại.");
    
    // Nếu lỗi xảy ra khi sửa, khôi phục lại dữ liệu bằng cách kéo lại từ Sheets
    if (dialogMode === 'edit') {
      await loadData();
    }
  } finally {
    setLoading(false);
  }
};
  const handleDelete = async (id) => {
    if (!id || !window.confirm(`Xác nhận xóa thiết bị STT: ${id}?`)) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('action', 'delete');
      params.append('id', id);
      await axios.post(API_URL, params.toString(), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
      await loadData();
    } catch (err) {
      alert("Xóa thất bại!");
      setLoading(false);
    }
  };

  const handleExportExcel = (dataToExport) => {
    const cleanData = dataToExport.map(({ id, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(cleanData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DataIT");
    XLSX.writeFile(workbook, `Bao_Cao_IT_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const handleOpenEdit = (row) => {
    setDialogMode('edit');
    setFormData(row);
    setOpenDialog(true);
  };

  const handleOpenView = (row) => {
    setSelectedRow(row);
    setOpenDetailDialog(true);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden', bgcolor: '#f1f5f9' }}>
      {/* SIDEBAR COMPONENT FIXED BÊN TRÁI */}
      <Sidebar />

      {/* KHỐI NỘI DUNG BÊN PHẢI (CHIẾM HẾT MÀN HÌNH CÒN LẠI) */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        
        {/* APPBAR TRÊN CÙNG */}
        <AppBar position="static" sx={{ bgcolor: '#ffffff', color: '#1e293b', borderBottom: '1px solid #e2e8f0' }} elevation={0}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight="bold">Dashboard Điều Hành</Typography>
            <Button variant="contained" sx={{ bgcolor: '#0284c7', '&:hover': { bgcolor: '#0369a1' }, textTransform: 'none', fontWeight: 'bold' }} startIcon={<AddIcon />} onClick={() => { setDialogMode('create'); setFormData(INITIAL_FORM_STATE); setOpenDialog(true); }}>
              Thêm thiết bị mới
            </Button>
          </Toolbar>
        </AppBar>

        {/* VÙNG CHỨA ROUTER PAGES (ÉP CHIỀU CAO VÀ CHỐNG VỠ LAYOUT) */}
        <Box sx={{ flexGrow: 1, p: 3, overflow: 'hidden', height: 'calc(100vh - 64px)' }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%"><CircularProgress size={50} /></Box>
          ) : (
           <Routes>
  <Route path="/" element={<Overview rows={rows} onExport={handleExportExcel} onView={handleOpenView} onEdit={handleOpenEdit} onDelete={handleDelete} processRowUpdate={processRowUpdate} />} />
  <Route path="/phong-ban" element={<DepartmentFilter rows={rows} onExport={handleExportExcel} onView={handleOpenView} onEdit={handleOpenEdit} onDelete={handleDelete} processRowUpdate={processRowUpdate} />} />
  <Route path="/loai-thiet-bi" element={<DeviceTypeFilter rows={rows} onExport={handleExportExcel} onView={handleOpenView} onEdit={handleOpenEdit} onDelete={handleDelete} processRowUpdate={processRowUpdate} />} />
  <Route path="/tinh-trang" element={<StatusFilter rows={rows} onExport={handleExportExcel} onView={handleOpenView} onEdit={handleOpenEdit} onDelete={handleDelete} processRowUpdate={processRowUpdate} />} />
  <Route path="/kho-it" element={<WarehouseFilter rows={rows} onExport={handleExportExcel} onView={handleOpenView} onEdit={handleOpenEdit} onDelete={handleDelete} processRowUpdate={processRowUpdate} />} />
  <Route path="/thoi-gian" element={<TimeFilter rows={rows} onExport={handleExportExcel} onView={handleOpenView} onEdit={handleOpenEdit} onDelete={handleDelete} processRowUpdate={processRowUpdate} />} />
</Routes>
          )}
        </Box>
      </Box>

      {/* POPUP DIALOG FORM */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#0f172a', color: '#fff', fontWeight: 'bold' }}>
          {dialogMode === 'create' ? 'THÊM MỚI TÀI SẢN THIẾT BỊ' : `CẬP NHẬT THIẾT BỊ (STT: ${formData.STT})`}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {Object.keys(INITIAL_FORM_STATE).map((key) => {
              if (key === 'STT' && dialogMode === 'create') return null;
              if (key === 'Tình trạng') {
                return (
                  <Grid item xs={12} sm={6} key={key}>
                    <TextField select label={key} value={formData[key] || 'Đang sử dụng'} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} fullWidth size="small">
                      <MenuItem value="Đang sử dụng">Đang sử dụng</MenuItem>
                      <MenuItem value="Hư hỏng">Hư hỏng</MenuItem>
                      <MenuItem value="Tồn kho">Tồn kho</MenuItem>
                    </TextField>
                  </Grid>
                );
              }
              return (
                <Grid item xs={12} sm={6} key={key}>
                  <TextField label={key} disabled={key === 'STT'} value={formData[key] || ''} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} fullWidth size="small" />
                </Grid>
              );
            })}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit">Hủy bỏ</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#0284c7' }}>Lưu Thay Đổi</Button>
        </DialogActions>
      </Dialog>

      {/* POPUP XEM CHI TIẾT */}
      <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#0284c7', color: '#fff', fontWeight: 'bold' }}>CHI THÔNG TIN CHI TIẾT</DialogTitle>
        <DialogContent dividers>
          {selectedRow && (
            <Stack spacing={1}>
              {Object.keys(INITIAL_FORM_STATE).map((key) => (
                <Box key={key}>
                  <Grid container>
                    <Grid item xs={4}><Typography variant="body2" color="textSecondary" fontWeight="bold">{key}:</Typography></Grid>
                    <Grid item xs={8}><Typography variant="body2" color="textPrimary" sx={{ wordBreak: 'break-all' }}>{selectedRow[key] || '---'}</Typography></Grid>
                  </Grid>
                  <Divider sx={{ my: 0.5, borderStyle: 'dashed' }} />
                </Box>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions><Button onClick={() => setOpenDetailDialog(false)} variant="contained" sx={{ bgcolor: '#64748b' }}>Đóng</Button></DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;