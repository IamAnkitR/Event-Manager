export interface ITicket {
  title: string;
  price: number;
  quantity: number;
}

export interface IEvent {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  organizer: string;
  tickets: ITicket[];
}
