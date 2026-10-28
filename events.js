/* Add only confirmed events. Use full ISO timestamps with the correct local UTC
   offset: Arkansas is -05:00 in daylight time and -06:00 in standard time.
   Example fields: {title, venue, address, start, end, mapsUrl}.
   Keep confirmedEvents empty until Scott confirms dates AND times. */
const confirmedEvents = [
  {
    "title": "Sunday coin-counting stop",
    "venue": "ESQ Realty Group parking lot",
    "address": "422 W Grand Avenue, Hot Springs, AR 71901",
    "start": "2026-11-01T10:00:00-06:00",
    "end": "2026-11-01T12:00:00-06:00",
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=422%20W%20Grand%20Avenue%2C%20Hot%20Springs%2C%20AR%2071901"
  }
];
const eventList = document.getElementById('event-list');
function renderEvents() {
const now = new Date();
const upcoming = confirmedEvents.filter(event => {
  const start = new Date(event.start), end = new Date(event.end);
  return !Number.isNaN(start.getTime()) && end > start && end > now;
}).sort((a,b) => new Date(a.start) - new Date(b.start));
if (!eventList) return;
if (!upcoming.length) {
  eventList.replaceChildren();
  const message=document.createElement('p'); message.className='event-empty';message.textContent='Contact Scott for the next confirmed location and time.';
  const link=document.createElement('a');link.href='#contact';link.textContent='Ask about the next stop ↗';
  eventList.append(message,link);
} else {
  eventList.replaceChildren();
  const dateFormat = new Intl.DateTimeFormat('en-US', {timeZone:'America/Chicago',weekday:'long',month:'long',day:'numeric',year:'numeric'});
  const timeFormat = new Intl.DateTimeFormat('en-US', {timeZone:'America/Chicago',hour:'numeric',minute:'2-digit',timeZoneName:'short'});
  for (const event of upcoming) {
    const article = document.createElement('article'); article.className='event';
    const heading = document.createElement('h3'); heading.textContent=event.title;
    const date = document.createElement('p'); date.className='event-date'; date.textContent=dateFormat.format(new Date(event.start));
    const time = document.createElement('p'); time.textContent=timeFormat.format(new Date(event.start))+' – '+timeFormat.format(new Date(event.end));
    const venue = document.createElement('p'); venue.textContent=event.venue;
    const address = document.createElement('p'); address.textContent=event.address;
    article.append(heading,date,time,venue,address);
    if (event.mapsUrl && /^https:\/\//.test(event.mapsUrl)) {const map=document.createElement('a');map.href=event.mapsUrl;map.textContent='Directions to '+event.venue;article.append(map);}
    eventList.append(article);
  }
}

}
renderEvents();
setInterval(renderEvents, 60000);
