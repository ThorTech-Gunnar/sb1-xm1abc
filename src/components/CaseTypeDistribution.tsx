import React from 'react';
import { Card, Title, DonutChart } from '@tremor/react';
import { useTheme } from '../contexts/ThemeContext';

const CaseTypeDistribution: React.FC = () => {
  const { theme } = useTheme();

  const caseTypes = [
    { name: 'Hardware', value: 35 },
    { name: 'Software', value: 40 },
    { name: 'Network', value: 25 },
    { name: 'Security', value: 20 },
    { name: 'Other', value: 15 },
  ];

  return (
    <Card>
      <Title>Case Type Distribution</Title>
      <DonutChart
        className="mt-6"
        data={caseTypes}
        category="value"
        index="name"
        valueFormatter={(number: number) => `${number} cases`}
        colors={[theme.primaryColor, theme.secondaryColor, theme.accentColor, theme.warningColor, theme.successColor]}
      />
    </Card>
  );
};

export default CaseTypeDistribution;