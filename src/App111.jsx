import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { 
  Container, Typography, CircularProgress, Box, AppBar, Toolbar, Paper, Button,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, Stack,
  Chip, MenuItem, Grid, Divider
} from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';

// ĐỐI SOÁT CỨNG API URL (Tránh cache lỗi từ file .env)
const API_URL = "https://script.google.com/macros/s/AKfycbwAd1MsLnRgl2CzdO8RtgUzJJ1XfWEl5PG-Og4g1QGWKr3QzZMVFQ8tEXLsAVtBLFQn/exec";

// Khởi tạo cấu hình cấu trúc dữ liệu form mẫu
const INITIAL_FORM_STATE = {
  STT: '', CTY: '', 'MÃ P/B': '', 'Phòng/Ban': '', 'Chức Danh': '', 'Tên thiết bị': '',
  'Mã Nhân Viên': '', 'Họ Tên': '', 'Loại Thiết bị': '', Serial: '', Model: '', 'Cấu hình': '',
  'Số lượng': '1', RAM: '', 'Ổ cứng': '', 'Màn hình': '', 'Điện Thoại Bàn': '',
  'OS(XP/7/8.1/10)': '', 'Tình trạng': 'Đang sử dụng', 'Ghi chú': '', 'NGÀY MUA': '', 'NGÀY CẤP PHÁT': '', 'Đề Xuất': ''
};

