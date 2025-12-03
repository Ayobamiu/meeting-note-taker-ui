'use client';

import { useSearchParams } from 'next/navigation';
import CollapsibleSidebar from './CollapsibleSidebar';

export default function SidebarWrapper(props) {
  const searchParams = useSearchParams();
  const selectedMeetingId = searchParams?.get('id');
  
  return (
    <CollapsibleSidebar
      {...props}
      selectedMeetingId={selectedMeetingId}
    />
  );
}

