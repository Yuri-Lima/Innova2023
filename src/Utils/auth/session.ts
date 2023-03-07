import { SessionModel } from "../../db/models/auth.session.model";

async function createSession({ userId }: { userId: string }) {
    return SessionModel.create({ user: userId });
}

async function findSessionById(sessionId: string) {
    return SessionModel.findById(sessionId);
}

export {
    createSession,
    findSessionById
}