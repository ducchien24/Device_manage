// src/pages/TimeFilter.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Stack, Button, Box } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import AssetDataGrid from '../components/AssetDataGrid';
import { getGridColumns } from '../utils/columnDefs';

export default function TimeFilter({ rows, onExport, onView, onEdit, onDelete }) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [filtered, setFiltered] = useState(rows);

  useEffect(() => {
    if (!start && !end) {
      setFiltered(rows);
      return;
    }
    const filteredData = rows.filter(r => {
      const parseSheetDate = (val) => {
        if (!val) return null;
        const d = new Date(val);
        return isNaN(d.getTime()) ? null : d;
      };

      const dateMua = parseSheetDate(r['NGÀY MUA']);
      const dateCap = parseSheetDate(r['NGÀY CẤP PHÁT']);
      const sDate = start ? new Date(start) : null;
      const eDate = end ? new Date(end) : null;

      let matchMua = true, matchCap = true;
      if (sDate) {
        if (!dateMua || dateMua < sDate) matchMua = false;
        if (!dateCap || dateCap < sDate) matchCap = false;
      }
      if (eDate) {
        if (!dateMua || dateMua > eDate) matchMua = false;
        if (!dateCap || dateCap > eDate) matchCap = false;
      }
      return (dateMua && matchMua) || (dateCap && matchCap);
    });
    setFiltered(filteredData);
  }, [start, end, rows]);

  const inputDateStyle = {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    fontFamily: 'inherit',
    color: '#334155',
    backgroundColor: '#ffffff',
    height: '38px',
    boxSizing: 'border-box'
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Card elevation={0} sx={{ mb: 2, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
        <CardContent sx={{ py: '12px !important', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Cụm bên trái: Nhập ngày tháng tìm kiếm */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="subtitle1" fontWeight="bold" color="#1e293b">Lọc ngày:</Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="textSecondary" fontWeight="500">Từ</Typography>
              <input type="date" style={inputDateStyle} value={start} onChange={(e) => setStart(e.target.value)} />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="textSecondary" fontWeight="500">Đến</Typography>
              <input type="date" style={inputDateStyle} value={end} onChange={(e) => setEnd(e.target.value)} />
            </Box>

            {(start || end) && (
              <Button 
                variant="text" 
                size="small" 
                color="error" 
                onClick={() => { setStart(''); setEnd(''); }}
                sx={{ textTransform: 'none', fontWeight: 'bold' }}
              >
                Xóa lọc
              </Button>
            )}
          </Stack>
          
          {/* Cụm bên phải: Ô đếm số lượng kết quả + Nút Tải Excel theo mốc thời gian */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right', px: 1.5, py: 0.2, bgcolor: '#f1f5f9', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <Typography variant="caption" color="#475569" fontWeight="bold" display="block">KẾT QUẢ</Typography>
              <Typography variant="subtitle1" fontWeight="900" color="#334155">{filtered.length} máy</Typography>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => onExport(filtered)} // Xuất file chứa chính xác các máy nằm trong khoảng ngày được chọn
              sx={{ bgcolor: '#0d9488', '&:hover': { bgcolor: '#0f766e' }, borderRadius: '8px', textTransform: 'none', fontWeight: 'bold', height: '38px' }}
            >
              Tải Excel Theo Lịch
            </Button>
          </Box>

        </CardContent>
      </Card>
      
      <AssetDataGrid rows={filtered} columns={getGridColumns(onView, onEdit, onDelete)} onExport={() => onExport(filtered)} />
    </Box>
  );
}