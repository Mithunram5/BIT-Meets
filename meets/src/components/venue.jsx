import { useState } from "react";
import { Box, Card, Typography, IconButton, InputBase, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Paper, Button } from "@mui/material";
import { Close, Search, KeyboardArrowDown, Check } from "@mui/icons-material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

export default function VenueTable({ onVenueSelect, onClose }) {
    const [vselect, setVselect] = useState(null);
    const [vsearch, setVsearch] = useState("");

    const Venues = [
        { id: 1, name: "SF Board room", status: "Active", capacity: "40", priority: "HIGH", action: "", isActive: true },
        { id: 2, name: "SF Conference hall 01", status: "In Active", capacity: "30", priority: "LOW", action: "", isActive: false },
        { id: 3, name: "SF Conference hall 02", status: "Active", capacity: "20", priority: "NIL", action: "", isActive: true },
        { id: 4, name: "SF Conference hall 03", status: "In Active", capacity: "60", priority: "MEDIUM", action: "", isActive: false },
        { id: 5, name: "SF Conference hall 04", status: "Active", capacity: "08", priority: "HIGH", action: "", isActive: true },
    ];

    const handleSel = (id) => {
        setVselect((prev) => (prev === id ? null : id));
    };
    
    const selectedCapacity = vselect ? Venues.find((venue) => venue.id === vselect)?.capacity : "0";

    const filterVenues = Venues.filter(venue =>
        venue.name.toLowerCase().includes(vsearch.toLowerCase())
    );

    const handleAddVenue = () => {
        if (vselect) {
            const selectedVenue = Venues.find(venue => venue.id === vselect);
            if (selectedVenue) {
                onVenueSelect(selectedVenue);
            }
        }
    };

    return (
        <Card sx={{ width: 700, borderRadius: 2, p: 2, bgcolor: "white" }}>

            {/* top */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px" }}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '50px' }}>
                    <Typography sx={{ color: "#3D3939", fontWeight: "bold" }}>Check Venue availability</Typography>
                    <Typography sx={{ color: "#1A79E6", fontWeight: "bold" }}>Total Members: {selectedCapacity}</Typography>
                </div>
                <IconButton
                    sx={{ border: "2px solid #FB3748", borderRadius: "50%", padding: "4px", "&:hover": { backgroundColor: "transparent" } }}
                    onClick={onClose}
                >
                    <Close sx={{ fontSize: "12px", color: "#FB3748" }} />
                </IconButton>
            </Box>

            <hr />

            {/* search */}
            <Box sx={{ display: "flex", gap: "10px", my: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", width: "100%", p: "2px 4px", border: "1px solid #ccc", borderRadius: "6px" }}>
                    <Search sx={{ ml: 1 }} />
                    <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search" value={vsearch} onChange={(e) => setVsearch(e.target.value)} />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", width: "15%", p: "2px 4px", border: "1px solid #ccc", borderRadius: "6px" }}>
                    <FilterAltOutlinedIcon />
                    <Typography sx={{ fontSize: "12px", color: "#546773" }}>Filter By</Typography>
                </Box>
            </Box>

            <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox"></TableCell>
                            <TableCell>Venue name</TableCell>
                            <TableCell>
                                Status
                                <KeyboardArrowDown fontSize="small" sx={{ verticalAlign: "middle", ml: 0.5 }} />
                            </TableCell>
                            <TableCell>Capacity</TableCell>
                            <TableCell>
                                Priority
                                <KeyboardArrowDown fontSize="small" sx={{ verticalAlign: "middle", ml: 0.5 }} />
                            </TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filterVenues.map((Venue) => (
                            <TableRow key={Venue.id}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={vselect === Venue.id}
                                        onChange={() => handleSel(Venue.id)}
                                        disabled={!Venue.isActive}
                                        icon={<span style={{ width: 24, height: 24, borderRadius: "50%", border: "2px solid #D3D3D3", backgroundColor: !Venue.isActive ? "#DADADA" : "transparent", cursor: !Venue.isActive ? "not-allowed" : "pointer" }} />}
                                        checkedIcon={
                                            <span style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: "#1976D2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <Check style={{ color: "white", fontSize: 18, alignItems: 'center' }} />
                                            </span>
                                        }
                                    />
                                </TableCell>
                                <TableCell sx={{ paddingRight: "70px" }}>{Venue.name}</TableCell>

                                {/* Status */}
                                <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: Venue.isActive ? "#e8f5e9" : "#ffebee", color: Venue.isActive ? "#2e7d32" : "#d32f2f", padding: "4px 8px", borderRadius: "16px", fontSize: "12px", fontWeight: 500, width: "fit-content" }}>
                                        <Box sx={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: Venue.isActive ? "#2e7d32" : "#d32f2f" }} />
                                        {Venue.status}
                                    </Box>
                                </TableCell>

                                <TableCell sx={{ color: '#175CD3' }}>{Venue.capacity}</TableCell>

                                {/* Priority */}
                                <TableCell>
                                    <Typography
                                        sx={{ color: "#175CD3", backgroundColor: "#e3f2fd", padding: "4px 8px", borderRadius: "16px", fontSize: "10px", fontWeight: 500, display: "inline-block" }}>
                                        {Venue.priority}
                                    </Typography>
                                </TableCell>

                                {/* Action */}
                                <TableCell>
                                    {Venue.status === "In Active" ? (
                                        <Typography sx={{ color: "#1A79E6", cursor: "pointer", textDecoration: "underline" }}>
                                            View
                                        </Typography>
                                    ) : (
                                        <Typography sx={{ color: "#1A79E6", cursor: "pointer", textDecoration: "underline" }}>
                                            {Venue.action}
                                        </Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Button
                fullWidth
                sx={{ mt: 2, bgcolor: "#007bff", color: "white", textTransform: "capitalize" }}
                onClick={handleAddVenue}
            >
                Add Venue
            </Button>
        </Card>
    );
}
