import { db } from "./db";

export const getOrCreateConversation = async (
    memberOneId: string,
    memberTwoId: string
) => {
    let conversation =
        (await findConversataion(memberOneId, memberTwoId)) ||
        (await findConversataion(memberTwoId, memberOneId));
    if (conversation) {
        return conversation;
    } else {
        return await createNewConversation(memberOneId, memberTwoId);
    }
};

const findConversataion = async (memberOneId: string, memberTwoId: string) => {
    try {
        return await db.conversation.findFirst({
            where: {
                AND: [
                    { memberOneId: memberOneId },
                    { memberTwoId: memberTwoId },
                ],
            },
            include: {
                memberOne: {
                    include: {
                        profile: true,
                    },
                },
                memberTwo: {
                    include: {
                        profile: true,
                    },
                },
            },
        });
    } catch {
        return null;
    }
};

const createNewConversation = async (
    memberOneId: string,
    memberTwoId: string
) => {
    try {
        return await db.conversation.create({
            data: {
                memberOneId,
                memberTwoId,
            },
            include: {
                memberOne: {
                    include: {
                        profile: true,
                    },
                },
                memberTwo: {
                    include: {
                        profile: true,
                    },
                },
            },
        });
    } catch {
        return null;
    }
};
