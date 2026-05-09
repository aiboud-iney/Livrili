export type Shipment = {

  id: number;
  title: string;
  from_pickup_date: string;
  to_pickup_date: string;
  weight: string;
  volume: string;
  phone_number: string;
  status: string;
  created_by: number;
  shipment_pictures: string[];
  created_at: string;
  origin: string;
  destination: string;
  shipment_type?: string | null;
  truck_type?: string | null;

  type: "SHIPMENT";
  dateRange: string;
  company: string;
  postedMinsAgo: number;
};

export type Route = {

  id: number;
  posted_by: number;
  origin: string;
  destination: string;
  transit_cities: string[];
  departure_date: string;
  end_date?: string;
  max_weight: string;
  transit_wilayas?: string[];
  max_volume: string;
  contact_phone: string;
  status: string;
  created_at: string;
  phonecountrycode: string;
  notes: string;
  truck_type: string | null;
  assigned_truck_id: number | null;
  truck_type_code?: string | null;
  trip_type?: "aller" | "aller-retour" | null;

  type: "ROUTE";
  date: string;
  truckType: string | null;
  weightAvailable: number;
  volumeAvailable: number;
  company: string;
  postedMinsAgo: number;
};

export const fmtWeight    = (w: string) => `${w}T`
export const fmtVolume    = (v: string) => `${v}m³`

export const fmtPostedAgoFromDate = (createdAt: string) => {
  const minutesAgo = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
  if (minutesAgo < 60) {
    return `${minutesAgo} min ago`;
  }
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) {
    return `${hoursAgo} hr ago`;
  }
  const daysAgo = Math.floor(hoursAgo / 24);
  return `${daysAgo} days ago`;
}