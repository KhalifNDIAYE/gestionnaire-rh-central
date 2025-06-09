
import * as OTPAuth from 'otpauth';
import QRCode from 'qrcode';

export interface MFASetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface MFAStatus {
  isEnabled: boolean;
  lastUsed?: string;
  backupCodesRemaining: number;
}

class MFAService {
  private readonly issuer = 'RH Management';

  generateSecret(): string {
    return OTPAuth.Secret.generate().base32;
  }

  async setupMFA(userEmail: string, userName: string): Promise<MFASetup> {
    const secret = this.generateSecret();
    
    // Créer l'URL TOTP
    const totp = new OTPAuth.TOTP({
      issuer: this.issuer,
      label: userEmail,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secret,
    });

    const otpAuthUrl = totp.toString();
    
    // Générer le QR code
    const qrCodeUrl = await QRCode.toDataURL(otpAuthUrl);
    
    // Générer des codes de sauvegarde
    const backupCodes = this.generateBackupCodes();
    
    return {
      secret,
      qrCodeUrl,
      backupCodes
    };
  }

  verifyToken(secret: string, token: string): boolean {
    try {
      const totp = new OTPAuth.TOTP({
        issuer: this.issuer,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: secret,
      });

      // Vérifier le token avec une fenêtre de tolérance de ±1 période (30s)
      const delta = totp.validate({ token, window: 1 });
      return delta !== null;
    } catch (error) {
      console.error('Erreur lors de la vérification du token MFA:', error);
      return false;
    }
  }

  private generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }
    return codes;
  }

  // Simuler la vérification d'un code de sauvegarde
  verifyBackupCode(userBackupCodes: string[], code: string): boolean {
    const index = userBackupCodes.indexOf(code.toUpperCase());
    if (index !== -1) {
      // Supprimer le code utilisé
      userBackupCodes.splice(index, 1);
      return true;
    }
    return false;
  }

  getMFAStatus(user: any): MFAStatus {
    return {
      isEnabled: !!user.mfaSecret,
      lastUsed: user.mfaLastUsed,
      backupCodesRemaining: user.backupCodes?.length || 0
    };
  }
}

export const mfaService = new MFAService();
