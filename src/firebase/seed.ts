import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './config';
import { ADMIN_BRAND } from '../assets/branding';

export async function ensureInitialDatabaseData() {
  try {
    // 1. Seed app_settings if not present
    const settingsRef = doc(db, 'app_settings', 'general');
    const settingsSnap = await getDoc(settingsRef);
    if (!settingsSnap.exists()) {
      await setDoc(settingsRef, {
        id: 'general',
        easyPaisaNumber: ADMIN_BRAND.defaultEasyPaisaNumber,
        easyPaisaName: ADMIN_BRAND.defaultEasyPaisaName,
        whatsappSupportNumber: ADMIN_BRAND.defaultWhatsappSupport,
        minDeposit: 200,
        defaultSoloFee: 100,
        defaultSoloPrize: 500,
        defaultDuoFee: 200,
        defaultDuoPrize: 1000,
        defaultSquadFee: 400,
        defaultSquadPrize: 2000,
        rulesUrl: 'https://adilesports.pk/rules',
        updatedAt: new Date().toISOString()
      }, { merge: true });
      console.log('Seeded initial app_settings/general');
    }

    // 2. Seed initial tournaments if none exist
    const tournamentsSnap = await getDocs(collection(db, 'tournaments'));
    if (tournamentsSnap.empty) {
      const today = new Date();
      const matchDateStr = new Date(today.getTime() + 24 * 3600 * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      const initialTournaments = [
        {
          id: 'tourney_solo_bermuda_01',
          title: 'BERMUDA SUPREMACY - SOLO CUP',
          mode: 'SOLO',
          entryFee: 100,
          prizePool: 500,
          firstPrize: 300,
          secondPrize: 150,
          thirdPrize: 50,
          perKillPrize: 10,
          totalSlots: 48,
          filledSlots: 18,
          matchDate: matchDateStr,
          matchTime: '08:00 PM PKT',
          map: 'Bermuda',
          status: 'REGISTRATION_OPEN',
          bannerUrl: ADMIN_BRAND.banner,
          rules: '1. No emulators or PC allowed (Mobile only).\n2. No hacking, scripts, or config abuse.\n3. Room ID & password will be revealed 15 minutes before match start to approved players.\n4. Teaming up in Solo matches leads to an immediate ban.',
          createdAt: new Date().toISOString()
        },
        {
          id: 'tourney_duo_purgatory_02',
          title: 'PURGATORY DUO WARZONE',
          mode: 'DUO',
          entryFee: 200,
          prizePool: 1000,
          firstPrize: 600,
          secondPrize: 300,
          thirdPrize: 100,
          perKillPrize: 15,
          totalSlots: 24,
          filledSlots: 10,
          matchDate: matchDateStr,
          matchTime: '09:30 PM PKT',
          map: 'Purgatory',
          status: 'REGISTRATION_OPEN',
          bannerUrl: ADMIN_BRAND.banner,
          rules: '1. Both players must register with valid Free Fire UIDs.\n2. Team voice chat allowed.\n3. Top 3 teams win cash prize via EasyPaisa.\n4. Screenshots required for disputes.',
          createdAt: new Date().toISOString()
        },
        {
          id: 'tourney_squad_kalahari_03',
          title: 'KALAHARI SQUAD CHAMPIONSHIP',
          mode: 'SQUAD',
          entryFee: 400,
          prizePool: 2000,
          firstPrize: 1200,
          secondPrize: 500,
          thirdPrize: 300,
          perKillPrize: 25,
          totalSlots: 12,
          filledSlots: 5,
          matchDate: matchDateStr,
          matchTime: '11:00 PM PKT',
          map: 'Kalahari',
          status: 'REGISTRATION_OPEN',
          bannerUrl: ADMIN_BRAND.banner,
          rules: '1. 4 Players per squad.\n2. Squad leader submits payment & lists squad members.\n3. Cash prizes distributed directly to squad leader EasyPaisa.\n4. Live streaming on ADIL ESPORTS channel.',
          createdAt: new Date().toISOString()
        },
        {
          id: 'tourney_solo_alpine_04',
          title: 'ALPINE SURVIVAL PRO - SOLO',
          mode: 'SOLO',
          entryFee: 100,
          prizePool: 500,
          firstPrize: 300,
          secondPrize: 150,
          thirdPrize: 50,
          perKillPrize: 10,
          totalSlots: 48,
          filledSlots: 42,
          matchDate: 'Tonight',
          matchTime: '06:00 PM PKT',
          map: 'Alpine',
          status: 'LIVE',
          bannerUrl: ADMIN_BRAND.banner,
          rules: 'Match is currently in progress. Room is locked.',
          createdAt: new Date().toISOString()
        }
      ];

      for (const t of initialTournaments) {
        await setDoc(doc(db, 'tournaments', t.id), t);
      }
      console.log('Seeded initial tournaments');
    }

    // 3. Seed initial announcements if none exist
    const announcementsSnap = await getDocs(collection(db, 'announcements'));
    if (announcementsSnap.empty) {
      await setDoc(doc(db, 'announcements', 'ann_welcome'), {
        id: 'ann_welcome',
        title: '🔥 Welcome to ADIL ESPORTS Official User App!',
        content: 'Register for Solo, Duo & Squad tournaments, pay securely via EasyPaisa (03456311135), receive verified Match Room credentials, and compete for daily cash prize pools!',
        type: 'BANNER',
        active: true,
        createdAt: new Date().toISOString()
      });
      await setDoc(doc(db, 'announcements', 'ann_easypaisa_alert'), {
        id: 'ann_easypaisa_alert',
        title: '⚠️ EasyPaisa Payment Verification Notice',
        content: 'Always send the exact entry fee to 03456311135 (ADIL ESPORTS). Keep your Transaction ID (TRX ID) safe and attach screenshot for fast 5-minute admin verification.',
        type: 'GENERAL',
        active: true,
        createdAt: new Date().toISOString()
      });
    }

    // 4. Seed initial tournament results if none exist
    const resultsSnap = await getDocs(collection(db, 'tournament_results'));
    if (resultsSnap.empty) {
      await setDoc(doc(db, 'tournament_results', 'res_grand_solo_01'), {
        id: 'res_grand_solo_01',
        tournamentId: 'tourney_past_01',
        tournamentTitle: 'GRAND BERMUDA SOLO SHOWDOWN',
        tournamentMode: 'SOLO',
        matchDate: 'Nov 8, 2026',
        map: 'Bermuda',
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        winners: [
          {
            position: 1,
            playerName: 'AdilWarraich_FF',
            ffUid: '2847910245',
            ffIgn: '亗ADIL亗',
            prizeAmount: 1500,
            kills: 14,
            teamName: 'WARRAICH SQUAD'
          },
          {
            position: 2,
            playerName: 'ShadowSniper_PK',
            ffUid: '1984720183',
            ffIgn: '⚡SHADOW⚡',
            prizeAmount: 800,
            kills: 9,
            teamName: 'CYBER TITANS'
          },
          {
            position: 3,
            playerName: 'Falcon_King99',
            ffUid: '3109482710',
            ffIgn: '꧁FALCON꧂',
            prizeAmount: 400,
            kills: 7,
            teamName: 'FALCON ESPORTS'
          }
        ],
        notes: 'Congratulations to all winners! All prize payouts were dispatched via EasyPaisa.'
      });
    }
  } catch (err) {
    console.warn('Initial seeding skipped or already provisioned:', err);
  }
}
