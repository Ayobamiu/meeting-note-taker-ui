import { GoogleMeetIcon, ZoomIcon, WebexIcon, TeamsIcon } from '@/components/icons/PlatformIcons';

export function getMeetingPlatform(meetingUrl) {
    if (!meetingUrl) return null;

    const url = meetingUrl.toLowerCase();

    if (url.includes('meet.google.com') || url.includes('meet/')) {
        return 'google-meet';
    }
    if (url.includes('zoom.us') || url.includes('zoom.com')) {
        return 'zoom';
    }
    if (url.includes('webex.com') || url.includes('cisco.com')) {
        return 'webex';
    }
    if (url.includes('teams.microsoft.com') || url.includes('teams.live.com')) {
        return 'teams';
    }

    return null;
}

export function getPlatformIcon(platform) {
    switch (platform) {
        case 'google-meet':
            return GoogleMeetIcon;
        case 'zoom':
            return ZoomIcon;
        case 'webex':
            return WebexIcon;
        case 'teams':
            return TeamsIcon;
        default:
            return null;
    }
}

export function getPlatformName(platform) {
    switch (platform) {
        case 'google-meet':
            return 'Google Meet';
        case 'zoom':
            return 'Zoom';
        case 'webex':
            return 'Webex';
        case 'teams':
            return 'Teams';
        default:
            return 'Meeting';
    }
}

