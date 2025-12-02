// Department Options
export const DEPARTMENT_OPTIONS = [
  { label: 'Marketing', value: 'Marketing' },
  { label: 'Desain Grafis', value: 'Desain Grafis' },
  { label: 'IT Programmer', value: 'IT Programmer' },
];

// Position Options based on Department
export const POSITION_OPTIONS: Record<string, { label: string; value: string }[]> = {
  'Marketing': [
    { label: 'Staff', value: 'Staff' },
    { label: 'Supervisor', value: 'Supervisor' },
    { label: 'Manager', value: 'Manager' },
  ],
  'Desain Grafis': [
    { label: 'Staff', value: 'Staff' },
    { label: 'Supervisor', value: 'Supervisor' },
    { label: 'Manager', value: 'Manager' },
  ],
  'IT Programmer': [
    { label: 'Staff', value: 'Staff' },
    { label: 'Supervisor', value: 'Supervisor' },
    { label: 'Manager', value: 'Manager' },
  ],
};

// Get positions for a department
export const getPositionsForDepartment = (department: string) => {
  return POSITION_OPTIONS[department] || [];
};