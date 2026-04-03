import { OnApplicationBootstrap } from '@nestjs/common';
export declare class FirebaseService implements OnApplicationBootstrap {
    private readonly logger;
    onApplicationBootstrap(): void;
    sendMulticast(tokens: string[], data: any, title: string, body: string): Promise<import("node_modules/firebase-admin/lib/messaging/messaging-api").BatchResponse | undefined>;
}
