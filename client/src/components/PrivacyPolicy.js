import React from 'react';
import { Container, Typography, Link  } from '@mui/material';

const PrivacyPolicy = () => {
    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Privacy Policy for Travel Tally
            </Typography>
            
            <Typography variant="h6" gutterBottom>
                Introduction
            </Typography>

            <Typography paragraph>
                Travel Tally respects the privacy of its users and is committed to protecting their personal information. This Privacy Policy outlines our practices regarding the collection, use, and safeguarding of personal information through our website.
            </Typography>
            
            <Typography variant="h6" gutterBottom>
                Compliance
            </Typography>
            
            <Typography paragraph>
                Travel Tally complies with the Act on the Protection of Personal Information, related guidelines, and other laws and regulations concerning the protection of personal information.
            </Typography>
            
            <Typography variant="h6" gutterBottom>
                Secure Management of Personal Information
            </Typography>
            
            <Typography paragraph>
                We implement appropriate measures to protect personal information from unauthorized access, disclosure, alteration, or destruction. These measures include organizational, physical, personnel, and technical safeguards.
            </Typography>
            
            <Typography variant="h6" gutterBottom>
                Acquisition of Personal Information
            </Typography>
            
            <Typography paragraph>
                Travel Tally may collect personal information from users and advertisers to the extent necessary for the operation of our Internet-based services. This may include, but is not limited to, names, contact details, and usage data.
            </Typography>
            
            <Typography variant="h6" gutterBottom>
                Purpose of Use of Personal Information
            </Typography>

            <Typography paragraph>
                We use personal information for the following purposes:
            </Typography>

            <Typography component="ul">
                <li>
                    <Typography>
                        To operate, maintain, and manage Travel Tally's website.
                    </Typography>
                </li>
                <li>
                    <Typography>
                        To provide and improve the services offered through our website.
                    </Typography>
                </li>
                <li>
                    <Typography>
                        To conduct surveys and research for enhancing the quality of our website.
                    </Typography>
                </li>
            </Typography>

            <Typography paragraph>
                Personal information will not be used beyond these purposes without legal stipulation or individual consent.
            </Typography>
            
            <Typography variant="h6" gutterBottom>
                Provision of Personal Information to Third Parties
            </Typography>
            
            <Typography paragraph>
                Travel Tally does not provide personal information to third parties without the prior consent of the individual, except as required by law. We ensure appropriate management of personal information when entrusting data to third parties.
            </Typography>
            
            <Typography variant="h6" gutterBottom>
                Changes to the Purpose of Use
            </Typography>
            
            <Typography paragraph>
                The purposes of use of personal information as specified above may be subject to change, and any such changes will be communicated through updates to this policy.
            </Typography>
            
            <Typography variant="h6" gutterBottom>
                Disposal of Personal Information
            </Typography>
            
            <Typography paragraph>
                We will securely delete or dispose of personal information when it is no longer needed for the purposes for which it was collected.
            </Typography>
            
            <Typography variant="h6" gutterBottom>
                Continuous Improvement and Review
            </Typography>
            
            <Typography paragraph>
                Travel Tally regularly reviews and improves its practices and systems for handling personal information.
            </Typography>

            <Typography variant="h6" gutterBottom>
                Contact for Complaints and Consultation
            </Typography>

            <Typography paragraph>
                For any complaints or inquiries regarding our handling of personal information, please contact our designated representative at <Link href="mailto:tousif.md.amin.faisal@gmail.com">tousif.md.amin.faisal@gmail.com</Link>.
            </Typography>
        </Container>
    );
};

export default PrivacyPolicy;
