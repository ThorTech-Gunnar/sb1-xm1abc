import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AlertCircle, Clock, CheckCircle, Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Card, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge, Button, TextInput, Select, SelectItem } from '@tremor/react';
import api from '../utils/api';

interface Case {
  id: string;
  title: string;
  status: 'open' | 'in progress' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  assignedTo: string;
}

const CaseList: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [casesPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await api.get('/cases');
      setCases(response.data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    }
  };

  useEffect(() => {
    let result = cases;
    if (statusFilter !== 'all') {
      result = result.filter(case_ => case_.status === statusFilter);
    }
    if (priorityFilter !== 'all') {
      result = result.filter(case_ => case_.priority === priorityFilter);
    }
    if (searchTerm) {
      result = result.filter(case_ => 
        case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredCases(result);
    setCurrentPage(1);
  }, [cases, statusFilter, priorityFilter, searchTerm]);

  const getStatusColor = (status: Case['status']) => {
    switch (status) {
      case 'open':
        return theme.warningColor;
      case 'in progress':
        return theme.accentColor;
      case 'closed':
        return theme.successColor;
    }
  };

  const getPriorityColor = (priority: Case['priority']) => {
    switch (priority) {
      case 'low':
        return 'green';
      case 'medium':
        return 'yellow';
      case 'high':
        return 'orange';
      case 'critical':
        return 'red';
    }
  };

  // Get current cases
  const indexOfLastCase = currentPage * casesPerPage;
  const indexOfFirstCase = indexOfLastCase - casesPerPage;
  const currentCases = filteredCases.slice(indexOfFirstCase, indexOfLastCase);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Card>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Cases</h1>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button
            icon={Plus}
            onClick={() => router.push('/cases/new')}
            style={{ backgroundColor: theme.primaryColor }}
          >
            Create New Case
          </Button>
        </div>
      </div>
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-2 sm:mb-0">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in progress">In Progress</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </Select>
        </div>
        <TextInput
          icon={Search}
          placeholder="Search cases..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Title</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Priority</TableHeaderCell>
            <TableHeaderCell>Assigned To</TableHeaderCell>
            <TableHeaderCell>Created At</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentCases.map((case_) => (
            <TableRow key={case_.id} className="cursor-pointer" onClick={() => router.push(`/cases/${case_.id}`)}>
              <TableCell>{case_.title}</TableCell>
              <TableCell>
                <Badge color={getStatusColor(case_.status)} size="sm">
                  {case_.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge color={getPriorityColor(case_.priority)} size="sm">
                  {case_.priority}
                </Badge>
              </TableCell>
              <TableCell>{case_.assignedTo}</TableCell>
              <TableCell>{new Date(case_.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{indexOfFirstCase + 1}</span> to <span className="font-medium">{Math.min(indexOfLastCase, filteredCases.length)}</span> of{' '}
            <span className="font-medium">{filteredCases.length}</span> results
          </p>
        </div>
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <Button
            icon={ChevronLeft}
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            variant="secondary"
            size="sm"
          >
            Previous
          </Button>
          <Button
            icon={ChevronRight}
            iconPosition="right"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredCases.length / casesPerPage)}
            variant="secondary"
            size="sm"
          >
            Next
          </Button>
        </nav>
      </div>
    </Card>
  );
};

export default CaseList;