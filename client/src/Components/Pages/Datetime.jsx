/* eslint-disable react/prop-types */
import { Badge, Card, Button } from 'rsuite';

export function getTodoList(date) {
  if (!date) {
    return [];
  }
  const day = date.getDate();

  switch (day) {
    case 10:
      return [
        { time: '10:30 AM' },
        { time: '12:00 PM' }
      ];
    case 15:
      return [
        { time: '06:30 AM' },
        { time: '07:30 AM' },
        { time: '08:30 AM' },
        { time: '09:30 AM' },
        { time: '10:30 AM' },
        { time: '11:30 AM' },
        { time: '12:30 PM' },
        { time: '14:00 PM' },
        { time: '15:00 PM' },
        { time: '16:00 PM' },
        { time: '17:00 PM' },
        { time: '18:00 PM' },
        { time: '19:00 PM' },
        { time: '20:00 PM' },
        { time: '21:00 PM' },
      ];
    case 16:
      return [
        { time: '08:30 AM' },
        { time: '09:30 AM' },
      ];
    case 17:
      return [
        { time: '09:30 AM' },
        { time: '12:30 PM' },
        { time: '14:00 PM' },
        { time: '15:00 PM' },
        { time: '18:00 PM' }
      ];
    case 27:
      return [
        { time: '12:30 PM' },
        { time: '14:00 PM' },
        { time: '15:00 PM' },
        { time: '18:00 PM' }
      ];
    default:
      return [];
  }
}

export function renderCell(date) {
  const list = getTodoList(date);

  if (list.length) {
    return <Badge className="calendar-todo-item-badge" />;
  }

  return null;
}

export const TodoList = ({ date }) => {
  const list = getTodoList(date);
  if (!list.length) return null;
  const morningItems = list.filter(item => parseInt(item.time.split(":")[0]) < 12);
  const afternoonItems = list.filter(item => parseInt(item.time.split(":")[0]) >= 12);

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Card style={{ flex: 1, height: "320px", overflowY: "auto" }}>
      <h5 className='text-center m-3'>{formattedDate}</h5>
      {morningItems.length > 0 && (
        <div className='m-2'>
          <h4 style={{ fontWeight: "bold" }}>☀️ ຕອນເຊົ້າ</h4>
          {morningItems.map(item => (
            <Button color="cyan" appearance="ghost" key={item.time} className='m-1'>
              <div className='fs-6'>{item.time}</div>
            </Button>
          ))}
        </div>
      )}
      {afternoonItems.length > 0 && (
        <div className='m-2'>
          <h4 style={{ fontWeight: "bold" }}>🌙 ຕອນບ່າຍ-ຕອນແລງ</h4>
          {afternoonItems.map(item => (
            <Button color="cyan" appearance="ghost" key={item.time} className='m-1'>
              <div className='fs-6'>{item.time}</div>
            </Button>
          ))}
        </div>
      )}
    </Card>
  );
};