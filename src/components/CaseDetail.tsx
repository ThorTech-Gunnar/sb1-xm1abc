import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AlertCircle, Clock, CheckCircle, User, Calendar, FileText, Send, Download, MapPin } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Card, Title, Badge, Button, TextInput, Textarea, Select, SelectItem } from '@tremor/react';
import FileVideoUpload from './FileVideoUpload';
import FloorPlanViewer from './FloorPlanViewer';
import api from '../utils/api';

interface Case {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in progress' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  assignedTo: string;
  updates: Array<{ id: string; user: string; content: string; createdAt: string }>;
  files: Array<{ id: string; name: string; type: string; uploadedAt: string; uploadedBy: string }>;
  floorPlanId?: string;
  incidentLocation?: { x: number; y: number };
}

const CaseDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [case_, setCase] = useState<Case | null>(null);
  const [newUpdate, setNewUpdate] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    if (id) {
      fetchCase();
    }
  }, [id]);

  const fetchCase = async () => {
    try {
      const response = await api.get(`/cases/${id}`);
      setCase(response.data);
    } catch (error) {
      console.error('Error fetching case:', error);
    }
  };

  const handleStatusChange = async (newStatus: Case['status']) => {
    try {
      await api.put(`/cases/${id}`, { status: newStatus });
      fetchCase();
    } catch (error) {
      console.error('Error updating case status:', error);
    }
  };

  const handleAddUpdate = async () => {
    try {
      await api.post(`/cases/${id}/updates`, { content: newUpdate });
      setNewUpdate('');
      fetchCase();
    } catch (error) {
      console.error('Error adding update:', error);
    }
  };

  const handleExportCase = async () => {
    try {
      const response = await api.get(`/cases/${id}/export`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `case_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error exporting case:', error);
    }
  };

  if (!case_) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Title>{case_.title}</Title>
          <Badge color={case_.status === 'open' ? 'yellow' : case_.status === 'in progress' ? 'blue' : 'green'} size="xl">
            {case_.status}
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Assigned To</p>
            <p className="font-medium">{case_.assignedTo}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Created At</p>
            <p className="font-medium">{new Date(case_.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Priority</p>
            <Badge color={case_.priority === 'low' ? 'green' : case_.priority === 'medium' ? 'yellow' : case_.priority === 'high' ? 'orange' : 'red'} size="sm">
              {case_.priority}
            </Badge>
          </div>
        </div>
        <p className="text-gray-700 mb-4">{case_.description}</p>
        <div className="flex space-x-2">
          <Select value={case_.status} onValueChange={handleStatusChange}>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in progress">In Progress</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </Select>
          <Button onClick={handleExportCase} icon={Download} variant="secondary">
            Export Case
          </Button>
        </div>
      </Card>

      <Card>
        <Title>Updates</Title>
        <div className="space-y-4 mt-4">
          {case_.updates.map((update) => (
            <div key={update.id} className="border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{update.user}</span>
                <span className="text-sm text-gray-500">{new Date(update.createdAt).toLocaleString()}</span>
              </div>
              <p>{update.content}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Textarea
            placeholder="Add an update..."
            value={newUpdate}
            onChange={(e) => setNewUpdate(e.target.value)}
          />
          <Button
            className="mt-2"
            onClick={handleAddUpdate}
            icon={Send}
            disabled={!newUpdate.trim()}
            style={{ backgroundColor: theme.primaryColor }}
          >
            Add Update
          </Button>
        </div>
      </Card>

      <Card>
        <Title>Files and Evidence</Title>
        <FileVideoUpload caseId={case_.id} onUploadComplete={fetchCase} />
        <div className="mt-4">
          {case_.files.map((file) => (
            <div key={file.id} className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center">
                <FileText className="mr-2" size={18} />
                <span>{file.name}</span>
              </div>
              <div className="text-sm text-gray-500">
                Uploaded by {file.uploadedBy} on {new Date(file.uploadedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {case_.floorPlanId && (
        <Card>
          <Title>Incident Location</Title>
          <FloorPlanViewer
            floorPlanId={case_.floorPlanId}
            incidentLocation={case_.incidentLocation}
            onLocationUpdate={(location) => {
              // Handle location update
            }}
          />
        </Card>
      )}
    </div>
  );
};

export default CaseDetail;