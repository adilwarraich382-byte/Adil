export type TournamentMode = 'SOLO' | 'DUO' | 'SQUAD';
export type TournamentStatus =
  | 'UPCOMING'
  | 'REGISTRATION_OPEN'
  | 'REGISTRATION_CLOSED'
  | 'LIVE'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type RegistrationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  whatsapp: string;
  ffUid: string;
  ffIgn: string;
  photoURL?: string;
  role: 'user' | 'admin';
  isBlocked?: boolean;
  tournamentsJoinedCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Tournament {
  id: string;
  title: string;
  mode: TournamentMode;
  entryFee: number;
  prizePool: number;
  firstPrize: number;
  secondPrize: number;
  thirdPrize: number;
  perKillPrize?: number;
  totalSlots: number;
  filledSlots: number;
  matchDate: string;
  matchTime: string;
  map: 'Bermuda' | 'Purgatory' | 'Kalahari' | 'Alpine' | 'NexTerra' | string;
  status: TournamentStatus;
  bannerUrl?: string;
  rules?: string;
  roomId?: string;
  roomPassword?: string;
  credentialsPublishedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RoomCredential {
  roomId: string;
  roomPassword: string;
  matchTime: string;
  instructions: string;
  publishedAt: string;
}

export interface Registration {
  id: string;
  tournamentId: string;
  tournamentTitle: string;
  tournamentMode: TournamentMode;
  userId: string;
  userName: string;
  userEmail: string;
  whatsapp: string;
  ffUid: string;
  ffIgn: string;
  teammateNames?: string;
  paymentId: string;
  status: RegistrationStatus;
  slotNumber?: number;
  registeredAt: string;
  rejectionReason?: string;
}

export interface Payment {
  id: string;
  registrationId: string;
  tournamentId: string;
  tournamentTitle: string;
  entryFee: number;
  paymentMethod: string;
  recipientNumber: string;
  recipientName: string;
  senderName: string;
  senderPhone: string;
  transactionId: string;
  amountPaid: number;
  screenshotUrl?: string;
  status: PaymentStatus;
  rejectionReason?: string;
  userId: string;
  userEmail: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type:
    | 'PAYMENT_SUBMITTED'
    | 'PAYMENT_APPROVED'
    | 'PAYMENT_REJECTED'
    | 'ROOM_PUBLISHED'
    | 'TOURNAMENT_UPDATE'
    | 'RESULTS_ANNOUNCED'
    | 'SYSTEM';
  read: boolean;
  targetId?: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'BANNER' | 'POPUP' | 'URGENT' | 'GENERAL';
  active: boolean;
  createdAt: string;
}

export interface WinnerEntry {
  position: number;
  playerName: string;
  ffUid: string;
  ffIgn?: string;
  prizeAmount: number;
  kills: number;
  teamName?: string;
}

export interface TournamentResult {
  id: string;
  tournamentId: string;
  tournamentTitle: string;
  tournamentMode?: string;
  matchDate: string;
  map?: string;
  winners: WinnerEntry[];
  notes?: string;
  publishedAt: string;
}

export interface PrizeDistribution {
  id: string;
  tournamentId: string;
  winnerUid?: string;
  playerName: string;
  ffUid: string;
  prizeAmount: number;
  paymentMethod: string;
  transactionRef: string;
  status: 'PENDING' | 'SENT';
  sentAt?: string;
}

export interface AppSettings {
  id: string;
  easyPaisaNumber: string;
  easyPaisaName: string;
  whatsappSupportNumber: string;
  minDeposit: number;
  defaultSoloFee: number;
  defaultSoloPrize: number;
  defaultDuoFee: number;
  defaultDuoPrize: number;
  defaultSquadFee: number;
  defaultSquadPrize: number;
  maintenanceMode?: boolean;
  tournamentRulesText?: string;
  privacyPolicyText?: string;
  termsConditionsText?: string;
  refundPolicyText?: string;
  rulesUrl?: string;
  updatedAt?: string;
}
