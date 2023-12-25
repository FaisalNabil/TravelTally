import React from 'react';
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper  } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQ = () => {
    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Frequently Asked Questions (FAQ)
            </Typography>
            
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>How is the expense settlement calculated in a Tour?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography paragraph>
                        Travel Tally calculates settlements efficiently to ensure fair expense sharing. Consider this complex scenario:
                    </Typography>

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="complex settlement example table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tour Member</TableCell>
                                    <TableCell align="right">Amount Paid</TableCell>
                                    <TableCell align="right">Amount Owed</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell component="th" scope="row">Alice</TableCell>
                                    <TableCell align="right">$50</TableCell>
                                    <TableCell align="right">$30</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">Bob</TableCell>
                                    <TableCell align="right">$20</TableCell>
                                    <TableCell align="right">$50</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">Charlie</TableCell>
                                    <TableCell align="right">$40</TableCell>
                                    <TableCell align="right">$40</TableCell>
                                </TableRow>
                                {/* Add more rows as needed */}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Typography paragraph>
                        In this example, Alice paid $50 but owes $30, Bob paid $20 but owes $50, and Charlie paid and owes $40. 
                        The algorithm calculates the most efficient way to settle debts, minimizing the number of transactions needed.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            {/* FAQ on various situations where Travel Tally can be used */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>What situations can Travel Tally be used in?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Travel Tally is versatile and can be used for various scenarios, such as group travels, 
                        parties, camping trips, sports club activities, and even shared living expenses. 
                        It simplifies tracking shared expenses and managing settlements among tour members.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            {/* FAQ on editing Tour Members */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>How can I edit Tour Members?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        To edit Tour Members, navigate to your Tour details and select the option to edit the Tour. 
                        Here you can add new members or remove existing ones. Note that members linked to a payment cannot be removed.
                    </Typography>
                </AccordionDetails>
            </Accordion>

             {/* FAQ on Deleting Tours */}
             <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Can I delete my Tour entirely?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Yes, you can delete your Tour if needed. However, please note that deleting a Tour will 
                        remove all associated data, including expenses and settlements. This action cannot be undone, 
                        so be sure it's what you want before proceeding.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            {/* Additional FAQs can be added following the same format */}
        </Container>
    );
};

export default FAQ;
