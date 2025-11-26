export type RaffleStatus = 'active' | 'closed' | 'draft' | 'sold_out';

export interface Raffle {
    id: string;
    title: string;
    description: string;
    price: number;
    totalTickets: number;
    soldTickets: number;
    status: RaffleStatus;
    endDate: string; // ISO Date string
    imageUrl?: string;
    organizerId: string;
}

export interface Ticket {
    id: string;
    number: number;
    raffleId: string;
    purchaserName?: string;
    purchaserPhone?: string;
    status: 'available' | 'reserved' | 'sold';
}

export interface Organizer {
    id: string;
    name: string;
    email: string;
    phone: string;
    bio?: string;
    avatarUrl?: string;
}
