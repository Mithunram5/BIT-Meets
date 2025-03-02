import { useEffect,useState } from "react";
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, IconButton, Card } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DvrOutlinedIcon from "@mui/icons-material/DvrOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from "@mui/icons-material/Close";
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import AutorenewIcon from '@mui/icons-material/Autorenew';

import image from "../assets/bannariammanheader.png";
import VenueTable from "../components/venue";
import DatePick from "../components/date";
import DateTimePicker from "../components/datetime";
import RepeatOverlay from "../components/RepeatOverlay.jsx";
import crt from "../assets/Featured icon.png";

const Submit = () => {
  return (
    <Card sx={{borderRadius: "12px", boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)", maxWidth: 400, padding: "16px"}}>
      <img src={crt} alt="Success" style={{ width: 50, height: 50}}/>
      <Box>
        <Typography sx={{ fontWeight: "bold", fontSize: "18px", marginTop:'10px' }}>
          Meeting initiated
        </Typography>
        <Typography sx={{ color: "#64748B", fontSize: "16px", marginTop:'15px'}}>
          Created successfully members got notified the meeting.
        </Typography>
      </Box>
    </Card>
  );
};

export default function Cmeeting({ onBack,selectedMeeting }) {
  const [openSubmitCard, setOpenSubmitCard] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);

  const [discussionPoints, setDiscussionPoints] = useState([
    { id: "01", point: "Revision of Vision, Mission of the Department, PEOs, PSOs (if required):" },
    { id: "02", point: "Discussion on Curriculum & syllabi of Proposed Regulations. (Based on revision of regulations):" },
    { id: "03", point: "Suggestions for innovative teaching methodology/ Evaluation /Question Paper:" },
  ]);

  const [isVenueTableVisible, setIsVenueTableVisible] = useState(false);

  const priorityTypes = ["High Priority", "Medium Priority", "Low Priority"];

  const handleTextFieldClick = () => setIsVenueTableVisible(true);
  const handleCloseVenueTable = () => setIsVenueTableVisible(false);
  const handleVenueSelect = (venue) => {
    setSelectedVenue(venue);
    setIsVenueTableVisible(false);
  };
  
  const handleAddTopic = () => {
    const newId = String(discussionPoints.length + 1).padStart(2, "0");
    const newPoint = { id: newId, point: "" };
    setDiscussionPoints([...discussionPoints, newPoint]);
  };
  
  const handleInitiateMeeting = () => {
    setOpenSubmitCard(true);
    setTimeout(() => {
      onBack();
    }, 3000);
  };

  const [openDatetime, setOpenDatetime] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState("");
  const handleConfirm = (dateTime) => {
    setSelectedDateTime(dateTime);
    setOpenDatetime(false);
  };


  const [selectedDate, setSelectedDate] = useState("");
  const [openDateIndex, setOpenDateIndex] = useState(null);
  const handleDateConfirm = (date, index) => {
    setSelectedDate((prev) => ({ ...prev, [index]: date.format("YYYY-MM-DD") }));
    setOpenDateIndex(null);
  };

  const [openRepeat, setOpenRepeat] = useState(false);
  const [repeatValue, setRepeatValue] = useState("");

  const [isPreview, setIsPreview] = useState(false);
  const [isPreviewDisabled, setIsPreviewDisabled] = useState(true);
  useEffect(() => {
    setIsPreviewDisabled(
      !selectedMeeting || !selectedDateTime || !repeatValue || !selectedVenue
    );
  }, [selectedMeeting, selectedDateTime, repeatValue, selectedVenue]);


  return (
    <Box sx={{ display: "flex",justifyContent: "center",alignItems: "center",minHeight: "90vh"}}>

      <Box sx={{ display: "flex",flexDirection: "column",minHeight: "90vh",backgroundColor: "#f5f5f5",padding: "16px",borderRadius: "8px",boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)"}}>

        {/* top buttons */}
        <Box sx={{ display: "flex",alignItems: "center",justifyContent: "space-between",padding: "12px 0"}}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ display: "flex", padding: "5px", backgroundColor: "white" }}>
              <ArrowBackIcon sx={{ cursor: "pointer" }} onClick={onBack}/>
            </Box>
            <Typography variant="h6" fontWeight="bold">
              Create meeting
            </Typography>
          </Box>

          {isPreview ? (
            <Box sx={{display:'flex',gap:6,alignItems:'center',justifyContent:'center'}}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#007bff",
                  textTransform: "none",
                  gap: "5px",
                  "&:hover": { backgroundColor: "#0069d9" },
                }}
              >
                <VerticalAlignBottomIcon sx={{ fontSize: "18px" }} />
                Download
              </Button>
              <Button
                variant="outlined"
                sx={{ textTransform: "none", gap: "5px" }}
                onClick={() => setIsPreview(false)}
              >
                <AutorenewIcon sx={{ fontSize: "18px" }} />
              </Button>
            </Box>
            ) : (
              <Box sx={{ display: "flex",alignItems: "center",gap: 1,padding: "6px",backgroundColor: "white",borderRadius: "8px" }}>
                <Button variant="outlined" 
                  sx={{ textTransform: "none", gap: "5px" }} 
                  onClick={() => setIsPreview(true)}
                  disabled={isPreviewDisabled}
                >
                  <DvrOutlinedIcon sx={{ fontSize: "18px" }} />
                  Preview
                </Button>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#6c757d",textTransform: "none",gap: "5px",
                    "&:hover": { backgroundColor: "#5a6268" },
                  }}
                >
                  <DescriptionOutlinedIcon sx={{ fontSize: "18px" }} />
                  Save as Draft
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#007bff",
                    textTransform: "none",
                    gap: "5px",
                    "&:hover": { backgroundColor: "#0069d9" },
                  }}
                  onClick={handleInitiateMeeting}
                >
                  <AutoAwesomeOutlinedIcon sx={{ fontSize: "18px" }} />
                  Initiate meeting
                </Button>
              </Box>
            )}
        </Box>

        {openSubmitCard && (
          <Box
            sx={{ position: "fixed",top: 0,left: 0,width: "100vw",height: "100vh",backgroundColor: "rgba(0, 0, 0, 0.5)",display: "flex",justifyContent: "center",alignItems: "center",zIndex: 999}}>
            <Box
              sx={{ backgroundColor: "white",padding: "16px",borderRadius: "12px" }}>
              <Submit />
            </Box>
          </Box>
        )}

        <Box sx={{ display: "flex", backgroundColor: "white", justifyContent: "center", alignItems: "center", flexDirection: 'column' }}>
          <img src={image} alt="Example" style={{ width: "50%", height: "50%", padding: "10px" }} />

          {/* first part */}
          <TableContainer sx={{ maxWidth: 1000, margin: "auto", mt: 3, border: "1px solid #ddd",borderBottom:'none' }}>
            <Table sx={{ borderCollapse: "collapse" }}>
              <TableBody>

                <TableRow>
                  <TableCell sx={cellStyle}>Name of the Meeting</TableCell>
                  <TableCell sx={cellStyle}>
                    <TextField 
                      variant="standard" 
                      placeholder="Ex..8th BoS Meeting"
                      fullWidth
                      value={selectedMeeting}
                      InputProps={{ disableUnderline: true }} 
                      onChange={(e) => setSelectedMeeting(e.target.value)}
                      disabled={Boolean(selectedMeeting)}
                    />
                  </TableCell>
                  <TableCell sx={cellStyle}>Reference Number</TableCell>
                  <TableCell sx={cellStyle}>
                    <TextField 
                      variant="standard" 
                      placeholder="Auto generate" 
                      fullWidth 
                      InputProps={{ 
                        disableUnderline: true,
                        sx: { fontStyle: 'italic', color: '#777' }
                      }} 
                      disabled={isPreview}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={cellStyle}>Meeting Description</TableCell>
                  <TableCell colSpan={3} sx={{ ...cellStyle }}>
                    <TextField
                      variant="standard"
                      multiline
                      fullWidth
                      placeholder="Ex..Lorem ipsum dolor sit amet consectetur. Arcu vel egestas rutrum in magna semper dolor sem. Bibendum tristique quisque facilisis cursus mus malesuada mattis et erat. Pellentesque sed congue tellus massa aliquam. Augue erat nunc mauris consectetur."
                      rows={4}
                      InputProps={{ 
                        disableUnderline: true,
                        sx: { fontStyle: 'italic', color: '#555' }
                      }}
                      disabled={isPreview}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={cellStyle}>Repeat Type</TableCell>
                  <TableCell sx={cellStyle}>
                  {repeatValue ? (
                    <Box
                      sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        borderRadius: "20px",
                        bgcolor: "#f0f8ff", 
                        padding: "6px 12px",
                        width: "fit-content" 
                      }}
                    >
                      <Typography sx={{ color: "#175CD3", fontSize: '12px' }}>
                        {repeatValue}
                      </Typography>
                      <IconButton
                        sx={{ 
                          border: "2px solid #FB3748", 
                          borderRadius: "50%", 
                          p: "2px",
                          marginLeft: '5px', 
                          "&:hover": { backgroundColor: "transparent" } 
                        }}
                        onClick={() => setRepeatValue("")}
                        disabled={isPreview}
                      >
                        <CloseIcon sx={{ fontSize: "8px", color: "#FB3748"}} />
                      </IconButton>
                    </Box>
                  ) :(
                    <TextField
                      placeholder="Ex..Monthly"
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                      value={repeatValue}
                      onClick={() => setOpenRepeat(true)}
                      disabled={isPreview}
                    />
                  )}
                  </TableCell>

                  {openRepeat && <RepeatOverlay onClose={() => setOpenRepeat(false)} 
                    onSave={(selectedOption) => {
                      setRepeatValue(selectedOption);
                      setOpenRepeat(false);
                    }} 
                  />}


                  <TableCell sx={cellStyle}>Priority Type</TableCell>
                  <TableCell sx={cellStyle}>
                    <Autocomplete
                      disablePortal
                      options={priorityTypes}
                      sx={{
                        "& .MuiAutocomplete-endAdornment": { display: "none" },
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Ex..High Priority"
                          variant="standard"
                          InputProps={{
                            ...params.InputProps,
                            disableUnderline: true,
                          }}
                          disabled={isPreview}
                        />
                      )}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={cellStyle}>Venue Details</TableCell>
                  <TableCell sx={cellStyle}>
                    {selectedVenue ? (
                      <Box sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        borderRadius: "20px",
                        bgcolor: "#f0f8ff", 
                        padding: "6px 12px",
                        width: "fit-content" 
                      }}>
                        <Typography sx={{ color: "#175CD3", fontSize:'12px' }}>
                          {selectedVenue.name}
                          <IconButton sx={{ border: "2px solid #FB3748", borderRadius: "50%", p: "2px",marginLeft:'5px', "&:hover": { backgroundColor: "transparent" } }}
                          onClick={() => setSelectedVenue(null)}
                          disabled={isPreview}
                          >
                              <CloseIcon sx={{ fontSize: "8px", color: "#FB3748"}} />
                          </IconButton>
                        </Typography>
                      </Box>
                    ) : (
                      <TextField 
                        variant="standard" 
                        placeholder="Select venue" 
                        fullWidth 
                        InputProps={{ 
                          disableUnderline: true, 
                          style: { color: "#999" } 
                        }} 
                        onClick={handleTextFieldClick}
                        readOnly
                        disabled={isPreview}
                      />
                    )}
                  </TableCell>
                  {isVenueTableVisible && (
                    <div style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "100vh",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 999,
                    }}>
                      <VenueTable onVenueSelect={handleVenueSelect} onClose={handleCloseVenueTable} />
                    </div>
                  )}

                  <TableCell sx={cellStyle}>Date & Time</TableCell>
                    <TableCell sx={cellStyle}>
                      <TextField
                        variant="standard"
                        placeholder="Select time"
                        fullWidth
                        InputProps={{ disableUnderline: true }}
                        value={selectedDateTime}
                        onClick={() => setOpenDatetime(true)}
                        readOnly
                        disabled={isPreview}
                      />
                        {openDatetime && (
                        <Box
                          sx={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                            bgcolor: "rgba(0, 0, 0, 0.5)",
                            zIndex: 1300,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onClick={() => setOpenDatetime(false)}
                        >
                          <Box
                            sx={{
                              position: "relative",
                              zIndex: 1301,
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DateTimePicker onConfirm={handleConfirm} />
                          </Box>
                        </Box>
                      )}
                    </TableCell>
              </TableRow>

                <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                  <TableCell sx={headerStyle}>Roles</TableCell>
                  <TableCell colSpan={3} sx={headerStyle}>Member list</TableCell>
                </TableRow>

                {["Chairman", "University Nominee", "Academic Council Member"].map((role, index) => (
                  <TableRow key={index}>
                    <TableCell sx={cellStyle}>{`${String.fromCharCode(97 + index)}. ${role}`}</TableCell>
                    <TableCell colSpan={3} sx={cellStyle}>
                      <TextField 
                        variant="standard" 
                        placeholder="Select Member" 
                        fullWidth 
                        InputProps={{ 
                          disableUnderline: true, 
                        }} 
                        disabled={isPreview}
                      />
                    </TableCell>
                  </TableRow>
                ))}

              </TableBody>
            </Table>
          </TableContainer>

          {/* second part */}
          <TableContainer sx={{ maxWidth: 1000, margin: "auto", border: "1px solid #ddd", borderTop: "none" }}>
            <Table sx={{ borderCollapse: "collapse" }}>
            <TableHead>
                <TableRow>
                  <TableCell width="5%" sx={headerCellStyle}>S.No</TableCell>
                  <TableCell width="30%" sx={headerCellStyle}>Points to be Discussed</TableCell>
                  <TableCell width="20%" sx={headerCellStyle}>Todo</TableCell>
                  <TableCell width="20%" sx={headerCellStyle}>Responsibility</TableCell>
                  <TableCell width="20%" sx={headerCellStyle}>Deadline</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {discussionPoints.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell sx={cellStyle}>{item.id}</TableCell>
                    <TableCell sx={{ ...cellStyle, fontWeight: "normal", maxWidth: "300px" }}>
                      <TextField
                        variant="standard"
                        placeholder="Enter discussion topic"
                        multiline
                        fullWidth
                        minRows={1}
                        maxRows={4}
                        InputProps={{ 
                          disableUnderline: true,
                          sx: { fontSize: '14px',fontWeight:'bold'}
                        }}
                        value={item.point}
                        onChange={(e) => {
                          const updatedPoints = [...discussionPoints];
                          updatedPoints[index].point = e.target.value;
                          setDiscussionPoints(updatedPoints);
                        }}
                        disabled={isPreview}
                      />
                    </TableCell>
                    <TableCell sx={cellStyle}>
                      <TextField variant="standard" placeholder="Add remarks" fullWidth InputProps={{ disableUnderline: true }}disabled={isPreview} />
                    </TableCell>
                    <TableCell sx={cellStyle}>
                      <TextField variant="standard" placeholder="Select Member" fullWidth InputProps={{ disableUnderline: true }}disabled={isPreview} />
                    </TableCell>
                    <TableCell sx={cellStyle}>
                      <TextField variant="standard" placeholder="Select Date" fullWidth 
                        InputProps={{ disableUnderline: true }} 
                        value={selectedDate[index] || ""}
                        onClick={() => setOpenDateIndex(index)}
                        readOnly
                        disabled={isPreview}
                      />
                    </TableCell>
                    {openDateIndex === index && (
                      <Box
                        sx={{
                          position: "fixed",
                          top: 0,
                          left: 0,
                          width: "100vw",
                          height: "100vh",
                          bgcolor: "rgba(0, 0, 0, 0.5)",
                          zIndex: 1300,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            position: "relative",
                            zIndex: 1301,
                          }}
                        >
                        <DatePick 
                          onConfirm={(date) => handleDateConfirm(date, index)} 
                          onClose={() => setOpenDateIndex(null)}
                          disabled={isPreview}
                        />
                        </Box>
                    </Box>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex",width: "98%",justifyContent: "center",alignItems: "center",border: "2px dashed #1976d2",margin: "auto",mb: 3,padding: "8px",color: "#1976d2",cursor: "pointer"}}
            onClick={handleAddTopic}
          >
            <AddCircleOutlineIcon sx={{ marginRight: 1 }} />
            <Typography>Add new Topic</Typography>
          </Box>

        </Box>

      </Box>
    </Box>
  );
}

const cellStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  fontWeight: "bold",
};

const headerStyle = {
  ...cellStyle,
  backgroundColor: "#f0f0f0",
  fontWeight: "bold",
};

const headerCellStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  backgroundColor: "#f0f0f0",
  fontWeight: "bold",
};