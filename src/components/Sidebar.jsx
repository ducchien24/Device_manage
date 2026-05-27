// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Paper,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import DevicesIcon from "@mui/icons-material/Devices";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import WarehouseIcon from "@mui/icons-material/Warehouse";

const menuItems = [
  { path: "/", text: "Tổng quan hệ thống", icon: <DashboardIcon /> },
  { path: "/phong-ban", text: "Theo Phòng / Ban", icon: <BusinessIcon /> },
  { path: "/loai-thiet-bi", text: "Theo Loại Thiết Bị", icon: <DevicesIcon /> },
  { path: "/tinh-trang", text: "Theo Tình Trạng", icon: <ReportProblemIcon /> },
  { path: "/kho-it", text: "Kho IT (Hàng Tồn)", icon: <WarehouseIcon /> },
  {
    path: "/thoi-gian",
    text: "Tra Cứu Thời Gian",
    icon: <CalendarMonthIcon />,
  },
];

export default function Sidebar() {
  return (
    <Paper
      elevation={0}
      sx={{
        width: 350,
        bgcolor: "#1e293b",
        color: "#f8fafc",
        borderRadius: 0,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box sx={{ p: 2.5, bgcolor: "#0f172a" }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          color="#38bdf8"
          letterSpacing={0.5}
        >
          IT ASSET ADMIN
        </Typography>
        <Typography variant="caption" color="#94a3b8">
          Hệ thống quản lý tài sản v2.0
        </Typography>
      </Box>
      <Divider sx={{ borderColor: "#334155" }} />

      <List component="nav" sx={{ flexGrow: 1, px: 1.5, py: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink} // Bơm NavLink vào component MUI để tối ưu hiệu năng và DOM sạch
            to={item.path}
            sx={{
              borderRadius: "8px",
              mb: "6px",
              color: "#f8fafc",
              textDecoration: "none",
              "&:hover": { bgcolor: "#334155" },
              transition: "all 0.2s",
              // Khi đường dẫn khớp, MUI tự động kích hoạt class .active
              "&.active": {
                bgcolor: "#0284c7 !important",
                fontWeight: "bold",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{ fontSize: "14px", fontWeight: 500 }} // Hợp lệ 100% vì nằm trong Component MUI thực thụ
            />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
}