function App111() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create' | 'edit'
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [selectedRow, setSelectedRow] = useState(null); // Lưu hàng đang chọn để xem chi tiết

  // ==========================================
  // 1. API CORE FUNCTIONS (CRUD & SYNC)
  // ==========================================
  
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
      console.error("Critical Error loading data:", err);
      alert("Không thể kết nối và tải dữ liệu từ Google Sheets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setOpenDialog(false);
    try {
      const params = new URLSearchParams();
      if (dialogMode === 'create') {
        params.append('action', 'create');
      } else {
        params.append('action', 'update');
        params.append('id', formData.STT);
      }

      Object.keys(formData).forEach(key => {
        if (formData[key] !== undefined && formData[key] !== null) {
          params.append(key, formData[key]);
        }
      });

      await axios.post(API_URL, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      await loadData();
    } catch (err) {
      console.error("Form Submit Error:", err);
      alert("Thao tác thất bại! Hãy chắc chắn bạn đã Deploy đúng cách.");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (window.confirm(`Xác nhận xóa vĩnh viễn thiết bị có STT: ${id}?`)) {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append('action', 'delete');
        params.append('id', id);

        await axios.post(API_URL, params.toString(), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        await loadData();
      } catch (err) {
        console.error("Delete Action Error:", err);
        alert("Xóa dữ liệu thất bại!");
        setLoading(false);
      }
    }
  };

  // ==========================================
  // 2. ADVANCED FEATURES (EXPORT EXCEL)
  // ==========================================
  
  const handleExportExcel = () => {
    if (rows.length === 0) {
      alert("Không có dữ liệu để xuất file!");
      return;
    }
    
    // Loại bỏ cột 'id' tự sinh của DataGrid trước khi xuất
    const cleanExportData = rows.map(({ id, ...rest }) => rest);
    
    const worksheet = XLSX.utils.json_to_sheet(cleanExportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách thiết bị");
    
    // Auto-fit độ rộng cột cho đẹp
    const maxProps = Object.keys(cleanExportData[0]);
    worksheet['!cols'] = maxProps.map(prop => ({
      wch: Math.max(...cleanExportData.map(obj => obj[prop] ? obj[prop].toString().length : 0), prop.length) + 3
    }));

    XLSX.writeFile(workbook, `Bao_Cao_Thiet_Bi_IT_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  // ==========================================
  // 3. DIALOG CONTROLLERS
  // ==========================================
  
  const handleOpenCreate = () => {
    setDialogMode('create');
    setFormData(INITIAL_FORM_STATE);
    setOpenDialog(true);
  };

  const handleOpenEdit = (row) => {
    setDialogMode('edit');
    setFormData(row);
    setOpenDialog(true);
  };

  const handleOpenDetail = (row) => {
    setSelectedRow(row);
    setOpenDetailDialog(true);
  };

  // Custom Toolbar chứa nút Tìm kiếm và Xuất Excel
  function CustomToolbar() {
    return (
      <GridToolbarContainer sx={{ p: 1, display: 'flex', justifyContent: 'space-between', bgcolor: '#f5f5f5' }}>
        <GridToolbarQuickFilter variant="outlined" size="small" sx={{ width: '30%' }} />
        <Button 
          variant="contained" 
          color="warning" 
          startIcon={<DownloadIcon />} 
          onClick={handleExportExcel}
          size="small"
        >
          Xuất File Excel
        </Button>
      </GridToolbarContainer>
    );
  }

  // ==========================================
  // 4. DATAGRID COLUMNS DEFINITION
  // ==========================================
  
  const columns = [
    {
      field: 'actions',
      headerName: 'Hành động',
      width: 140,
      sortable: false,
      filterable: false,
      pinned: 'left',
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
          <IconButton color="info" size="small" onClick={() => handleOpenDetail(params.row)} title="Xem chi tiết">
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton color="primary" size="small" onClick={() => handleOpenEdit(params.row)} title="Sửa thông tin">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton color="error" size="small" onClick={() => handleDelete(params.row.STT)} title="Xóa">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
    { field: 'STT', headerName: 'STT', width: 70 },
    { field: 'CTY', headerName: 'Công Ty', width: 100 },
    { field: 'MÃ P/B', headerName: 'Mã Phòng/Ban', width: 130 },
    { field: 'Phòng/Ban', headerName: 'Phòng/Ban', width: 150 },
    { field: 'Chức Danh', headerName: 'Chức Danh', width: 150 },
    { field: 'Tên thiết bị', headerName: 'Tên thiết bị', width: 180 },
    { field: 'Mã Nhân Viên', headerName: 'Mã NV', width: 110 },
    { field: 'Họ Tên', headerName: 'Họ Tên', width: 180 },
    { field: 'Loại Thiết bị', headerName: 'Loại Thiết bị', width: 140 },
    { field: 'Serial', headerName: 'Serial', width: 130 },
    { field: 'Model', headerName: 'Model', width: 130 },
    { field: 'Cấu hình', headerName: 'Cấu hình', width: 200 },
    { field: 'Số lượng', headerName: 'Số lượng', width: 100 },
    { field: 'RAM', headerName: 'RAM', width: 90 },
    { field: 'Ổ cứng', headerName: 'Ổ cứng', width: 110 },
    { field: 'Màn hình', headerName: 'Màn hình', width: 110 },
    { field: 'Điện Thoại Bàn', headerName: 'Điện Thoại Bàn', width: 140 },
    { field: 'OS(XP/7/8.1/10)', headerName: 'Hệ Điều Hành', width: 150 },
    { 
      field: 'Tình trạng', 
      headerName: 'Tình trạng', 
      width: 140,
      renderCell: (params) => {
        const value = params.value ? params.value.toString().trim() : '';
        const lowerValue = value.toLowerCase(); 
        let colorConfig = { bgcolor: '#e0e0e0', color: '#000' }; 

        if (lowerValue.includes('su dung') || lowerValue.includes('sử dụng') || lowerValue.includes('hoat dong') || lowerValue.includes('hoạt động')) {
          colorConfig = { bgcolor: '#e8f5e9', color: '#2e7d32' }; 
        } else if (lowerValue.includes('hu') || lowerValue.includes('hư') || lowerValue.includes('hong') || lowerValue.includes('hỏng')) {
          colorConfig = { bgcolor: '#ffebee', color: '#c62828' }; 
        } else if (lowerValue.includes('ton') || lowerValue.includes('tồn') || lowerValue.includes('kho')) {
          colorConfig = { bgcolor: '#fffde7', color: '#f57f17' }; 
        }

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Chip label={value || "Trống"} size="small" sx={{ backgroundColor: colorConfig.bgcolor, color: colorConfig.color, fontWeight: 'bold', borderRadius: '6px' }} />
          </Box>
        );
      }
    },
    { field: 'Ghi chú', headerName: 'Ghi chú', width: 180 },
    { field: 'NGÀY MUA', headerName: 'Ngày Mua', width: 130 },
    { field: 'NGÀY CẤP PHÁT', headerName: 'Ngày Cấp Phát', width: 130 },
    { field: 'Đề Xuất', headerName: 'Đề Xuất', width: 150 },
  ];

  // ==========================================
  // 5. RENDERING INTERFACE (FULLSCREEN MODE)
  // ==========================================
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', bgcolor: '#f4f6f8' }}>
      {/* Top Navigation Bar */}
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight="bold" component="div">
            HỆ THỐNG QUẢN LÝ TÀI SẢN & THIẾT BỊ IT 
          </Typography>
          <Button 
            variant="contained" 
            color="success" 
            startIcon={<AddIcon />} 
            onClick={handleOpenCreate}
            fontWeight="bold"
          >
            Thêm thiết bị mới
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Grid Full Screen Content Container */}
      <Box sx={{ flexGrow: 1, p: 1, height: 'calc(100vh - 64px)', width: '100%' }}>
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress size={60} />
          </Box>
        )}

        {!loading && (
          <Paper elevation={2} sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSizeOptions={[25, 50, 100]}
              initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
              slots={{ toolbar: CustomToolbar }}
              sx={{
                border: 'none',
                '& .MuiDataGrid-columnHeaders': { bgcolor: '#e0e0e0', color: '#333', fontWeight: 'bold' },
                '& .MuiDataGrid-cell:focus': { outline: 'none' },
              }}
              disableRowSelectionOnClick
            />
          </Paper>
        )}
      </Box>

      {/* ==========================================
          MODAL DIALOG: THÊM MỚI / CHỈNH SỬA
          ========================================== */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1976d2', color: '#fff', mb: 2, fontWeight: 'bold' }}>
          {dialogMode === 'create' ? 'THÊM THIẾT BỊ MỚI VÀO HỆ THỐNG' : `CẬP NHẬT THÔNG TIN THIẾT BỊ (STT: ${formData.STT})`}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {Object.keys(INITIAL_FORM_STATE).map((key) => {
              if (key === 'STT' && dialogMode === 'create') return null;
              
              if (key === 'Tình trạng') {
                return (
                  <Grid item xs={12} sm={6} key={key}>
                    <TextField
                      select
                      label={key}
                      value={formData[key] || 'Đang sử dụng'}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      fullWidth variant="outlined" size="small"
                    >
                      <MenuItem value="Đang sử dụng">Đang sử dụng</MenuItem>
                      <MenuItem value="Hư hỏng">Hư hỏng</MenuItem>
                      <MenuItem value="Tồn kho">Tồn kho</MenuItem>
                    </TextField>
                  </Grid>
                );
              }

              return (
                <Grid item xs={12} sm={6} key={key}>
                  <TextField
                    label={key}
                    disabled={key === 'STT'}
                    value={formData[key] || ''}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    fullWidth variant="outlined" size="small"
                  />
                </Grid>
              );
            })}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit" variant="outlined">Hủy bỏ</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">Lưu thay đổi</Button>
        </DialogActions>
      </Dialog>

      {/* ==========================================
          MODAL DIALOG: XEM CHI TIẾT THIẾT BỊ
          ========================================== */}
      <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#0288d1', color: '#fff', fontWeight: 'bold' }}>
          CHI TIẾT THIẾT BỊ CHI TIẾT
        </DialogTitle>
        <DialogContent dividers>
          {selectedRow && (
            <Stack spacing={1.5}>
              {Object.keys(INITIAL_FORM_STATE).map((key) => (
                <Box key={key}>
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="textSecondary" fontWeight="bold">
                        {key}:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2" color="textPrimary" sx={{ wordBreak: 'break-all' }}>
                        {selectedRow[key] || '---'}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 0.5, borderStyle: 'dashed' }} />
                </Box>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailDialog(false)} variant="contained" color="info">Đóng cửa sổ</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App111;