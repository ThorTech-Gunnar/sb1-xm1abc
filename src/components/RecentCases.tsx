import React from 'react';
import { Card, Title, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge } from '@tremor/react';
import { useTheme } from '../contexts/ThemeContext';

const RecentCases: React.FC = () => {
  const { theme } = useTheme();

  const recentCases = [
    { id: 1, title: 'Server Outage', status: 'Open', priority: 'High', assignedTo: 'John Doe' },
    { id: 2, title: 'Network Connectivity Issue', status: 'In Progress', priority: 'Medium', assignedTo: 'Jane Smith' },
    { id: 3, title: 'Software Bug', status: 'Closed', priority: 'Low', assignedTo: 'Bob Johnson' },
    { id: 4, title: 'Hardware Failure', status: 'Open', priority: 'High', assignedTo: 'Alice Brown' },
    { id: 5, title: 'Security Breach', status: 'In Progress', priority: 'Critical', assignedTo: 'Charlie Davis' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return theme.warningColor;
      case 'In Progress':
        return theme.accentColor;
      case 'Closed':
        return theme.successColor;
      default:
        return theme.textColor;
    }
  };

  return (
    <Card>
      <Title>Recent Cases</Title>
      <Table className="mt-5">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Title</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Priority</TableHeaderCell>
            <TableHeaderCell>Assigned To</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recentCases.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.title}</TableCell>
              <TableCell>
                <Badge color={getStatusColor(item.status)} size="sm">
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>{item.priority}</TableCell>
              <TableCell>{item.assignedTo}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default RecentCases;