import React, { useState } from "react";
import { Box, Button, Typography, IconButton, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ArrowDropUp, ArrowDropDown } from "@mui/icons-material";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const DateTimePicker = ({ onConfirm }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs("2025-06-14"));
  const [fromTime, setFromTime] = useState({ hour: 4, minute: 57, amPm: "AM" });
  const [toTime, setToTime] = useState({ hour: 6, minute: 30, amPm: "PM" });

  const [isSelectingFrom, setIsSelectingFrom] = useState(true);
  const activeTime = isSelectingFrom ? fromTime : toTime;
  const setActiveTime = isSelectingFrom ? setFromTime : setToTime;

  const handleHourChange = (increment) => {
    setActiveTime((prev) => ({
      ...prev,
      hour: ((prev.hour + increment - 1 + 12) % 12) + 1,
    }));
  };

  const handleMinuteChange = (increment) => {
    setActiveTime((prev) => ({
      ...prev,
      minute: (prev.minute + increment + 60) % 60,
    }));
  };

  const handleClear = () => {
    setFromTime({ hour: 4, minute: 57, amPm: "AM" });
    setToTime({ hour: 6, minute: 30, amPm: "PM" });
    setSelectedDate(dayjs("2025-06-14"));
  };

  const handleConfirm = () => {
    const formattedDateTime = `${selectedDate.format("DD-MM-YYYY")} && ${fromTime.hour}:${fromTime.minute
      .toString()
      .padStart(2, "0")} ${fromTime.amPm} - ${toTime.hour}:${toTime.minute
      .toString()
      .padStart(2, "0")} ${toTime.amPm}`;
    onConfirm(formattedDateTime);
  };

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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar value={selectedDate} onChange={(newDate) => setSelectedDate(newDate)} />
      </LocalizationProvider>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          alignItems: "center",
          mt: 2,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <IconButton size="small" onClick={() => handleHourChange(1)}>
            <ArrowDropUp />
          </IconButton>
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: "bold",
              cursor: "pointer",
              color: isSelectingFrom ? "blue" : "black",
            }}
            onClick={() => setIsSelectingFrom(true)}
          >
            {fromTime.hour}:{fromTime.minute.toString().padStart(2, "0")} {fromTime.amPm}
          </Typography>
          <IconButton size="small" onClick={() => handleHourChange(-1)}>
            <ArrowDropDown />
          </IconButton>
        </Box>

        <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>-</Typography>

        <Box sx={{ textAlign: "center" }}>
          <IconButton size="small" onClick={() => handleMinuteChange(1)}>
            <ArrowDropUp />
          </IconButton>
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: "bold",
              cursor: "pointer",
              color: !isSelectingFrom ? "blue" : "black",
            }}
            onClick={() => setIsSelectingFrom(false)}
          >
            {toTime.hour}:{toTime.minute.toString().padStart(2, "0")} {toTime.amPm}
          </Typography>
          <IconButton size="small" onClick={() => handleMinuteChange(-1)}>
            <ArrowDropDown />
          </IconButton>
        </Box>
      </Box>

      <ToggleButtonGroup
        value={activeTime.amPm}
        exclusive
        onChange={(event, newValue) =>
          newValue && setActiveTime((prev) => ({ ...prev, amPm: newValue }))
        }
        sx={{ mt: 1 }}
      >
        <ToggleButton value="AM" sx={{ fontSize: "1rem" }}>
          AM
        </ToggleButton>
        <ToggleButton value="PM" sx={{ fontSize: "1rem" }}>
          PM
        </ToggleButton>
      </ToggleButtonGroup>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button onClick={handleClear} sx={{ color: "red" }}>
          Clear
        </Button>
        <Button variant="contained" onClick={handleConfirm}>
          Confirm
        </Button>
      </Box>
    </Box>
  );
};

export default DateTimePicker;

