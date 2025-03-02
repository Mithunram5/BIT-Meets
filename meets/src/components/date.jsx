import React, { useState } from "react";
import { Box, Button ,Typography ,IconButton } from "@mui/material";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Close } from "@mui/icons-material";

const DatePick = ({ onConfirm, onClose }) => {
    const [selectedDate, setSelectedDate] = useState(null);
  
    return (
      <Box
        sx={{
          width: 320,
          p: 2,
          borderRadius: 3,
          boxShadow: 3,
          bgcolor: "white",
          textAlign: "center",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px" }}>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '50px' }}>
                <Typography sx={{ color: "#3D3939", fontWeight: "bold" }}>Deadline</Typography>
            </div>
            <IconButton
                sx={{ border: "2px solid #FB3748", borderRadius: "50%", padding: "4px", "&:hover": { backgroundColor: "transparent" } }}
                onClick={onClose}
            >
                <Close sx={{ fontSize: "12px", color: "#FB3748" }} />
            </IconButton>
        </Box>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar value={selectedDate} onChange={(newDate) => setSelectedDate(newDate)} />
        </LocalizationProvider>
  
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button sx={{ color: "red" }} onClick={onClose}>
            Clear
          </Button>
          <Button variant="contained" onClick={() => selectedDate && onConfirm(dayjs(selectedDate))}>
            Confirm
          </Button>
        </Box>
      </Box>
    );
  };
  

export default DatePick;
