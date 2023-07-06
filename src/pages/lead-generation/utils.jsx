import {
  IconLoanTransfer,
  IconCommercial,
  IconHomeLoan,
  IconLoanAgainstProperty,
  IconPropertyIdentified,
  IconPropertyUnIdentified,
  IconResidential,
} from '../../assets/icons';

import LoanTransferFields from './property-details/LoanTransferFields';
import HomeLoanFields from './property-details/HomeLoanFields';
import LoanAgainstPropertyFields from './property-details/LoanAgainstPropertyFields';
import { lazy } from 'react';

export const loanTypeOptions = [
  {
    label: 'Home Loan',
    value: 'Home Loan',
    icon: <IconHomeLoan />,
  },
  {
    label: 'Loan against Property',
    value: 'LAP',
    icon: <IconLoanAgainstProperty />,
  },
  {
    label: 'Loan Transfer',
    value: 'Loan Transfer',
    icon: <IconLoanTransfer />,
  },
];

export const propertyIdentificationOptions = [
  {
    label: 'Done!',
    value: 'done',
    icon: <IconPropertyIdentified />,
  },
  {
    label: 'Not yet...',
    value: 'not-yet',
    icon: <IconPropertyUnIdentified />,
  },
];

export const propertyCategoryOptions = [
  {
    label: 'Residential',
    value: 'residential',
    icon: <IconResidential />,
  },
  {
    label: 'Commerical',
    value: 'commerical',
    icon: <IconCommercial />,
  },
];

export const propertyDetailsMap = {
  'Home Loan': {
    fields: <HomeLoanFields />,
    loanPurposeOptions: [
      { label: 'Purchase', value: 'Home Purchase' },
      { label: 'Construction', value: 'Home Construction' },
      { label: 'Renovation/Extension', value: 'Home Renovation / Extension' },
    ],
    propertyTypeOptions: {
      'Home Purchase': [
        { label: 'Residential House', value: 'Residential House' },
        { label: 'Plot + Construction', value: 'Plot + Construction' },
        { label: 'Ready Built Flat', value: 'Ready Built Flat' },
      ],
      'Home Construction': [
        { label: 'Owned Plot', value: 'Owned Plot' },
        { label: 'Under Construction Property', value: 'Under Construction Property' },
      ],
      'Home Renovation / Extension': [{ label: 'Residential House', value: 'Residential House' }],
    },
  },
  LAP: {
    fields: <LoanAgainstPropertyFields />,
    loanPurposeOptions: [
      { label: 'Business', value: 'Business' },
      { label: 'Personal Usage', value: 'Personal Usage' },
    ],
    propertyTypeOptions: {
      Business: [
        { label: 'Residential House', value: 'Residential House' },
        { label: 'Ready Built Flat', value: 'Ready Built Flat' },
        { label: 'Commercial Shop/Unit', value: 'Commercial Shop Unit' },
        { label: 'Commercial Building', value: 'Commercial Building' },
      ],
      'Personal Usage': [
        { label: 'Residential House', value: 'Residential House' },
        { label: 'Ready Built Flat', value: 'Ready Built Flat' },
        { label: 'Commercial Shop/Unit', value: 'Commercial Shop Unit' },
        { label: 'Commercial Building', value: 'Commercial Building' },
      ],
    },
  },
  'Loan Transfer': {
    fields: <LoanTransferFields />,
    loanPurposeOptions: [
      { label: 'Home Loan', value: 'Home Loan' },
      { label: 'LAP', value: 'LAP' },
    ],
    propertyTypeOptions: {
      'Home Loan': [
        { label: 'Residential House', value: 'Residential House' },
        { label: 'Plot + Construction', value: 'Plot + Construction' },
        { label: 'Ready Built Flat', value: 'Ready Built Flat' },
        { label: 'Owned Plot', value: 'Owned Plot' },
        { label: 'Under Construction Property', value: 'Under Construction Property' },
      ],
      LAP: [
        { label: 'Residential House', value: 'Residential House' },
        { label: 'Ready Built Flat', value: 'Ready Built Flat' },
        { label: 'Commercial Shop/Unit', value: 'Commercial Shop/Unit' },
        { label: 'Commercial Building', value: 'Commercial Building' },
      ],
    },
  },
};

export const loanTenureOptions = [
  { label: 'Months', value: 'months' },
  { label: 'Years', value: 'years' },
];

export const steps = [
  {
    label: 'Personal Details',
    Component: lazy(() => import('./PersonalDetails')),
  },
  {
    label: 'Professional Details',
    Component: lazy(() => import('./ProfessionalDetails')),
  },
  {
    label: 'Property Details',
    Component: lazy(() => import('./property-details')),
  },
];
