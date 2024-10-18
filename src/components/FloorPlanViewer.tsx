import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import api from '../utils/api';

interface FloorPlanViewerProps {
  floorPlanId: string;
  incidentLocation?: { x: number; y: number };
  onLocationUpdate: (location: { x: number; y: number }) => void;
}

const FloorPlanViewer: React.FC<FloorPlanViewerProps> = ({ floorPlanId, incidentLocation, onLocationUpdate }) => {
  const [floorPlan, setFloorPlan] = useState<{ id: string; name: string; imageUrl: string } | null>(null);
  const [markerPosition, setMarkerPosition] = useState(incidentLocation);
  const imageRef = useRef<HTMLImageElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    fetchFloorPlan();
  }, [floorPlanId]);

  const fetchFloorPlan = async () => {
    try {
      const response = await api.get(`/floor-plans/${floorPlanId}`);
      setFloorPlan(response.data);
    } catch (error) {
      console.error('Error fetching floor plan:', error);
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMarkerPosition({ x, y });
      onLocationUpdate({ x, y });
    }
  };

  if (!floorPlan) {
    return <div>Loading floor plan...</div>;
  }

  return (
    <div className="relative">
      <img
        ref={imageRef}
        src={floorPlan.imageUrl}
        alt={floorPlan.name}
        className="w-full h-auto"
        onClick={handleImageClick}
      />
      {markerPosition && (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${markerPosition.x * 100}%`,
            top: `${markerPosition.y * 100}%`,
          }}
        >
          <MapPin size={24} color={theme.primaryColor} />
        </div>
      )}
    </div>
  );
};

export default FloorPlanViewer;