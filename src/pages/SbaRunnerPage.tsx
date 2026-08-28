import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getSbaPractical } from '../data/sba-practicals';
import SbaRunner from '../components/sba/SbaRunner';

export default function SbaRunnerPage() {
  const { practicalId } = useParams<{ practicalId: string }>();

  if (!practicalId) {
    return <Navigate to="/app/sba" replace />;
  }

  const practical = getSbaPractical(practicalId);

  if (!practical) {
    return <Navigate to="/app/sba" replace />;
  }

  return <SbaRunner practical={practical} />;
}
