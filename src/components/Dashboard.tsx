import React from 'react';
import { useSession } from 'next-auth/react';
import { AlertCircle, CheckCircle, Clock, Users, FileText } from 'lucide-react';
import Layout from './Layout';
import { Card, Metric, Text, Flex, Grid, BarList, DonutChart, Title } from '@tremor/react';
import { useTheme } from '../contexts/ThemeContext';
import RecentCases from './RecentCases';
import CaseTypeDistribution from './CaseTypeDistribution';

const Dashboard: React.FC = () => {
  const { data: session } = useSession();
  const { theme } = useTheme();

  if (!session) {
    return <div>Access denied. Please log in.</div>;
  }

  const stats = [
    { name: 'Total Cases', value: '150', icon: FileText, color: theme.primaryColor },
    { name: 'Open Cases', value: '45', icon: AlertCircle, color: theme.warningColor },
    { name: 'In Progress', value: '30', icon: Clock, color: theme.accentColor },
    { name: 'Closed Cases', value: '75', icon: CheckCircle, color: theme.successColor },
    { name: 'Total Users', value: '25', icon: Users, color: theme.secondaryColor },
  ];

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6" style={{ color: theme.textColor }}>Dashboard</h1>
        <Grid numItemsSm={2} numItemsLg={3} className="gap-6">
          {stats.map((item) => (
            <Card key={item.name} decoration="top" decorationColor={item.color}>
              <Flex justifyContent="start" className="space-x-4">
                <item.icon className="w-8 h-8" style={{ color: item.color }} />
                <div className="truncate">
                  <Text>{item.name}</Text>
                  <Metric className="truncate">{item.value}</Metric>
                </div>
              </Flex>
            </Card>
          ))}
        </Grid>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <RecentCases />
          <CaseTypeDistribution />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;