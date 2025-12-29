/**
 * Yup validation schemas for marketplace listing
 * Using Formik + Yup for form validation
 */
import * as Yup from 'yup';

// Marketplace Listing validation schema
export const marketplaceListingSchema = Yup.object({
  marketplaceListingDescription: Yup.string()
    .min(1, 'Description is required (min 1 character)')
    .max(500, 'Description must be at most 500 characters')
    .required('Description is required'),
  
  marketplaceListingTeaser: Yup.string()
    .min(1, 'Marketplace Teaser is required (min 1 character)')
    .max(220, 'Marketplace Teaser must be at most 220 characters')
    .required('Marketplace Teaser is required'),
  
  globalAudienceSize: Yup.string()
    .min(1, 'Global Audience Size is required (min 1 character)')
    .max(20, 'Global Audience Size must be at most 20 characters')
    .required('Global Audience Size is required'),
  
  socialMediaPresence: Yup.string()
    .min(1, 'Social Media Presence is required (min 1 character)')
    .max(20, 'Social Media Presence must be at most 20 characters')
    .required('Social Media Presence is required'),
  
  occupancyRate: Yup.string()
    .min(1, 'Occupancy Rate is required (min 1 character)')
    .max(20, 'Occupancy Rate must be at most 20 characters')
    .required('Occupancy Rate is required'),
  
  annualAttendance: Yup.string()
    .min(1, 'Annual Attendance is required (min 1 character)')
    .max(20, 'Annual Attendance must be at most 20 characters')
    .required('Annual Attendance is required'),
});



// Multiple sponsors validation
export const sponsorsSchema = Yup.object({
  sponsors: Yup.array().of(sponsorSchema),
});

