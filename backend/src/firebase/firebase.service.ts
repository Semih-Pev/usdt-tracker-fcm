import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FirebaseService implements OnApplicationBootstrap {
  private readonly logger = new Logger(FirebaseService.name);

  onApplicationBootstrap() {
    try {
      let credentialOptions: any;

      const serviceAccountPath = path.resolve(process.cwd(), 'firebase-service-account.json');
      if (fs.existsSync(serviceAccountPath)) {
        credentialOptions = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      } else if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL) {
        credentialOptions = {
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        };
      }

      if (!credentialOptions) {
        this.logger.warn('Firebase Admin credentials missing. Ensure firebase-service-account.json exists or .env is configured properly.');
        return;
      }

      admin.initializeApp({
        credential: admin.credential.cert(credentialOptions),
      });

      this.logger.log('Firebase Admin initialized successfully.');
    } catch (e) {
      this.logger.error('Error initializing Firebase admin:', e);
    }
  }

  async sendMulticast(tokens: string[], data: any, title: string, body: string) {
    if (!admin.apps.length) {
      this.logger.warn('Firebase not initialized. Can not send notification.');
      return;
    }
    if (tokens.length === 0) {
       this.logger.log('No FCM tokens registered. Skipping notification.');
       return;
    }

    try {
      const stringifiedData = {};
      for (const [key, value] of Object.entries(data)) {
        stringifiedData[key] = String(value);
      }

      const response = await admin.messaging().sendEachForMulticast({
        tokens,
        data: stringifiedData,
        notification: {
          title,
          body,
        },
      });

      this.logger.log(`Sent FCM notifications. Success: ${response.successCount}, Failure: ${response.failureCount}`);
      return response;
    } catch (e) {
      this.logger.error('Error sending multicast message:', e);
    }
  }
}
