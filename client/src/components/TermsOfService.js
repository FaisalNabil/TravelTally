import React from 'react';
import { Container, Typography } from '@mui/material';

const TermsOfService = () => {
    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Terms of Service
            </Typography>
            <Typography paragraph>
                These Terms of Use set forth the terms and conditions for the use of the services provided on the Travel Tally website. You must use the service in accordance with these Terms of Use.
            </Typography>
            <Typography variant="h6">Application</Typography>
            <Typography paragraph>
                This Agreement shall apply to all relationships between the user and Travel Tally in relation to the use of the Service.
            </Typography>
            <Typography variant="h6">Prohibitions</Typography>
            <Typography paragraph>
                In using this service, the user must not engage in any of the following acts:
                <ul>
                    <li>Acts that are against the law or public order and morals.</li>
                    <li>Acts related to criminal activity.</li>
                    <li>Disrupting or interfering with the functioning of the server or network of the Service.</li>
                    <li>Any act that may interfere with the operation of the service.</li>
                    <li>Collecting or accumulating personal information about other users.</li>
                    <li>Pretending to be another user.</li>
                    <li>Directly or indirectly providing benefits to anti-social forces in relation to the Service.</li>
                    <li>Any other act that Travel Tally deems inappropriate.</li>
                </ul>
            </Typography>
            <Typography variant="h6">Suspension of Service</Typography>
            <Typography paragraph>
                Travel Tally may suspend or discontinue all or part of the Service without prior notice to the User under certain conditions, such as for maintenance, system updates, or force majeure events. Travel Tally shall not be liable for any detriment or damage suffered by users or third parties due to such suspension or interruption of the Service.
            </Typography>
            <Typography variant="h6">Limitations on Use</Typography>
            <Typography paragraph>
                Travel Tally may restrict the use of all or part of the Service or terminate your registration as a user without prior notice under certain circumstances, such as violation of these Terms.
            </Typography>
            <Typography variant="h6">Changes to Service and Terms</Typography>
            <Typography paragraph>
                Travel Tally may change the content of the Service or these Terms of Use at any time without notice. Travel Tally shall not be liable for any damage caused to the User as a result of these changes.
            </Typography>
            <Typography variant="h6">Exemption from Responsibility</Typography>
            <Typography paragraph>
                Travel Tally shall not be liable for damages arising from third-party content, unauthorized access, or any other damages related to the use of the website, except in cases of intentional or gross negligence.
            </Typography>
            <Typography variant="h6">Governing Law and Jurisdiction</Typography>
            <Typography paragraph>
                The interpretation of these Terms of Service shall be governed by the laws of the jurisdiction where Travel Tally is based. All disputes arising in connection with the Service shall be subject to the exclusive jurisdiction of the local court.
            </Typography>
        </Container>
    );
};

export default TermsOfService;
