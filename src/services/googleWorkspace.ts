import { getAccessToken } from './googleAuth';
import { WorkspaceItem } from '../types/gid';

/**
 * Assess preliminary ETIS role relevance based on keywords in title and snippet
 */
function assessRelevance(text: string): { relevance: 'Core ETIS' | 'Supporting' | 'Time Leak'; suggestion: string } {
  const lower = text.toLowerCase();
  
  // Hardware and sysadmin triggers
  if (
    lower.includes('printer') || 
    lower.includes('projector') || 
    lower.includes('cable') || 
    lower.includes('hdmi') || 
    lower.includes('password reset') || 
    lower.includes('broken screen') ||
    lower.includes('wifi down') ||
    lower.includes('toner')
  ) {
    return {
      relevance: 'Time Leak',
      suggestion: 'Hardware / Infrastructure ticket. Route to IT Help Desk or Facilities.',
    };
  }

  // Core ETIS & GID triggers
  if (
    lower.includes('gid') || 
    lower.includes('inquiry') || 
    lower.includes('ai') || 
    lower.includes('co-plan') || 
    lower.includes('curriculum') || 
    lower.includes('rubric') || 
    lower.includes('diffit') || 
    lower.includes('notebooklm') || 
    lower.includes('canva') || 
    lower.includes('pedagogy') ||
    lower.includes('workshop') ||
    lower.includes('research')
  ) {
    return {
      relevance: 'Core ETIS',
      suggestion: 'High-leverage educational technology & inquiry integration.',
    };
  }

  return {
    relevance: 'Supporting',
    suggestion: 'General instructional coordination or administrative support.',
  };
}

/**
 * Fetch Google Drive recent files and curriculum folders
 */
export async function fetchLiveDriveFiles(): Promise<WorkspaceItem[]> {
  const token = await getAccessToken();
  if (!token) return [];

  try {
    const res = await fetch(
      'https://www.googleapis.com/drive/v3/files?pageSize=15&fields=files(id,name,mimeType,webViewLink,modifiedTime,owners)&orderBy=modifiedTime desc',
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      console.warn('Drive API response not ok:', res.status);
      return [];
    }

    const data = await res.json();
    const files = data.files || [];

    return files.map((file: any) => {
      const assessment = assessRelevance(file.name);
      return {
        id: `drive-${file.id}`,
        source: 'drive',
        title: file.name,
        snippet: `Google Drive file (${file.mimeType?.split('.').pop() || 'document'}). Modified ${new Date(file.modifiedTime).toLocaleDateString()}`,
        timestamp: new Date(file.modifiedTime).toLocaleDateString(),
        url: file.webViewLink,
        senderOrOwner: file.owners?.[0]?.displayName || 'Google Drive',
        relevanceToEtis: assessment.relevance,
        suggestedAction: assessment.suggestion,
      };
    });
  } catch (err) {
    console.error('Error fetching Drive files:', err);
    return [];
  }
}

/**
 * Fetch Google Calendar events (faculty coaching & department sessions)
 */
export async function fetchLiveCalendarEvents(): Promise<WorkspaceItem[]> {
  const token = await getAccessToken();
  if (!token) return [];

  try {
    const now = new Date();
    const timeMin = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const timeMax = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();

    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&maxResults=20&singleEvents=true&orderBy=startTime`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      console.warn('Calendar API response not ok:', res.status);
      return [];
    }

    const data = await res.json();
    const events = data.items || [];

    return events.map((event: any) => {
      const start = event.start?.dateTime || event.start?.date || '';
      const summary = event.summary || 'Untitled Meeting';
      const description = event.description || '';
      const assessment = assessRelevance(`${summary} ${description}`);

      return {
        id: `cal-${event.id}`,
        source: 'calendar',
        title: summary,
        snippet: description.slice(0, 160) || `Calendar event scheduled for ${new Date(start).toLocaleString()}`,
        timestamp: new Date(start).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        url: event.htmlLink,
        senderOrOwner: event.organizer?.displayName || event.organizer?.email || 'Calendar',
        relevanceToEtis: assessment.relevance,
        suggestedAction: assessment.suggestion,
      };
    });
  } catch (err) {
    console.error('Error fetching Calendar events:', err);
    return [];
  }
}

/**
 * Fetch Gmail messages (recent faculty threads and requests)
 */
export async function fetchLiveGmailMessages(): Promise<WorkspaceItem[]> {
  const token = await getAccessToken();
  if (!token) return [];

  try {
    const listRes = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10&q=category:primary',
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!listRes.ok) return [];
    const listData = await listRes.json();
    const messageRefs = listData.messages || [];

    const items: WorkspaceItem[] = [];

    // Fetch individual snippet headers
    for (const msgRef of messageRefs.slice(0, 8)) {
      try {
        const msgRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msgRef.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!msgRes.ok) continue;
        const msg = await msgRes.json();
        const headers = msg.payload?.headers || [];
        const subject = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || 'No Subject';
        const from = headers.find((h: any) => h.name.toLowerCase() === 'from')?.value || 'Unknown Sender';
        const snippet = msg.snippet || '';

        const assessment = assessRelevance(`${subject} ${snippet}`);

        items.push({
          id: `gmail-${msg.id}`,
          source: 'gmail',
          title: subject,
          snippet: snippet,
          timestamp: new Date(parseInt(msg.internalDate)).toLocaleDateString([], { month: 'short', day: 'numeric' }),
          senderOrOwner: from,
          relevanceToEtis: assessment.relevance,
          suggestedAction: assessment.suggestion,
        });
      } catch (e) {
        // Continue
      }
    }

    return items;
  } catch (err) {
    console.error('Error fetching Gmail messages:', err);
    return [];
  }
}
